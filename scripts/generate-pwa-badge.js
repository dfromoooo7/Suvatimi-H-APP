const fs = require('fs');
const path = require('path');

const historyDir = path.join(__dirname, '..', 'lhci', 'history');
const outDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'pwa-badge.svg');

if (!fs.existsSync(historyDir)) {
  console.error('No history directory:', historyDir);
  process.exit(0);
}
const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));
if (files.length === 0) {
  console.error('No history files found');
  process.exit(0);
}
let latest = null;
for (const file of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(historyDir, file)));
    if (!latest || new Date(j.ts) > new Date(latest.ts)) latest = j;
  } catch (e) { }
}
if (!latest) {
  console.error('No valid history items.');
  process.exit(0);
}
const score = latest.score;
const label = `PWA: ${score}%`;
let color = '#e05d44';
if (score >= 90) color = '#4c1';
else if (score >= 75) color = '#dfb317';

// Simple badge SVG (similar to shields)
const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20" viewBox="0 0 120 20">\n  <rect width="70" height="20" fill="#555" rx="3"/>\n  <rect x="70" width="50" height="20" fill="${color}" rx="3"/>\n  <g fill="#fff" font-family="Verdana, DejaVu Sans, sans-serif" font-size="11">\n    <text x="8" y="14">PWA</text>\n    <text x="77" y="14">${score}%</text>\n  </g>\n</svg>`;
fs.writeFileSync(outFile, svg);
console.log('Badge written to', outFile);

// Also publish to public/assets so GitHub Pages can serve the badge
const publicAssetsDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });
fs.writeFileSync(path.join(publicAssetsDir, 'pwa-badge.svg'), svg);
console.log('Badge copied to', path.join(publicAssetsDir, 'pwa-badge.svg'));