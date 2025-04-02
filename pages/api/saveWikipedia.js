export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    try {
      const { wikipediaUrl } = req.body;
  
      // Ensure URL is provided
      if (!wikipediaUrl) {
        return res.status(400).json({ error: 'Wikipedia URL is required' });
      }
  
      // Send request to Django API
      const djangoResponse = await fetch('https://micro-sim-backend.vercel.app/api/create-prompt/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Wikipedia_link: wikipediaUrl }),
      });
  
      const data = await djangoResponse.json();
  
      if (!djangoResponse.ok) {
        return res.status(djangoResponse.status).json({ error: data });
      }
  
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  