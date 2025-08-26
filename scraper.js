// scraper.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function scrapeChannels() {
  try {
    const res = await fetch("https://thedaddy.top/24-7-channels.php");
    const html = await res.text();

    const $ = cheerio.load(html);
    let channels = [];

    // Each channel seems wrapped in <div class="channel"> or <a ...>
    $("a").each((i, el) => {
      const link = $(el).attr("href");
      const text = $(el).text().trim();

      if (text && link && !link.startsWith("#")) {
        channels.push({
          name: text.replace(/\s+/g, " "), // clean extra spaces
          url: link.startsWith("http") ? link : `https://thedaddy.top/${link}`
        });
      }
    });

    return channels;
  } catch (err) {
    console.error("Scraper error:", err);
    return [];
  }
}

// If run directly: node scraper.js
if (process.argv[1] === new URL(import.meta.url).pathname) {
  scrapeChannels().then(data => console.log(JSON.stringify(data, null, 2)));
}
