// Vercel serverless function — proxies the counter API server-side
// so browsers don't hit a CORS block.
//   /api/count          → increments the global total (a counted visit)
//   /api/count?peek=1   → reads the live total WITHOUT incrementing
// The client reads (peek) on every load so all browsers/devices show the
// same live number, and increments at most once per 24h per browser.
export default async function handler(req, res) {
  const peek = (req.url || '').includes('peek');
  const url = peek
    ? 'https://api.counterapi.dev/v1/monishsaravanan/portfolio/'
    : 'https://api.counterapi.dev/v1/monishsaravanan/portfolio/up';
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ count: data.count });
  } catch (e) {
    res.status(500).json({ count: null });
  }
}
