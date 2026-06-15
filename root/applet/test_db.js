import { db } from './src/db/db.js';
import { sql } from 'drizzle-orm';
async function run() {
  try {
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS gold24k_pur_mult DOUBLE PRECISION NOT NULL DEFAULT 0.985;`);
    console.log('Success');
  } catch(e) {
    console.error(e);
  }
}
run();
