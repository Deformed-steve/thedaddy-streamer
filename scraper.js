// Fetch thedaddy channels page and display clickable list
const channelBox = document.getElementById("channels");
const player = document.getElementById("player");

async function loadChannels() {
  try {
    const res = await fetch("https://corsproxy.io/?https://thedaddy.top/24-7-channels.php");
    const html = await res.text();

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const divs = [...doc.querySelectorAll(".div-item, .channel, div")];
    channelBox.innerHTML = "";

    divs.forEach(div => {
      const link = div.querySelector("a");
      if (link) {
        const channel = document.createElement("div");
        channel.className = "channel";
        channel.textContent = div.textContent.trim() || "Unknown Channel";

        channel.onclick = () => loadStream(link.href);
        channelBox.appendChild(channel);
      }
    });

  } catch (err) {
    channelBox.innerHTML = "❌ Failed to load channels: " + err;
  }
}

async function loadStream(url) {
  try {
    // Fetch stream.php page
    const res = await fetch("https://corsproxy.io/?" + url);
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find iframe src
    const iframe = doc.querySelector("iframe");
    if (iframe) {
      player.src = iframe.src;
    } else {
      alert("No iframe found in stream page.");
    }

  } catch (err) {
    alert("❌ Failed to load stream: " + err);
  }
}

// Initial load
loadChannels();
