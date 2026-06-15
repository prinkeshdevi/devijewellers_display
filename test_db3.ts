import { db } from './src/db/index';
import { rates, calculationSettings } from './src/db/schema';
import { desc } from 'drizzle-orm';

async function test() {
  const currentRates = await db.select().from(rates).orderBy(desc(rates.id)).limit(1);
  console.log("Current Rates in DB:", currentRates[0]);

  const currentSettings = await db.select().from(calculationSettings).limit(1);
  console.log("Current Settings in DB:", currentSettings[0]);
  process.exit(0);
}
test();
