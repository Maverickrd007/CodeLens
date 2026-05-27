import crypto from 'node:crypto';

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

export function verifyAccessToken(token) {
  return jwt.verify(token, getAccessTokenSecret(), {
    issuer: 'codelens-api',
    audience: 'codelens-client',
  });
}

export function createRefreshToken() {
  return crypto.randomBytes(64).toString('base64url');
}

export function hashRefreshToken(refreshToken) {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

export function getRefreshTokenExpiryDate() {
  const expiresInMs = env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + expiresInMs);
}
