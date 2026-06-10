import { GoogleGenAI } from '@google/genai';

import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const TRANSIENT_HTTP_STATUSES = new Set([408, 409, 429, 500, 502, 503, 504]);
const BASE_RETRY_DELAY_MS = 500;

let client;

function getClient() {
  if (!env.geminiApiKey) {
    throw new ApiError(500, 'missing_gemini_api_key', 'Gemini API key is not configured.');
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey: env.geminiApiKey });
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

function isTransientGeminiError(error) {
  if (TRANSIENT_HTTP_STATUSES.has(error?.status)) {
    return true;
  }
  return error?.name === 'FetchError' || error?.message?.includes('timeout');
}

async function withRetry(operation) {
  let lastError;

  for (let attempt = 0; attempt <= env.geminiMaxRetries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === env.geminiMaxRetries || !isTransientGeminiError(error)) {
        break;
      }

      await sleep(getRetryDelayMs(attempt));
    }
  }

  throw lastError;
}

function normalizeGeminiError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error?.status === 401 || error?.status === 403) {
    return new ApiError(502, 'gemini_auth_failed', 'Gemini API authentication failed.');
  }

  if (error?.status === 429) {
    return new ApiError(429, 'gemini_rate_limited', 'Gemini API rate limit exceeded.');
  }

  if (error?.status >= 400 && error?.status < 500) {
    return new ApiError(502, 'gemini_request_failed', 'Gemini API rejected the request.');
  }

  return new ApiError(502, 'gemini_unavailable', 'Gemini API is currently unavailable.');
}

async function createResponse({ instructions, input, schema, schemaName, temperature = 0.2 }) {
  try {
    const ai = getClient();
    
    const contents = [
      {
        role: 'user',
        parts: [{ text: instructions + '\n\n' + input }]
      }
    ];

    const config = {
      temperature,
      maxOutputTokens: env.geminiMaxOutputTokens,
    };

    if (schema) {
      config.responseMimeType = 'application/json';
      config.responseSchema = schema;
    }

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: env.geminiModel,
        contents,
        config
      })
    );

    const outputText = response.text;

    if (!outputText) {
      throw new ApiError(502, 'empty_gemini_response', 'Gemini returned an empty response.');
    }

    return outputText;
  } catch (error) {
    throw normalizeGeminiError(error);
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
    throw new ApiError(502, 'invalid_gemini_json', 'Gemini returned invalid structured JSON.');
  }
}
