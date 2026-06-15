import { syncRates } from './src/syncService.ts';
async function test() {
  const result = await syncRates();
  console.dir(result, {depth: null});
}
test();
