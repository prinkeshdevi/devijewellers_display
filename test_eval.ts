import { syncRates } from './src/syncService';
async function test() {
  console.log("running sync rates...");
  setTimeout(()=>process.exit(0), 5000);
  try {
    const r = await syncRates();
    console.log("Success", r);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
test();
