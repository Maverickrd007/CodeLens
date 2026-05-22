import { isProduction } from '../config/env.js';

function getStatusCode(error) {
  if (Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode < 600) {
    return error.statusCode;
  }

  if (Number.isInteger(error.status) && error.status >= 400 && error.status < 600) {
    return error.status;
  }

  return 500;
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'not_found',
      message: `Route ${req.method} ${req.originalUrl} was not found.`,
    },
  });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = getStatusCode(error);

  res.status(statusCode).json({
    error: {
      code: error.code ?? 'internal_server_error',
      message: statusCode === 500 && isProduction ? 'Unexpected server error.' : error.message,
    },
  });
}
