import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

let server;

try {
  await connectDatabase();

  server = app.listen(env.port, () => {
    console.log(`CodeLens API listening on port ${env.port}`);
  });
} catch (error) {
  console.error('Failed to start CodeLens API.', error);
  process.exit(1);
}

function shutdown(signal) {
  console.log(`${signal} received. Shutting down CodeLens API.`);

  if (!server) {
    process.exit(0);
  }

  server.close((error) => {
    if (error) {
      console.error('Error while shutting down CodeLens API.', error);
      process.exit(1);
    }

    disconnectDatabase()
      .then(() => process.exit(0))
      .catch((disconnectError) => {
        console.error('Error while disconnecting from MongoDB.', disconnectError);
        process.exit(1);
      });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
