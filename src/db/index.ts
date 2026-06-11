import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

export const createPool = () => {
  if (!process.env.SQL_HOST && process.env.NODE_ENV === 'production') {
    throw new Error("DATABASE CONFIGURATION MISSING: SQL_HOST environment variable is not set.");
  }
  return new pg.Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    port: parseInt(process.env.SQL_PORT || '5432', 10),
    max: 20,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 10000,
  });
};

const pool = createPool();

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
