import fetch from 'node-fetch';

async function test() {
  const settings = {
    syncIntervalMinutes: 30,
    silverPurchaseOffset: 5000,
    platinumPurchaseOffset: 4000,
    gold24kPurMult: 0.70,
    gold22kSaleMult: 0.60,
    gold22kPurMult: 0.50,
    gold18kSaleMult: 0.40,
    gold18kPurMult: 0.30,
    enableAutoSync: true,
    storeRatesInDb: true
  };

  const res = await fetch("http://127.0.0.1:3000/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  });
  console.log(res.status, await res.text());

  const res2 = await fetch("http://127.0.0.1:3000/api/settings");
  console.log(await res2.text());
}
test();
