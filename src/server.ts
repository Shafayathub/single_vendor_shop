// src/server.ts
import app from './app';
import { config } from './config';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});

// Graceful shutdown (optional but recommended)
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.info('HTTP server closed');
    // Close database connection if needed (Prisma handles this well generally)
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception thrown:', error);
    // Application specific logging, throwing an error, or other logic here
    // Consider a graceful shutdown here as well for critical errors
    process.exit(1);
});