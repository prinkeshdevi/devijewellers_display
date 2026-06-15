import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
import { calculationSettings } from './src/db/schema.js';

async function test() {
  try {
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS use_manual_rates BOOLEAN NOT NULL DEFAULT false;`);
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS manual_gold24k INTEGER NOT NULL DEFAULT 150000;`);
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS manual_silver INTEGER NOT NULL DEFAULT 250000;`);
    await db.execute(sql`ALTER TABLE calculation_settings ADD COLUMN IF NOT EXISTS manual_platinum INTEGER NOT NULL DEFAULT 0;`);
    console.log("Alters succeeded!");
    
    const r = await db.select().from(calculationSettings).limit(1);
    console.dir(r, {depth: null});
  } catch(e) {
    console.error(e);
  }
}
test();
