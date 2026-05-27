import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

function getAccessTokenSecret() {
  if (!env.jwtAccessSecret) {
    throw new ApiError(500, 'missing_jwt_secret', 'JWT access token secret is not configured.');
  }

  return env.jwtAccessSecret;
}

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    getAccessTokenSecret(),
    {
      expiresIn: env.jwtAccessExpiresIn,
      issuer: 'codelens-api',
      audience: 'codelens-client',
    }
  );
}
