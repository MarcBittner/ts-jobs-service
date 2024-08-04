import dotenv from 'dotenv';
import LinkedInService from './services/LinkedInService';
import SearchManager from './services/SearchManager';
import { configureLogger } from './utils/logger';

dotenv.config();

const logger = configureLogger();

const searchManager = new SearchManager(new LinkedInService(), logger);

searchManager.startMonitoring();

logger.info('Job monitoring service started.');
