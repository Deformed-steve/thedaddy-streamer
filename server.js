const express = require('express');
const { fetchChannelLinks } = require('./scraper');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

// Channels list endpoint
app.get('/api/channels', async (req, res) => {
  try {
    const channels = await fetchChannelLinks();
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Stream extraction endpoint
app.get('/api/stream', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    let streamUrl = null;

    // Intercept requests for .m3u8
    page.on('request', request => {
      const reqUrl = request.url();
      if (reqUrl.endsWith('.m3u8')) streamUrl = reqUrl;
    });

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(4000); // wait for player to load

    await browser.close();

    if (streamUrl) res.json({ streamUrl });
    else res.status(404).json({ error: 'Stream not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
