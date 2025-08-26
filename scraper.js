// scraper.js
const PROXY = "https://api.allorigins.win/raw?url="; 
const BASE = "https://thedaddy.top";

// Fetch channels
export async function fetchChannels() {
  try {
    const res = await fetch(PROXY + encodeURIComponent(`${BASE}/24-7-channels.php`));
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const items = [...doc.querySelectorAll(".grid-item a")];

    return items.map(a => ({
      name: a.innerText.trim(),
      url: BASE + "/" + a.getAttribute("href")
    }));
  } catch (err) {
    console.error("Error fetching channels:", err);
    return [];
  }
}

// Fetch iframe stream from channel page
export async function fetchStream(channelUrl) {
  try {
    const res = await fetch(PROXY + encodeURIComponent(channelUrl));
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const iframe = doc.querySelector("iframe");

    return iframe ? iframe.src : null;
  } catch (err) {
    console.error("Error fetching stream:", err);
    return null;
  }
}
