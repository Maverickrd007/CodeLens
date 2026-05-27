import { User } from '../models/User.js';
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiryDate,
  hashRefreshToken,
} from '../services/tokenService.js';
import { ApiError } from '../utils/ApiError.js';

function normalizeEmail(email) {
  return String(email ?? '')
    .trim()
    .toLowerCase();
}

function normalizeName(name) {
  const trimmedName = String(name ?? '').trim();
  return trimmedName === '' ? undefined : trimmedName;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function buildUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function isDuplicateKeyError(error) {
  return error?.code === 11000;
}

async function issueAuthTokens(user) {
  const refreshToken = createRefreshToken();

  user.storeRefreshToken(hashRefreshToken(refreshToken), getRefreshTokenExpiryDate());
  await user.save();

  return {
    accessToken: createAccessToken(user),
    refreshToken,
  };
}

export async function register(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  const name = normalizeName(req.body.name);

  if (!validateEmail(email)) {
    throw new ApiError(400, 'validation_error', 'A valid email address is required.');
  }

  if (!validatePassword(password)) {
    throw new ApiError(400, 'validation_error', 'Password must be at least 8 characters long.');
  }

  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw new ApiError(
      409,
      'email_already_registered',
      'An account already exists for this email.'
    );
  }

  const user = new User({ email, name });
  await user.setPassword(password);

  let tokens;

  try {
    tokens = await issueAuthTokens(user);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError(
        409,
        'email_already_registered',
        'An account already exists for this email.'
      );
    }

    throw error;
  }

  res.status(201).json({
    user: buildUserResponse(user),
    tokens,
  });
}

export async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!validateEmail(email) || typeof password !== 'string') {
    throw new ApiError(400, 'invalid_credentials', 'Email or password is incorrect.');
  }

  const user = await User.findOne({ email }).select('+passwordHash +refreshTokens');

  if (!user || !(await user.verifyPassword(password))) {
    throw new ApiError(401, 'invalid_credentials', 'Email or password is incorrect.');
  }

  const tokens = await issueAuthTokens(user);

  res.status(200).json({
    user: buildUserResponse(user),
    tokens,
  });
}

export async function refresh(req, res) {
  const refreshToken = req.body.refreshToken;

  if (typeof refreshToken !== 'string' || refreshToken.trim() === '') {
    throw new ApiError(400, 'refresh_token_required', 'Refresh token is required.');
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);
  const user = await User.findOne({ 'refreshTokens.tokenHash': refreshTokenHash }).select(
    '+refreshTokens'
  );

  if (!user) {
    throw new ApiError(401, 'invalid_refresh_token', 'Refresh token is invalid or expired.');
  }

  const storedToken = user.refreshTokens.find((token) => token.tokenHash === refreshTokenHash);

  if (!storedToken || storedToken.expiresAt <= new Date()) {
    user.removeRefreshToken(refreshTokenHash);
    await user.save();
    throw new ApiError(401, 'invalid_refresh_token', 'Refresh token is invalid or expired.');
  }

  user.removeRefreshToken(refreshTokenHash);
  const tokens = await issueAuthTokens(user);

  res.status(200).json({
    user: buildUserResponse(user),
    tokens,
  });
}

export async function logout(req, res) {
  const refreshToken = req.body.refreshToken;

  if (typeof refreshToken !== 'string' || refreshToken.trim() === '') {
    res.status(204).send();
    return;
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);
  const user = await User.findOne({ 'refreshTokens.tokenHash': refreshTokenHash }).select(
    '+refreshTokens'
  );

  if (user) {
    user.removeRefreshToken(refreshTokenHash);
    await user.save();
  }

  res.status(204).send();
}
