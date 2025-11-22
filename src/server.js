import app from './app.js';
import { logger } from './utils/logger.util.js';
import prisma from './config/database.js';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const PORT = process.env.PORT || 3000;

// Initialize database on first start (for production)
async function ensureDatabase() {
  if (process.env.NODE_ENV === 'production') {
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || '/data/dev.db';
    
    if (!existsSync(dbPath)) {
      logger.info('Database not found. Initializing...');
      try {
        // Try migrate deploy first
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        logger.info('Database initialized with migrations');
      } catch (error) {
        // Fallback to db push
        logger.warn('Migration failed, using db push...');
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        logger.info('Database initialized with db push');
      }
    }
  }
}

// Start server
async function startServer() {
  await ensureDatabase();
  
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
      logger.info('HTTP server closed');
      await prisma.$disconnect();
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(async () => {
      logger.info('HTTP server closed');
      await prisma.$disconnect();
      process.exit(0);
    });
  });
  
  return server;
}

// Start the server
startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
