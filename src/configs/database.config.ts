import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  database?: string;
  synchronize?: boolean;
}

export interface AllTypeConfig {
  database: DatabaseConfig;
}

export default registerAs<DatabaseConfig>('database', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER,
  name: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  synchronize: Boolean(process.env.DB_SYNC) || false,
}));
