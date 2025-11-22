import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { logger } from '../src/utils/logger.util.js';

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
    
    // Check if database exists
    if (!existsSync(dbPath)) {
      logger.info('Database not found. Initializing...');
      
      // Try to run migrations
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        logger.info('Migrations applied successfully');
      } catch (error) {
        logger.warn('Migration deploy failed, trying db push...');
        try {
          execSync('npx prisma db push', { stdio: 'inherit' });
          logger.info('Database schema pushed successfully');
        } catch (pushError) {
          logger.error('Failed to initialize database:', pushError);
          throw pushError;
        }
      }
    } else {
      logger.info('Database already exists');
    }
    
    // Test connection
    await prisma.$connect();
    logger.info('Database connection successful');
    
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();

