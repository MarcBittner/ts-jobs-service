import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_service',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
};
