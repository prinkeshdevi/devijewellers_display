import { db } from './src/db/index.js';
import { calculationSettings } from './src/db/schema.js';
async function test() {
  const result = await db.select().from(calculationSettings).limit(1);
  console.dir(result[0], {depth: null});
  process.exit(0);
}
test();
