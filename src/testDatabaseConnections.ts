
import sequelize from './db';
import SearchDefinition from './models/SearchDefinition';
import logger from './utils/logger';

(async () => {
  try {
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
  } catch (error) {
    logger.error('Error during database connection test', {
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    await sequelize.close();
    logger.info('Database connection closed.');
  }
})();
