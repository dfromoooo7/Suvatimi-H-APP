const fs = require('fs');
const path = require('path');

const historyDir = path.join(__dirname, '..', 'lhci', 'history');
const readmePath = path.join(__dirname, '..', 'README-PWA-CAPACITOR-ELECTRON.md');

if (!fs.existsSync(historyDir)) {
  console.error('No history directory found:', historyDir);
  process.exit(0);
}

const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));
if (files.length === 0) {
  console.log('No history files found.');
  process.exit(0);
}

// Pick newest by timestamp inside file, fallback to filename
let latest = null;
for (const file of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(historyDir, file))); 
    if (!latest || new Date(j.ts) > new Date(latest.ts)) latest = j;
  } catch (e) { console.warn('Invalid JSON in', file); }
}

if (!latest) {
  console.log('No valid history items.');
  process.exit(0);
}

const score = latest.score;
const ts = new Date(latest.ts).toISOString();
const replacement = `<!-- PWA_SCORE_START -->\n**PWA score (latest): ${score}%** — ${ts}\n<!-- PWA_SCORE_END -->`;

let readme = fs.readFileSync(readmePath, 'utf8');
const start = '<!-- PWA_SCORE_START -->';
const end = '<!-- PWA_SCORE_END -->';
const re = new RegExp(`${start}[\s\S]*?${end}`);
if (re.test(readme)) {
  readme = readme.replace(re, replacement);
  fs.writeFileSync(readmePath, readme, 'utf8');
  console.log('README updated with PWA score:', score);
  process.exit(0);
} else {
  console.error('Markers not found in README.');
  process.exit(1);
}