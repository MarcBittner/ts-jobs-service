// ./server.ts


// server.ts

import express from 'express';
import bodyParser from 'body-parser';
import searchRoutes from './routes/SearchRoutes';
import sequelize from './db';
import SearchDefinition from './models/SearchDefinition';
import SearchResult from './models/SearchResult';
import { startMonitoringAllSearches } from './services/SearchManager';
import logger from './utils/logger';

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

// Start server and perform database checks
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
    // Exit the process with failure
    process.exit(1);
  }
})();
//
// import express from 'express';
// import bodyParser from 'body-parser';
// import searchRoutes from './routes/SearchRoutes';
// import sequelize from './db';
// import SearchDefinition from './models/SearchDefinition';
// import SearchResult from './models/SearchResult';
// import { startMonitoringAllSearches } from './services/SearchManager';
// import logger from './utils/logger';
//
// // Handle unhandled promise rejections globally
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection at:', { promise, reason: reason instanceof Error ? reason.message : reason });
// });
//
//
// sequelize.sync();
//
// const app = express();
// const port = process.env.PORT || 3000;
//
// app.use(bodyParser.json());
//
// app.use((req, res, next) => {
//   logger.info(`Request received`, { method: req.method, path: req.path });
//   next();
// });
//
// app.use('/api', searchRoutes);
//
// app.get('/api/health', (req, res) => {
//   res.status(200).send('API is up and running');
// });
//
// app.listen(port, async () => {
//   logger.info(`Server running on port ${port}`);
//   try {
//     logger.info('Attempting to authenticate the database connection...');
//     await sequelize.authenticate();
//     logger.info('Database authentication successful');
//
//     logger.info('Synchronizing SearchDefinition model...');
//     await SearchDefinition.sync();
//     logger.info('SearchDefinition model synchronized');
//
//     logger.info('Synchronizing SearchResult model...');
//     await SearchResult.sync();
//     logger.info('SearchResult model synchronized');
//
//     logger.info('Starting to monitor all searches...');
//     await startMonitoringAllSearches();
//     logger.info('Started monitoring all searches and synchronization complete');
//   } catch (error) {
//     logger.error('Error connecting to the database or synchronizing models', {
//       error: error instanceof Error ? error.message : String(error),
//     });
//   }
// });
