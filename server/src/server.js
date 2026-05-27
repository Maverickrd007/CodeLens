import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`CodeLens API listening on port ${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down CodeLens API.`);

  server.close((error) => {
    if (error) {
      console.error('Error while shutting down CodeLens API.', error);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
