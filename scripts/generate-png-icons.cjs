const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generatePng(width, height, isMaskable = false) {
  const rawRows = [];
  const cx = width / 2;
  const cy = height / 2;
  
  // Safe zone radius for maskable
  const maxR = Math.min(width, height) / 2;
  const contentScale = isMaskable ? 0.75 : 0.9;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter: None
    
    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dx = (x - cx) / (cx * contentScale);
      const dy = (y - cy) / (cy * contentScale);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background color: deep warm olive/slate (#2E3427 to #434B39)
      const gradT = (x + y) / (width + height);
      let r = Math.round(46 + gradT * 25);
      let g = Math.round(52 + gradT * 28);
      let b = Math.round(39 + gradT * 20);
      let a = 255;

      if (!isMaskable) {
        // Corner radius for standard app icon
        const cornerR = width * 0.22;
        const inCornerX = Math.max(0, Math.abs(x - cx) - (cx - cornerR));
        const inCornerY = Math.max(0, Math.abs(y - cy) - (cy - cornerR));
        const cornerDist = Math.sqrt(inCornerX * inCornerX + inCornerY * inCornerY);
        if (cornerDist > cornerR) {
          a = 0; // Transparent outside rounded squircle
        }
      }

      if (a > 0) {
        // Draw emblem
        // 1. Cap area (top triangle/rhombus)
        const capY = dy + 0.35;
        const capX = dx;
        const capDist = Math.abs(capX) * 0.9 + Math.abs(capY) * 1.5;
        
        if (capDist < 0.45 && capY < 0.1 && capY > -0.55) {
          // Warm amber gold cap
          r = 235; g = 175; b = 60;
        } else if (dist < 0.75 && dy > 0.05 && dy < 0.55 && Math.abs(dx) < 0.65) {
          // Open book white/cream pages
          const bookFold = Math.abs(dx) * 0.2;
          const pageShade = (dx < 0 ? 245 : 255) - Math.round(bookFold * 50);
          r = pageShade;
          g = pageShade;
          b = pageShade - 10;
        }
      }

      row[idx] = r;
      row[idx + 1] = g;
      row[idx + 2] = b;
      row[idx + 3] = a;
    }
    rawRows.push(row);
  }

  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = createChunk('IHDR', ihdrData);
  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate required sizes
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(64, 64, false));

console.log('Successfully generated all PWA & Android icon assets in public/!');
