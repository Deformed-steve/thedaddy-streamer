const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://thedaddy.top/24-7-channels.php';

async function fetchChannelLinks() {
  try {
    const { data } = await axios.get(baseUrl);
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
    const { data } = await axios.get(channelUrl);
    const $ = cheerio.load(data);
    const m3u8Url = $('source').attr('src');
    return m3u8Url || null;
  } catch (error) {
    console.error(`Error fetching M3U8 URL from ${channelUrl}:`, error);
    return null;
  }
}

module.exports = { fetchChannelLinks, fetchM3U8Url };
