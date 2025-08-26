async function loadChannels() {
  const res = await fetch('/api/scrape');
  const channels = await res.json();

  const container = document.getElementById('channels');
  container.innerHTML = '';

  channels.forEach(ch => {
    const div = document.createElement('div');
    div.className = 'channel';
    div.textContent = ch.name;
    div.onclick = () => playStream(ch.url);
    container.appendChild(div);
  });
}

function playStream(url) {
  const player = document.getElementById('player');
  player.src = url;
}

loadChannels();
