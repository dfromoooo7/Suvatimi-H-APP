# Generate icons from SVG

This document shows quick commands to generate PNG/ICO/icns icons from the SVG sources using ImageMagick or using a Node script with Sharp.

## ImageMagick commands

```bash
# Generate PNGs
magick convert images/icon-512.svg -resize 512x512 build/icon-512.png
magick convert images/icon-192.svg -resize 192x192 build/icon-192.png

# Generate ICO (Windows) and ICNS (macOS)
magick convert build/icon-512.png -background none -resize 256x256 build/icon.ico
magick convert build/icon-512.png -background none -resize 256x256 build/icon.icns
```

## Node script (Sharp)
If you prefer, I can add `scripts/generate-icons.js` which uses `sharp` to programmatically generate PNG/ICO/icns files. You will need to `npm i -D sharp` and run `node scripts/generate-icons.js`.