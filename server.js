const express = require('express');
const { fetchChannelLinks, fetchM3U8Url } = require('./scraper');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/channels', async (req, res) => {
  const channels = await fetchChannelLinks();
  res.json(channels);
});

app.get('/api/stream', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL parameter is required');
  }
  const m3u8Url = await fetchM3U8Url(url);
  if (m3u8Url) {
    res.json({ m3u8Url });
  } else {
    res.status(404).send('M3U8 stream not found');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
