async function loadChannels() {
  const list = document.getElementById("channel-list");
  list.innerHTML = "Loading...";

  try {
    const res = await fetch("/api/channels");
    const channels = await res.json();

    if (!channels.length) {
      list.innerHTML = "❌ Failed to load channels.";
      return;
    }

    list.innerHTML = "";
    channels.forEach(ch => {
      const div = document.createElement("div");
      div.className = "channel";
      div.innerHTML = `
        <img src="${ch.img || ''}" alt="${ch.title}">
        <p>${ch.title}</p>
      `;
      div.onclick = () => playChannel(ch.link);
      list.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = "❌ Failed to load channels.";
  }
}

async function playChannel(url) {
  try {
    const res = await fetch(`/api/stream?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data.streamUrl) {
      document.getElementById("player").src = data.streamUrl;
      document.getElementById("player-container").classList.remove("hidden");
    } else {
      alert("Stream not found.");
    }
  } catch (err) {
    alert("Error loading stream.");
  }
}

document.getElementById("close-player").onclick = () => {
  document.getElementById("player").src = "";
  document.getElementById("player-container").classList.add("hidden");
};

loadChannels();
