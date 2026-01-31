const fs = require('fs');
const path = require('path');

const required = [
  'index.html',
  'manifest.json',
  'sw.js',
  'offline.html',
  'images/icon-192.png',
  'images/icon-512.png'
];

let missing = [];
for (const f of required) {
  if (!fs.existsSync(path.join(__dirname, '..', f))) missing.push(f);
}

if (missing.length) {
  console.error('Missing required PWA files:', missing.join(', '));
  process.exit(1);
}

console.log('All required PWA files present.');
process.exit(0);
