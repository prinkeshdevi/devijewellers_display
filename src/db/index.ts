import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

export const createPool = () => {
  // If Vercel Postgres is used (or regular Postgres URL is provided)
  if (process.env.POSTGRES_URL) {
    return new pg.Pool({
      connectionString: process.env.POSTGRES_URL,
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      ssl: process.env.POSTGRES_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }

  // Graceful fallback if no env variables exist (prevents Vercel 500 crash on module load)
  if (!process.env.SQL_HOST) {
    console.warn("DATABASE CONFIGURATION MISSING: SQL_HOST or POSTGRES_URL environment variables are not set. The database connection will fail if queried.");
    return new pg.Pool({
      // Provide dummy values to prevent crash, queries will fail cleanly
      host: 'localhost',
      port: 5432,
      max: 1,
      connectionTimeoutMillis: 1000, // Fail fast
    });
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
