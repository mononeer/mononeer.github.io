fetch('https://api.github.com/users/mononeer')
  .then(r => r.json())
  .then(u => {
    const img = document.createElement('img');
    img.src = `https://ghchart.rshah.org/00BFFF/mononeer`;
    img.alt = "GitHub contributions";
    img.style.maxWidth = '100%';
    document.getElementById('gh-graph').appendChild(img);
  });
