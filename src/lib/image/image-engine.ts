/**
 * Core client-side image processing mathematical and binary utilities.
 */

export interface PassportPreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  widthPx: number;
  heightPx: number;
  description: string;
}

export const PASSPORT_PRESETS: PassportPreset[] = [
  {
    id: 'india-uk-eu',
    name: 'India / UK / Europe / Australia (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    widthPx: 413,
    heightPx: 531,
    description: 'Standard 35x45mm at 300 DPI for Indian passports, Schengen visa, UK, and Australian travel.',
  },
  {
    id: 'us-visa',
    name: 'United States Passport & Visa (2 × 2 in / 51 × 51 mm)',
    widthMm: 50.8,
    heightMm: 50.8,
    dpi: 300,
    widthPx: 600,
    heightPx: 600,
    description: 'Official 2x2 inch (51x51mm) square format for US Department of State visas and passports.',
  },
  {
    id: 'canada',
    name: 'Canada Passport (50 × 70 mm)',
    widthMm: 50,
    heightMm: 70,
    dpi: 300,
    widthPx: 591,
    heightPx: 827,
    description: 'Official Government of Canada passport standard (50x70mm at 300 DPI).',
  },
  {
    id: 'pan-stamp',
    name: 'Indian PAN Card & Stamp Size (25 × 35 mm)',
    widthMm: 25,
    heightMm: 35,
    dpi: 300,
    widthPx: 295,
    heightPx: 413,
    description: 'Standard 25x35mm format for Indian PAN card, driving licence, and exam applications.',
  },
  {
    id: 'china-japan',
    name: 'China / Japan / Singapore (33 × 48 mm)',
    widthMm: 33,
    heightMm: 48,
    dpi: 300,
    widthPx: 390,
    heightPx: 567,
    description: 'Official 33x48mm standard used for East Asian visa and immigration paperwork.',
  },
  {
    id: 'square-30-40',
    name: 'Standard ID Card (30 × 40 mm)',
    widthMm: 30,
    heightMm: 40,
    dpi: 300,
    widthPx: 354,
    heightPx: 472,
    description: 'General national ID card, university admit card, and corporate badge format.',
  },
];

/**
 * Converts millimeters to pixels at a specified DPI (default 300 DPI).
 */
export function mmToPixels(mm: number, dpi = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

/**
 * Converts pixels to physical print inches at a specified DPI.
 */
export function pixelsToInches(pixels: number, dpi: number): number {
  if (dpi <= 0) return 0;
  return Number((pixels / dpi).toFixed(2));
}

/**
 * Converts pixels to physical print centimeters at a specified DPI.
 */
export function pixelsToCm(pixels: number, dpi: number): number {
  if (dpi <= 0) return 0;
  return Number(((pixels / dpi) * 2.54).toFixed(2));
}

/**
 * Formats a byte count into human-readable KB, MB, etc.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
}

/**
 * Embeds or modifies standard JFIF DPI resolution metadata in a JPEG Uint8Array buffer.
 * Density unit: 1 = dots per inch (DPI).
 */
export function setJpegDpiInBuffer(buffer: Uint8Array, dpi: number): Uint8Array {
  // Validate JPEG SOI marker (0xFF, 0xD8)
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return buffer;
  }

  const dpiInt = Math.max(1, Math.min(65535, Math.round(dpi)));
  const dpiHigh = (dpiInt >> 8) & 0xff;
  const dpiLow = dpiInt & 0xff;

  // Check if an existing APP0 JFIF marker exists right after SOI (offset 2)
  if (
    buffer[2] === 0xff &&
    buffer[3] === 0xe0 &&
    buffer[6] === 0x4a && // 'J'
    buffer[7] === 0x46 && // 'F'
    buffer[8] === 0x49 && // 'I'
    buffer[9] === 0x46 && // 'F'
    buffer[10] === 0x00
  ) {
    const copy = new Uint8Array(buffer);
    copy[13] = 1; // 1 = dots per inch
    copy[14] = dpiHigh;
    copy[15] = dpiLow;
    copy[16] = dpiHigh;
    copy[17] = dpiLow;
    return copy;
  }

  // Construct a standard 18-byte JFIF APP0 header to inject
  const jfifHeader = new Uint8Array([
    0xff, 0xe0, // APP0 marker
    0x00, 0x10, // Length = 16 bytes
    0x4a, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
    0x01, 0x02, // Version 1.2
    0x01, // Units: 1 = dots per inch
    dpiHigh, dpiLow, // Xdensity
    dpiHigh, dpiLow, // Ydensity
    0x00, 0x00, // Thumbnail dimensions (0x0)
  ]);

  const output = new Uint8Array(buffer.length + jfifHeader.length);
  output.set(buffer.subarray(0, 2), 0); // SOI (0xFF, 0xD8)
  output.set(jfifHeader, 2); // Injected JFIF APP0
  output.set(buffer.subarray(2), 2 + jfifHeader.length); // Rest of image
  return output;
}

