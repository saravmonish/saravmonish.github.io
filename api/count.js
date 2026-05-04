// Vercel serverless function — proxies the counter API server-side
// so browsers don't hit a CORS block.
// Always uses the 'up' (increment) action — repeat-visit dedup is handled
// client-side via localStorage so we never need the unreliable 'get' endpoint.
export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://api.counterapi.dev/v1/monishsaravanan/portfolio/up',
      { cache: 'no-store' }
    );
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ count: data.count });
  } catch (e) {
    res.status(500).json({ count: null });
  }
}
