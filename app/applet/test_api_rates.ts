import fetch from 'node-fetch';

async function test() {
  const r = await fetch("http://127.0.0.1:3000/api/rates/current");
  console.log(await r.json());
}
test();
