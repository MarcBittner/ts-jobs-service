// index.ts

import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import searchRoutes from './routes/SearchRoutes';
import sequelize from './db';
import SearchDefinition from './models/SearchDefinition';
import SearchResult from './models/SearchResult';
import { startMonitoringAllSearches } from './services/SearchManager';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason: reason instanceof Error ? reason.message : String(reason) });
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  logger.info(`Request received`, { method: req.method, path: req.path });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('API is up and running');
});

// Mount API routes
app.use('/api', searchRoutes);

(async () => {
  try {
    // Database checks
    logger.info('Attempting to authenticate the database connection...');
    await sequelize.authenticate();
    logger.info('Database authentication successful');

    logger.info('Synchronizing models...');
    await sequelize.sync();
    logger.info('Models synchronized successfully.');

    // Test query to check ORM functionality
    logger.info('Testing database query...');
    const searchDefinitions = await SearchDefinition.findAll();
    logger.info('Successfully retrieved search definitions:', {
      count: searchDefinitions.length,
    });

    // Start server after successful database checks
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    logger.info('Starting to monitor all searches...');
    await startMonitoringAllSearches();
    logger.info('Started monitoring all searches and synchronization complete');
  } catch (error) {
    logger.error('Error during server startup', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1); // Exit the process with failure
  }
})();
