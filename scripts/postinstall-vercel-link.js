#!/usr/bin/env node
const { spawnSync } = require('child_process');
const readline = require('readline');

// Skip in CI/non-interactive environments
if (process.env.CI || !process.stdin.isTTY) {
  process.exit(0);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('\nOptional: Link this project to Vercel for easy deploys.');
rl.question('Would you like to run `npx vercel link` now? (y/N): ', (answer) => {
  rl.close();
  const ans = (answer || '').trim().toLowerCase();
  if (ans === 'y' || ans === 'yes') {
    console.log('Running: npx vercel link --yes');
    const res = spawnSync('npx', ['vercel', 'link', '--yes'], { stdio: 'inherit' });
    if (res.error) {
      console.error('Failed to run vercel link:', res.error.message);
      process.exit(1);
    }
    process.exit(res.status || 0);
  } else {
    console.log('Skipping Vercel link. You can run `npm run vercel:link` later.');
    process.exit(0);
  }
});
