import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type 2: RGB
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte 0 at start of each scanline
  const rawScanline = Buffer.alloc(1 + width * 3);
  rawScanline[0] = 0; // Filter: None
  for (let x = 0; x < width; x++) {
    // create a nice gradient/border
    const cx = x - width / 2;
    const offset = 1 + x * 3;
    rawScanline[offset] = r;
    rawScanline[offset + 1] = g;
    rawScanline[offset + 2] = b;
  }

  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 3);
    row[0] = 0;
    const cy = y - height / 2;
    for (let x = 0; x < width; x++) {
      const cx = x - width / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      const maxR = width * 0.44;
      const offset = 1 + x * 3;
      
      // Islamic green palette: #0b6623 / #10b981
      if (dist < maxR) {
        // center circle emerald
        row[offset] = 16;     // R
        row[offset + 1] = 185; // G
        row[offset + 2] = 129; // B
      } else {
        // dark forest green
        row[offset] = 6;
        row[offset + 1] = 78;
        row[offset + 2] = 59;
      }
    }
    rawRows.push(row);
  }

  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal >>> 0, 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, 16, 185, 129));

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#grad)"/>
  <circle cx="256" cy="256" r="160" fill="#10b981" opacity="0.2"/>
  <!-- Crescent & Star stylized + Currency Rs / PKR -->
  <path d="M 230 140 A 110 110 0 1 0 350 290 A 130 130 0 1 1 230 140 Z" fill="#ffffff" opacity="0.95"/>
  <polygon points="350,180 359,208 388,208 365,225 374,252 350,236 326,252 335,225 312,208 341,208" fill="#34d399"/>
  <!-- Symbol ₨ -->
  <text x="256" y="380" font-family="sans-serif" font-weight="900" font-size="96" fill="#ffffff" text-anchor="middle" letter-spacing="2">₨ PK</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('Icons generated successfully in public/');
