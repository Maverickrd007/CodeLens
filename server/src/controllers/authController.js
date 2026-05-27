import { User } from '../models/User.js';
import { createAccessToken } from '../services/tokenService.js';
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

  try {
    await user.save();
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
    accessToken: createAccessToken(user),
  });
}

export async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  if (!validateEmail(email) || typeof password !== 'string') {
    throw new ApiError(400, 'invalid_credentials', 'Email or password is incorrect.');
  }

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !(await user.verifyPassword(password))) {
    throw new ApiError(401, 'invalid_credentials', 'Email or password is incorrect.');
  }

  res.status(200).json({
    user: buildUserResponse(user),
    accessToken: createAccessToken(user),
  });
}