/**
 * Computes standard CRC-32 checksum for PNG chunk verification.
 */
export function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * Embeds or modifies standard pHYs DPI resolution chunk in a PNG Uint8Array buffer.
 * 1 inch = 0.0254 meters. Pixels per meter = round(dpi / 0.0254).
 */
export function setPngDpiInBuffer(buffer: Uint8Array, dpi: number): Uint8Array {
  // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length < 33 ||
    buffer[0] !== 0x89 ||
    buffer[1] !== 0x50 ||
    buffer[2] !== 0x4e ||
    buffer[3] !== 0x47 ||
    buffer[4] !== 0x0d ||
    buffer[5] !== 0x0a ||
    buffer[6] !== 0x1a ||
    buffer[7] !== 0x0a
  ) {
    return buffer;
  }

  const ppm = Math.max(1, Math.min(0xffffffff, Math.round(dpi / 0.0254)));
  const ppmBytes = [
    (ppm >>> 24) & 0xff,
    (ppm >>> 16) & 0xff,
    (ppm >>> 8) & 0xff,
    ppm & 0xff,
  ];

  // Scan chunks after IHDR (starts at 33)
  let pos = 33;
  while (pos + 8 <= buffer.length) {
    const chunkLen =
      (buffer[pos] << 24) |
      (buffer[pos + 1] << 16) |
      (buffer[pos + 2] << 8) |
      buffer[pos + 3];
    const chunkType = String.fromCharCode(
      buffer[pos + 4],
      buffer[pos + 5],
      buffer[pos + 6],
      buffer[pos + 7]
    );

    if (chunkType === 'pHYs' && chunkLen === 9) {
      // Modify existing pHYs chunk
      const copy = new Uint8Array(buffer);
      copy.set(ppmBytes, pos + 8);
      copy.set(ppmBytes, pos + 12);
      copy[pos + 16] = 1; // Unit = 1 (meter)
      const crcVal = crc32(copy.subarray(pos + 4, pos + 17));
      copy[pos + 17] = (crcVal >>> 24) & 0xff;
      copy[pos + 18] = (crcVal >>> 16) & 0xff;
      copy[pos + 19] = (crcVal >>> 8) & 0xff;
      copy[pos + 20] = crcVal & 0xff;
      return copy;
    }

    if (chunkType === 'IDAT' || chunkType === 'IEND') {
      break;
    }

    pos += 12 + chunkLen;
  }

  // Construct new pHYs chunk (21 bytes total: 4 len + 4 type + 9 data + 4 crc)
  const physChunk = new Uint8Array(21);
  physChunk[3] = 9; // length = 9
  physChunk[4] = 0x70; // 'p'
  physChunk[5] = 0x48; // 'H'
  physChunk[6] = 0x59; // 'y'
  physChunk[7] = 0x73; // 's'
  physChunk.set(ppmBytes, 8); // X ppm
  physChunk.set(ppmBytes, 12); // Y ppm
  physChunk[16] = 1; // Unit = 1 (meter)
  const crc = crc32(physChunk.subarray(4, 17));
  physChunk[17] = (crc >>> 24) & 0xff;
  physChunk[18] = (crc >>> 16) & 0xff;
  physChunk[19] = (crc >>> 8) & 0xff;
  physChunk[20] = crc & 0xff;

  // Insert after IHDR (at byte 33)
  const output = new Uint8Array(buffer.length + 21);
  output.set(buffer.subarray(0, 33), 0);
  output.set(physChunk, 33);
  output.set(buffer.subarray(33), 33 + 21);
  return output;
}

/**
 * Re-encodes a JPEG Blob with the requested DPI metadata.
 */
export async function embedJpegDpi(blob: Blob, dpi: number): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const modified = setJpegDpiInBuffer(new Uint8Array(arrayBuffer), dpi);
  return new Blob([modified], { type: 'image/jpeg' });
}

