import 'dotenv/config';

const DEFAULT_PORT = 5000;

function parsePort(value) {
  if (value === undefined || value === '') {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value "${value}". Expected an integer from 1 to 65535.`);
  }

  return port;
}

function parsePositiveInteger(value, fallback, name) {
  if (value === undefined || value === '') {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`Invalid ${name} value "${value}". Expected a positive integer.`);
  }

  return parsedValue;
}

function parseOptionalPositiveInteger(value, name) {
  if (value === undefined || value === '') {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`Invalid ${name} value "${value}". Expected a positive integer.`);
  }

  return parsedValue;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/codelens',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  githubToken: process.env.GITHUB_TOKEN,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o',
  openaiMaxRetries: parsePositiveInteger(process.env.OPENAI_MAX_RETRIES, 2, 'OPENAI_MAX_RETRIES'),
  openaiRequestTimeoutMs: parsePositiveInteger(
    process.env.OPENAI_REQUEST_TIMEOUT_MS,
    60000,
    'OPENAI_REQUEST_TIMEOUT_MS'
  ),
  openaiMaxOutputTokens: parseOptionalPositiveInteger(
    process.env.OPENAI_MAX_OUTPUT_TOKENS,
    'OPENAI_MAX_OUTPUT_TOKENS'
  ),
  refreshTokenExpiresInDays: parsePositiveInteger(
    process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
    30,
    'REFRESH_TOKEN_EXPIRES_IN_DAYS'
  ),
};

export const isProduction = env.nodeEnv === 'production';
