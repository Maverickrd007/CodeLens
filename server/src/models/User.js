import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const PASSWORD_HASH_ROUNDS = 12;
const MAX_ACTIVE_REFRESH_TOKENS = 5;

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email address is invalid.'],
    },
    passwordHash: {
      type: String,
      select: false,
    },
    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.refreshTokens;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ 'refreshTokens.tokenHash': 1 });

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.storeRefreshToken = function storeRefreshToken(tokenHash, expiresAt) {
  const activeTokens = this.refreshTokens
    .filter((token) => token.expiresAt > new Date())
    .sort((a, b) => a.createdAt - b.createdAt);

  activeTokens.push({ tokenHash, expiresAt });

  this.refreshTokens = activeTokens.slice(-MAX_ACTIVE_REFRESH_TOKENS);
};

userSchema.methods.removeRefreshToken = function removeRefreshToken(tokenHash) {
  this.refreshTokens = this.refreshTokens.filter((token) => token.tokenHash !== tokenHash);
};

export const User = mongoose.models.User ?? mongoose.model('User', userSchema);
