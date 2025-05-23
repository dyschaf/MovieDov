module.exports = async (req, res) => {
    const { id, fields } = req.query;
  
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing anime id' });
    }
  
    const fieldParams = fields ? `&fields=${fields}` : '';
    const url = `https://api.myanimelist.net/v2/anime/${encodeURIComponent(id)}?${fieldParams}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'X-MAL-CLIENT-ID': '82150ba786771cfb04d451a7231f86bc'
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: 'MAL request failed', details: errorText });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Server error', message: err.message });
    }
  };
  