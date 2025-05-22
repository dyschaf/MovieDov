// import type { VercelRequest, VercelResponse } from '@vercel/node';
const fetch = require('node-fetch'); // ✅ ADD THIS

export default async function handler(req: any, res: any) {
  console.log("Received request:", req.url); 
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter `q`' });
  }

  try {
    const response = await fetch(`https://api.myanimelist.net/v2/anime?q=${q}&limit=20`, {
      method: 'GET',
      headers: {
        'X-MAL-CLIENT-ID': '82150ba786771cfb04d451a7231f86bc',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from MyAnimeList' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}