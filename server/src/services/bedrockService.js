import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const TRANSIENT_HTTP_STATUSES = new Set([408, 409, 429, 500, 502, 503, 504]);
const BASE_RETRY_DELAY_MS = 500;

let client;

function getClient() {
  if (!env.awsAccessKeyId || !env.awsSecretAccessKey) {
    throw new ApiError(500, 'missing_aws_credentials', 'AWS credentials are not configured.');
  }

  if (!client) {
    client = new BedrockRuntimeClient({
      region: env.awsRegion,
      credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
      },
    });
  }

  return client;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getRetryDelayMs(attempt) {
  const jitter = Math.floor(Math.random() * 125);
  return BASE_RETRY_DELAY_MS * 2 ** attempt + jitter;
}

function isTransientAwsError(error) {
  if (TRANSIENT_HTTP_STATUSES.has(error?.$metadata?.httpStatusCode)) {
    return true;
  }
  return error?.name === 'TimeoutError' || error?.message?.includes('timeout');
}

async function withRetry(operation) {
  let lastError;

  for (let attempt = 0; attempt <= env.aiMaxRetries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === env.aiMaxRetries || !isTransientAwsError(error)) {
        break;
      }

      await sleep(getRetryDelayMs(attempt));
    }
  }

  throw lastError;
}

function normalizeAwsError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  const statusCode = error?.$metadata?.httpStatusCode;

  if (statusCode === 401 || statusCode === 403 || error.name === 'UnrecognizedClientException') {
    return new ApiError(502, 'aws_auth_failed', 'AWS Bedrock authentication failed.');
  }

  if (statusCode === 429 || error.name === 'ThrottlingException') {
    return new ApiError(429, 'aws_rate_limited', 'AWS Bedrock rate limit exceeded.');
  }

  if (statusCode >= 400 && statusCode < 500) {
    return new ApiError(502, 'aws_request_failed', 'AWS Bedrock rejected the request: ' + error.message);
  }

  return new ApiError(502, 'aws_unavailable', 'AWS Bedrock is currently unavailable.');
}

async function createResponse({ instructions, input, schema, schemaName, temperature = 0.2 }) {
  try {
    const ai = getClient();
    
    // Add instruction for JSON format if a schema is provided
    let finalInstructions = instructions;
    if (schema) {
      finalInstructions += '\n\nIMPORTANT: You must respond ONLY with strictly valid JSON that matches the following JSON schema. Do not include markdown formatting or any other text before or after the JSON.\n\nSchema:\n' + JSON.stringify(schema, null, 2);
    }

    const messages = [
      {
        role: 'user',
        content: [{ text: finalInstructions + '\n\nInput:\n' + input }]
      }
    ];

    const command = new ConverseCommand({
      modelId: env.bedrockModelId,
      messages,
      inferenceConfig: {
        temperature,
        maxTokens: env.aiMaxOutputTokens,
      },
    });

    const response = await withRetry(() => ai.send(command));

    const outputText = response.output?.message?.content?.[0]?.text;

    if (!outputText) {
      throw new ApiError(502, 'empty_aws_response', 'AWS Bedrock returned an empty response.');
    }

    // Clean up potential markdown wrapper from response if we requested JSON
    if (schema) {
      let cleanedText = outputText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      return cleanedText;
    }

    return outputText;
  } catch (error) {
    throw normalizeAwsError(error);
  }
}

export async function createTextResponse({ instructions, input, temperature }) {
  return createResponse({ instructions, input, temperature });
}

export async function createStructuredResponse({
  instructions,
  input,
  schema,
  schemaName,
  temperature,
}) {
  const outputText = await createResponse({
    instructions,
    input,
    schema,
    schemaName,
    temperature,
  });

  try {
    return JSON.parse(outputText);
  } catch {
    throw new ApiError(502, 'invalid_aws_json', 'AWS Bedrock returned invalid structured JSON.');
  }
}
