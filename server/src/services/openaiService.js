import OpenAI from 'openai';

import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const TRANSIENT_HTTP_STATUSES = new Set([408, 409, 429, 500, 502, 503, 504]);
const BASE_RETRY_DELAY_MS = 500;

let client;

function getClient() {
  if (!env.openaiApiKey) {
    throw new ApiError(500, 'missing_openai_api_key', 'OpenAI API key is not configured.');
  }

  if (!client) {
    client = new OpenAI({
      apiKey: env.openaiApiKey,
      maxRetries: 0,
      timeout: env.openaiRequestTimeoutMs,
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

function isTransientOpenAIError(error) {
  if (TRANSIENT_HTTP_STATUSES.has(error?.status)) {
    return true;
  }

  return error?.name === 'APIConnectionError' || error?.name === 'APIConnectionTimeoutError';
}

async function withRetry(operation) {
  let lastError;

  for (let attempt = 0; attempt <= env.openaiMaxRetries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === env.openaiMaxRetries || !isTransientOpenAIError(error)) {
        break;
      }

      await sleep(getRetryDelayMs(attempt));
    }
  }

  throw lastError;
}

function normalizeOpenAIError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error?.status === 401) {
    return new ApiError(502, 'openai_auth_failed', 'OpenAI API authentication failed.');
  }

  if (error?.status === 429) {
    return new ApiError(429, 'openai_rate_limited', 'OpenAI API rate limit exceeded.');
  }

  if (error?.status >= 400 && error?.status < 500) {
    return new ApiError(502, 'openai_request_failed', 'OpenAI API rejected the request.');
  }

  return new ApiError(502, 'openai_unavailable', 'OpenAI API is currently unavailable.');
}

function getResponseText(response) {
  if (typeof response.output_text === 'string' && response.output_text.trim() !== '') {
    return response.output_text;
  }

  const outputText = response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === 'output_text')
    .map((content) => content.text)
    .join('\n')
    .trim();

  if (!outputText) {
    throw new ApiError(502, 'empty_openai_response', 'OpenAI returned an empty response.');
  }

  return outputText;
}

async function createResponse({ instructions, input, schema, schemaName, temperature = 0.2 }) {
  try {
    const response = await withRetry(() =>
      getClient().responses.create({
        model: env.openaiModel,
        instructions,
        input,
        temperature,
        max_output_tokens: env.openaiMaxOutputTokens,
        text: schema
          ? {
              format: {
                type: 'json_schema',
                name: schemaName,
                schema,
                strict: true,
              },
            }
          : undefined,
      })
    );

    return getResponseText(response);
  } catch (error) {
    throw normalizeOpenAIError(error);
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
    throw new ApiError(502, 'invalid_openai_json', 'OpenAI returned invalid structured JSON.');
  }
}
