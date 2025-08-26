const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://thedaddy.top/24-7-channels.php';

async function fetchChannelLinks() {
  try {
    const { data } = await axios.get(baseUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $ = cheerio.load(data);
    const channels = [];

    $('div.grid-item a').each((i, el) => {
      const name = $(el).text().trim();
      let link = $(el).attr('href');
      if (name && link) {
        // convert to embed URL
        link = link.replace('/stream/', '/embed/');
        channels.push({ name, link: `https://thedaddy.top${link}` });
      }
    });

    return channels;
  } catch (err) {
    console.error('Error fetching channels:', err);
    return [];
  }
}

async function fetchStreamUrl(embedUrl) {
  try {
    const { data } = await axios.get(embedUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://thedaddy.top/'
      }
    });

    // Look for JWPlayer / HLS setup
    const match = data.match(/file\s*:\s*"(https?:\/\/[^"]+\.m3u8)"/);
    if (match) return match[1];

    const sourcesMatch = data.match(/sources\s*:\s*\[\s*{file\s*:\s*"(https?:\/\/[^"]+\.m3u8)"/);
    if (sourcesMatch) return sourcesMatch[1];

    return null;
  } catch (err) {
    console.error(`Error fetching stream from ${embedUrl}:`, err);
    return null;
  }
}

module.exports = { fetchChannelLinks, fetchStreamUrl };
