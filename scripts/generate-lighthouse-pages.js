const fs = require('fs');
const path = require('path');

const historyDir = path.join(__dirname, '..', 'lhci', 'history');
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const outHtml = path.join(publicDir, 'index.html');
let files = [];
if (fs.existsSync(historyDir)) {
  files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));
}

const points = files.map(f => {
  const j = JSON.parse(fs.readFileSync(path.join(historyDir, f)));
  return { ts: j.ts, score: j.score, sha: j.sha };
}).sort((a,b) => new Date(a.ts) - new Date(b.ts));

const labels = points.map(p => new Date(p.ts).toISOString());
const data = points.map(p => p.score);

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Lighthouse PWA History — SUVATIMI-H</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:1rem}h1{margin-bottom:.5rem}.container{max-width:900px;margin:0 auto}</style>
</head>
<body>
  <div class="container">
    <h1>Lighthouse PWA Score History</h1>
    <canvas id="chart" width="800" height="400"></canvas>
    <p>Data points: ${points.length}</p>
    <ul>
      ${points.map(p => `<li>${new Date(p.ts).toLocaleString()} — ${p.score}% — <code>${p.sha}</code></li>`).join('\n')}
    </ul>
  </div>
  <script>
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{
          label: 'PWA score',
          backgroundColor: 'rgba(42,122,228,0.2)',
          borderColor: '#2A7AE4',
          data: ${JSON.stringify(data)},
          fill: true,
        }]
      },
      options: {
        scales: { y: { min: 0, max: 100 } }
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync(outHtml, html);
console.log('Generated', outHtml);