const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const png2icons = require('png2icons');

(async () => {
  try {
    const outDir = path.join(__dirname, '..', 'build');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const svgPath = path.join(__dirname, '..', 'images', 'icon-512.svg');
    const png512 = path.join(outDir, 'icon-512.png');
    const png192 = path.join(outDir, 'icon-192.png');

    console.log('Generating PNGs from', svgPath);
    await sharp(svgPath).resize(512, 512).png().toFile(png512);
    await sharp(svgPath).resize(192, 192).png().toFile(png192);
    console.log('PNGs created:', png512, png192);

    // Generate ICO (from 256 & 128 & 64 & 48 & 32 & 16 if available)
    console.log('Generating ICO...');
    const icoBuffer = await pngToIco(png512);
    fs.writeFileSync(path.join(outDir, 'icon.ico'), icoBuffer);
    console.log('ICO created:', path.join(outDir, 'icon.ico'));

    // Generate ICNS using png2icons
    console.log('Generating ICNS...');
    const icnsBuf = png2icons.createICNS(fs.readFileSync(png512), png2icons.BICUBIC, false, png2icons.BG_TRANSPARENT);
    if (icnsBuf) fs.writeFileSync(path.join(outDir, 'icon.icns'), icnsBuf);
    console.log('ICNS created:', path.join(outDir, 'icon.icns'));

    // Also copy into project's images dir for PWA manifest
    const manifestPng192 = path.join(__dirname, '..', 'images', 'icon-192.png');
    const manifestPng512 = path.join(__dirname, '..', 'images', 'icon-512.png');
    fs.copyFileSync(png192, manifestPng192);
    fs.copyFileSync(png512, manifestPng512);

    console.log('Copied PNGs to images/ for manifest');
    console.log('Done.');
  } catch (err) {
    console.error('Icon generation failed:', err);
    process.exit(1);
  }
})();