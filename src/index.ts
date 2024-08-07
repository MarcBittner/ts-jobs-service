import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importing CORS
import path from 'path';
import fs from 'fs';
import searchRoutes from './routes/SearchRoutes';
import sequelize from './db';
import SearchDefinition from './models/SearchDefinition';
import { startMonitoringAllSearches } from './services/SearchManager';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason: reason instanceof Error ? reason.message : String(reason) });
});

const app = express();
const port = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  logger.info(`Request received`, { method: req.method, path: req.path });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('API is up and running');
});

// Serve application log
app.get('/logs/application.log', (req, res) => {
  const logPath = path.join(__dirname, '..', 'logs', 'app.log');
  logger.info(`Serving application log from: ${logPath}`);
  if (fs.existsSync(logPath)) {
    res.setHeader('Content-Type', 'text/plain'); // Set the correct content type
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(logPath);
  } else {
    res.status(404).send('Application log not found.');
  }
});

// Serve build log
app.get('/logs/build.log', (req, res) => {
  const logPath = path.join(__dirname, '..', 'logs', 'build.sh.log');
  logger.info(`Serving build log from: ${logPath}`);
  if (fs.existsSync(logPath)) {
    res.setHeader('Content-Type', 'text/plain'); // Set the correct content type
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(logPath);
  } else {
    res.status(404).send('Build log not found.');
  }
});

// Mount API routes
app.use('/api', searchRoutes);

// Serve static files for the frontend app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Fallback to serving index.html for any other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.get('/api/version', (req, res) => {
  const packageJson = require('../package.json');
  res.json({ version: packageJson.version });
});

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
