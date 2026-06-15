import { db } from './src/db/db.js';
import { sql } from 'drizzle-orm';
async function run() {
  try {
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS gold24k_pur_mult DOUBLE PRECISION NOT NULL DEFAULT 0.985;`);
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS gold22k_sale_mult DOUBLE PRECISION NOT NULL DEFAULT 0.920;`);
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS gold22k_pur_mult DOUBLE PRECISION NOT NULL DEFAULT 0.900;`);
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS gold18k_sale_mult DOUBLE PRECISION NOT NULL DEFAULT 0.860;`);
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS gold18k_pur_mult DOUBLE PRECISION NOT NULL DEFAULT 0.800;`);
    console.log('Success');
  } catch(e) {
    console.error(e);
  }
}
run();
