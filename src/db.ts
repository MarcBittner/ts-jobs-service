
import { Sequelize } from 'sequelize';
import { dbConfig } from './config';
import logger from './utils/logger'; // Import the custom logger

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'postgres',
  logging: (msg) => logger.info(`Sequelize: ${msg}`), // Detailed SQL logging
});

export default sequelize;
