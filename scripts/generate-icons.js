import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal pure Node.js PNG encoder without external dependencies
function createPNG(width, height, getPixelRGBA) {
  // RGBA buffer: each row has 1 filter byte (0) + width * 4 bytes
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRGBA(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);

    return Buffer.concat([len, typeAndData, crc]);
  }

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Draw Aasaan Icon Pixel Generator
function aasaanIconPixel(x, y, w, h, isMaskable = false) {
  // Normalize coordinates -1 to 1
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const r = Math.sqrt(nx * nx + ny * ny);

  // Background: Deep Royal Slate (#0f172a to #1e1b4b)
  const bgR = 15 + Math.floor((1 - ny) * 8);
  const bgG = 23 + Math.floor((1 - ny) * 6);
  const bgB = 42 + Math.floor((1 - ny) * 25);

  // For maskable icon, keep contents in center safe zone (radius < 0.7)
  const scale = isMaskable ? 0.72 : 0.88;
  const snx = nx / scale;
  const sny = ny / scale;
  const sr = Math.sqrt(snx * snx + sny * sny);

  // Golden Sun Halo ring
  if (sr >= 0.82 && sr <= 0.92) {
    const ringAlpha = Math.max(0, 1 - Math.abs(sr - 0.87) / 0.05);
    return [
      Math.floor(bgR * (1 - ringAlpha) + 245 * ringAlpha),
      Math.floor(bgG * (1 - ringAlpha) + 158 * ringAlpha),
      Math.floor(bgB * (1 - ringAlpha) + 11 * ringAlpha),
      255,
    ];
  }

  // Inner Golden Glow / Circular Shield
  if (sr < 0.82) {
    const glow = (0.82 - sr) / 0.82;
    // Central Emblem area
    // Stylized Tamil "அ" & Palm leaf motif
    // Vertical spine line near center-left (x ~ -0.15)
    const inSpine = Math.abs(snx - -0.12) < 0.07 && sny >= -0.45 && sny <= 0.45;
    // Upper loop of "அ"
    const loop1Dist = Math.sqrt((snx - 0.05) ** 2 + (sny - -0.2) ** 2);
    const inLoop1 = Math.abs(loop1Dist - 0.2) < 0.06 && sny <= 0.05;
    // Bottom curve of "அ"
    const loop2Dist = Math.sqrt((snx - 0.08) ** 2 + (sny - 0.15) ** 2);
    const inLoop2 = Math.abs(loop2Dist - 0.22) < 0.06 && sny >= -0.05;
    // Cross stroke
    const inCross = Math.abs(sny - -0.02) < 0.06 && snx >= -0.15 && snx <= 0.35;
    // Quill feather flame at top right
    const inFlame = (snx >= 0.18 && snx <= 0.38 && sny >= -0.55 && sny <= -0.15) &&
                    (Math.abs(snx - (0.28 - sny * 0.2)) < 0.09);

    if (inSpine || inLoop1 || inLoop2 || inCross || inFlame) {
      // Shimmering Bright Gold (#fef08a -> #f59e0b)
      const grad = (sny + 0.5);
      return [
        Math.floor(254 * (1 - grad * 0.1)),
        Math.floor(240 - grad * 70),
        Math.floor(138 - grad * 110),
        255,
      ];
    }

    // Gentle central aura
    const auraR = Math.floor(bgR + glow * 45);
    const auraG = Math.floor(bgG + glow * 35);
    const auraB = Math.floor(bgB + glow * 10);
    return [Math.min(255, auraR), Math.min(255, auraG), Math.min(255, auraB), 255];
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating Android & PWA App Icons for Aasaan...');

// 1. 192x192 standard icon
const icon192 = createPNG(192, 192, (x, y, w, h) => aasaanIconPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);
console.log('✓ Created public/pwa-192x192.png (192x192)');

// 2. 512x512 standard icon
const icon512 = createPNG(512, 512, (x, y, w, h) => aasaanIconPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);
console.log('✓ Created public/pwa-512x512.png (512x512)');

// 3. 512x512 maskable icon (safe-zone padded for Android circles/squircles)
const iconMaskable = createPNG(512, 512, (x, y, w, h) => aasaanIconPixel(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);
console.log('✓ Created public/pwa-maskable-512x512.png (512x512 maskable)');

// 4. Apple Touch Icon 180x180
const appleIcon = createPNG(180, 180, (x, y, w, h) => aasaanIconPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
console.log('✓ Created public/apple-touch-icon.png (180x180)');

console.log('All Android PWA icons successfully generated!');
