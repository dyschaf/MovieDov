// import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter `q`' });
  }

  try {
    const url = `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(q)}&limit=20`;

    const response = await fetch(url, {
      headers: {
        'X-MAL-CLIENT-ID': '82150ba786771cfb04d451a7231f86bc',
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Failed to fetch from MAL', details: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
