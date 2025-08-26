import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    // Example site (replace with actual)
    const base = 'https://thedaddy.to';
    const html = await fetch(base).then(r => r.text());
    const $ = cheerio.load(html);

    // Find all stream.php links
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('stream.php')) {
        links.push({
          name: $(el).text().trim() || `Channel ${i+1}`,
          link: base + '/' + href
        });
      }
    });

    // Now fetch each stream.php and extract iframe src
    const results = [];
    for (let ch of links) {
      try {
        const streamHtml = await fetch(ch.link).then(r => r.text());
        const $s = cheerio.load(streamHtml);
        const iframe = $s('iframe').attr('src');
        if (iframe) {
          results.push({
            name: ch.name,
            url: iframe.startsWith('http') ? iframe : base + '/' + iframe
          });
        }
      } catch (err) {
        console.error('Stream fetch failed:', err);
      }
    }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scrape failed' });
  }
}
