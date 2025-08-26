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

    $('div.grid-item a').each((index, element) => {
      const name = $(element).text().trim();
      const link = $(element).attr('href');
      if (name && link) {
        channels.push({ name, link: `https://thedaddy.top${link}` });
      }
    });

    return channels;
  } catch (error) {
    console.error('Error fetching channel links:', error);
    return [];
  }
}

async function fetchM3U8Url(channelUrl) {
  try {
    const { data } = await axios.get(channelUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $ = cheerio.load(data);

    // Try <video source> first
    let m3u8Url = $('video source').attr('src');

    if (!m3u8Url) {
      // fallback: parse scripts for m3u8
      const scriptText = $('script')
        .map((i, el) => $(el).html())
        .get()
        .join(' ');

      const match = scriptText.match(/"(https?:\/\/[^"]+\.m3u8)"/);
      if (match) m3u8Url = match[1];
    }

    return m3u8Url || null;
  } catch (error) {
    console.error(`Error fetching M3U8 URL from ${channelUrl}:`, error);
    return null;
  }
}

module.exports = { fetchChannelLinks, fetchM3U8Url };
