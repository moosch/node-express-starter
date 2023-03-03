/**
 * In a production (or any deployed) environment, this module would reach out to a secure
 * store for config data, such as AWS ssm or similar.
 */
import * as dotenv from 'dotenv';
dotenv.config();

function getConfig() {
  return {
    APP_NAME: process.env.APP_NAME || 'Node App',
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '3000',
    JWT_ACCESS_TOKEN_KEY: process.env.JWT_ACCESS_TOKEN_KEY,
    JWT_REFRESH_TOKEN_KEY: process.env.JWT_REFRESH_TOKEN_KEY,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '30m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256 || 10',
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
    LOG_LEVEL: process.env.LOG_LEVEL || 'error',
    PGUSER: process.env.PGUSER,
    PGHOST: process.env.PGHOST,
    PGPASSWORD: process.env.PGPASSWORD,
    PGDATABASE: process.env.PGDATABASE,
    PGPORT: process.env.PGPORT,
    REDIS_URL: process.env.REDIS_URL,
  }
}

export default getConfig;
