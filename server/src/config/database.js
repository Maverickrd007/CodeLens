import mongoose from 'mongoose';

import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== 'production',
  });

  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
