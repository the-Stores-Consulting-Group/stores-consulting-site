import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Bundled Archivo variable font: google/fonts ofl/archivo (SIL OFL, see brand/OFL.txt).
// Geometry mirrors the full-size Brand.astro mark in global.css (rem × 16).
// Regenerate with `node scripts/generate-brand-assets.mjs` after a brand change.
const ink = '#17242d';
const mineral = '#2f5c66';
const signal = '#ab4838';
const paper = '#f3f0e8';
const fontfile = fileURLToPath(new URL('./brand/Archivo.ttf', import.meta.url));
const mark = `<g fill="${ink}"><rect y="1.28" width="39.2" height="3.52"/><rect y="14.56" width="22.344" height="3.52"/><rect y="28" width="31.752" height="3.52"/></g><rect x="25.92" y="12" width="7.2" height="9.28" fill="${signal}"/>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
await mkdir('public/assets/brand', { recursive: true });
const icon = svg(48, 48, `<g transform="translate(4.4 7.6)">${mark}</g>`);
await writeFile('public/assets/brand/shelf-register.svg', icon);
const browserIcon=icon.replace('<g transform=', '<rect width="48" height="48" fill="#ffffff"/><g transform=');
await writeFile('public/favicon.svg', browserIcon);
await sharp(Buffer.from(browserIcon)).resize(32, 32).png().toFile('public/assets/brand/favicon-32.png');
await sharp(Buffer.from(svg(180, 180, `<rect width="180" height="180" fill="#ffffff"/><g transform="translate(24.4 35.1) scale(3.35)">${mark}</g>`))).png().toFile('public/assets/brand/apple-touch-icon.png');

const renderText = async (text, size, color, spacing) => sharp({ text: {
  text: `<span foreground="${color}" letter_spacing="${Math.round(spacing * 1024)}">${text}</span>`,
  font: `Archivo Bold ${size}`, fontfile, rgba: true, dpi: 72,
}}).png().toBuffer({ resolveWithObject: true });
const name = await renderText('the Stores', 104, ink, -6.24);
const descriptor = await renderText('CONSULTING GROUP', 41, mineral, 5.74);
const markWidth = 158;
const gap = 28;
const textWidth = Math.max(name.info.width, descriptor.info.width);
const totalWidth = markWidth + gap + textWidth;
const left = Math.round((1200 - totalWidth) / 2);
const textTop = Math.round((630 - name.info.height - 19 - descriptor.info.height) / 2);
const markImage = await sharp(Buffer.from(svg(158, 133, `<g transform="scale(4.03)">${mark}</g>`))).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: paper } }).composite([
  { input: markImage, left, top: 248 },
  { input: name.data, left: left + markWidth + gap, top: textTop },
  { input: descriptor.data, left: left + markWidth + gap, top: textTop + name.info.height + 19 },
]).png().toFile('public/assets/brand/social-card.png');
console.log('Generated shelf-register favicon, touch icon, and 1200 × 630 social card.');

for (const size of [192,512]) await sharp(Buffer.from(browserIcon)).resize(size,size).png().toFile(`public/assets/brand/icon-${size}.png`);
await sharp(Buffer.from(browserIcon)).resize(512,512).png().toFile('public/assets/brand/organization-logo.png');
// ICO containing a PNG image, supported by modern browsers and Windows.
const png=await sharp(Buffer.from(browserIcon)).resize(32,32).png().toBuffer();
const ico=Buffer.alloc(22);ico.writeUInt16LE(1,2);ico.writeUInt16LE(1,4);ico[6]=32;ico[7]=32;ico.writeUInt16LE(1,10);ico.writeUInt16LE(32,12);ico.writeUInt32LE(png.length,14);ico.writeUInt32LE(22,18);
await writeFile('public/favicon.ico',Buffer.concat([ico,png]));
await sharp(Buffer.from(svg(180,180,`<rect width="180" height="180" fill="#ffffff"/><g transform="translate(24.4 35.1) scale(3.35)">${mark}</g>`))).png().toFile('public/apple-touch-icon.png');
