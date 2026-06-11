import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

export const createPool = () => {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  // If Vercel Postgres is used (or regular Postgres URL is provided)
  if (connectionString) {
    let finalConnectionString = connectionString;
    // Strip sslmode=require to avoid self-signed certificate errors with raw pg connection
    // and rely on the internal ssl: { rejectUnauthorized: false } setting.
    if (finalConnectionString.includes('sslmode=require')) {
        finalConnectionString = finalConnectionString.replace('?sslmode=require', '').replace('&sslmode=require', '');
        finalConnectionString = finalConnectionString.replace('?supa=base-pooler.x', ''); // Handle supabase extensions securely
    }

    return new pg.Pool({
      connectionString: finalConnectionString,
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      ssl: finalConnectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }

  // Graceful fallback if no env variables exist (prevents Vercel 500 crash on module load)
  if (!process.env.SQL_HOST) {
    console.warn("DATABASE CONFIGURATION MISSING: SQL_HOST or POSTGRES_URL environment variables are not set. The database connection will fail if queried.");
    
    // Instead of localhost which gives ECONNREFUSED, we can create a pool that will give a more descriptive auth failure 
    // or we can just accept what it is and in the app code, log a clearer error.
    return new pg.Pool({
      host: 'localhost',
      port: 5432,
      max: 1,
      connectionTimeoutMillis: 1000,
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
