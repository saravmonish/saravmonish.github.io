// Vercel serverless function — proxies the visitor-counter API server-side
// so browsers don't hit a CORS block.
//   /api/count          → increments the global total (a counted visit)
//   /api/count?peek=1   → reads the live total WITHOUT incrementing
// The client reads (peek) on every load so all browsers/devices show the
// same live number, and increments at most once per 24h per browser.
//
// Backed by Abacus (https://abacus.jasoncameron.dev) — a free, no-auth hit
// counter. Only the public hit/get endpoints are used (no admin key needed).
// Abacus returns { value: N }; we normalise it to { count: N } so the client
// contract is unchanged.
const NS = 'monishsaravanan-portfolio';
const KEY = 'pageviews';

export default async function handler(req, res) {
  const peek = (req.url || '').includes('peek');
  const action = peek ? 'get' : 'hit';
  const url = `https://abacus.jasoncameron.dev/${action}/${NS}/${KEY}`;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ count: typeof data.value === 'number' ? data.value : null });
  } catch (e) {
    res.status(500).json({ count: null });
  }
}
