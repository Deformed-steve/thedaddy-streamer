const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

const baseUrl = 'https://thedaddy.top/24-7-channels.php';

// Channels endpoint
app.get('/api/channels', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(4000); // wait for JS to render channels

    // Extract channels
    const channels = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll('div.grid-item a').forEach(a => {
        const name = a.innerText.trim();
        let link = a.getAttribute('href');
        if (name && link) {
          link = link.replace('/stream/', '/embed/');
          list.push({ name, link: 'https://thedaddy.top' + link });
        }
      });
      return list;
    });

    res.json(channels);
    await browser.close();
  } catch (err) {
    if (browser) await browser.close();
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Stream endpoint
app.get('/api/stream', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    let streamUrl = null;
    page.on('request', request => {
      const reqUrl = request.url();
      if (reqUrl.endsWith('.m3u8')) streamUrl = reqUrl;
    });

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(4000); // wait for player

    await browser.close();

    if (streamUrl) res.json({ streamUrl });
    else res.status(404).json({ error: 'Stream not found' });
  } catch (err) {
    if (browser) await browser.close();
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
