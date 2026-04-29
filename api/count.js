// Vercel serverless function — proxies the counter API server-side
// so browsers don't hit a CORS block.
// ?read=1 fetches without incrementing (for repeat visitors within 24h)
export default async function handler(req, res) {
  const readOnly = req.query.read === '1';
  const action   = readOnly ? 'get' : 'up';

  try {
    const response = await fetch(
      `https://api.counterapi.dev/v1/monishsaravanan/portfolio/${action}`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ count: data.count });
  } catch (e) {
    res.status(500).json({ count: null });
  }
}
