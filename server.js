const express = require('express');
const { fetchChannelLinks, fetchStreamUrl } = require('./scraper');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/channels', async (req, res) => {
  try {
    const channels = await fetchChannelLinks();
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

app.get('/api/stream', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const streamUrl = await fetchStreamUrl(url);
    if (streamUrl) res.json({ streamUrl });
    else res.status(404).json({ error: 'Stream not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
