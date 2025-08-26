import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// 🔹 Get list of channels
app.get("/api/channels", async (req, res) => {
  try {
    const response = await fetch("https://thedaddy.top/24-7-channels.php");
    const html = await response.text();
    const $ = cheerio.load(html);

    let channels = [];

    $(".grid-item").each((i, el) => {
      const link = $(el).find("a").attr("href");
      const title = $(el).find("h3").text().trim();
      const img = $(el).find("img").attr("src");

      if (link) {
        channels.push({
          title: title || "Unknown Channel",
          link: `https://thedaddy.top/${link}`,
          img: img ? `https://thedaddy.top/${img}` : null,
        });
      }
    });

    res.json(channels);
  } catch (err) {
    console.error("Error fetching channels:", err);
    res.status(500).json({ error: "Failed to load channels" });
  }
});

// 🔹 Get stream iframe from channel page
app.get("/api/stream", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing channel URL" });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    let iframeSrc = $("iframe").attr("src");

    if (iframeSrc) {
      res.json({ streamUrl: iframeSrc });
    } else {
      res.status(404).json({ error: "Stream not found" });
    }
  } catch (err) {
    console.error("Error fetching stream:", err);
    res.status(500).json({ error: "Failed to fetch stream" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
