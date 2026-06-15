import fetch from 'node-fetch';

async function run() {
  const res = await fetch("http://127.0.0.1:3000/api/settings");
  console.log(res.status);
  console.log(await res.text());
}
run();
