import { syncRates } from './src/syncService.js';
async function run() {
  const data = await syncRates();
  console.log(data);
  process.exit(0);
}
run();
