import { User } from '../models/User.js';
import {
  isAccessTokenExpiredError,
  isAccessTokenVerificationError,
  verifyAccessToken,
} from '../services/tokenService.js';
import { ApiError } from '../utils/ApiError.js';

function getBearerToken(req) {
  const authorizationHeader = req.get('authorization');

  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export async function requireAuth(req, _res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      throw new ApiError(401, 'auth_required', 'A bearer access token is required.');
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new ApiError(401, 'invalid_token', 'Access token is invalid.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (isAccessTokenExpiredError(error)) {
      next(new ApiError(401, 'access_token_expired', 'Access token has expired.'));
      return;
    }

    if (isAccessTokenVerificationError(error)) {
      next(new ApiError(401, 'invalid_token', 'Access token is invalid.'));
      return;
    }

    next(error);
  }
}
