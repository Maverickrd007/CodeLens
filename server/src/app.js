import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from './middleware/error.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';
import codebaseRouter from './routes/codebases.js';
import healthRouter from './routes/health.js';
import { env, isProduction } from './config/env.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '5mb' }));
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'CodeLens API',
      version: '0.1.0',
    });
  });

  app.use('/ai', aiRouter);
  app.use('/auth', authRouter);
  app.use('/codebases', codebaseRouter);
  app.use('/health', healthRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp();
