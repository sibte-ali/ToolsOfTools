import { describe, it, expect } from 'vitest';
import {
  mmToPixels,
  pixelsToInches,
  pixelsToCm,
  formatBytes,
  setJpegDpiInBuffer,
  setPngDpiInBuffer,
  PASSPORT_PRESETS,
} from './image-engine';

describe('Image Engine Utilities', () => {
  it('correctly calculates millimeter to pixel dimensions at 300 DPI', () => {
    // 35mm at 300 DPI: (35 / 25.4) * 300 = 413.38 -> 413
    expect(mmToPixels(35, 300)).toBe(413);
    // 45mm at 300 DPI: (45 / 25.4) * 300 = 531.49 -> 531
    expect(mmToPixels(45, 300)).toBe(531);
    // 50.8mm (2 inches) at 300 DPI: 2 * 300 = 600
    expect(mmToPixels(50.8, 300)).toBe(600);
  });

  it('calculates print dimensions in inches and centimeters', () => {
    expect(pixelsToInches(600, 300)).toBe(2);
    expect(pixelsToInches(1200, 300)).toBe(4);
    expect(pixelsToCm(600, 300)).toBe(5.08);
  });

  it('formats byte sizes accurately', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(51200)).toBe('50 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(2621440, 2)).toBe('2.5 MB');
  });

  it('contains official passport presets', () => {
    expect(PASSPORT_PRESETS.length).toBeGreaterThanOrEqual(5);
    const indiaUk = PASSPORT_PRESETS.find((p) => p.id === 'india-uk-eu');
    expect(indiaUk).toBeDefined();
    expect(indiaUk?.widthPx).toBe(413);
    expect(indiaUk?.heightPx).toBe(531);

    const us = PASSPORT_PRESETS.find((p) => p.id === 'us-visa');
    expect(us).toBeDefined();
    expect(us?.widthPx).toBe(600);
    expect(us?.heightPx).toBe(600);
  });

  it('injects or updates JFIF DPI metadata in JPEG buffer', () => {
    // Simulate minimal JPEG SOI + EOI
    const dummyJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const withDpi = setJpegDpiInBuffer(dummyJpeg, 300);

    expect(withDpi.length).toBe(dummyJpeg.length + 18);
    // Check SOI
    expect(withDpi[0]).toBe(0xff);
    expect(withDpi[1]).toBe(0xd8);
    // Check APP0 marker
    expect(withDpi[2]).toBe(0xff);
    expect(withDpi[3]).toBe(0xe0);
    // Check 'JFIF\0'
    expect(String.fromCharCode(...withDpi.slice(6, 10))).toBe('JFIF');
    // Check density unit (1 = DPI)
    expect(withDpi[13]).toBe(1);
    // Check 300 DPI high and low bytes (300 = 0x012C)
    expect(withDpi[14]).toBe(0x01);
    expect(withDpi[15]).toBe(0x2c);
    expect(withDpi[16]).toBe(0x01);
    expect(withDpi[17]).toBe(0x2c);
  });

  it('injects or updates pHYs DPI metadata chunk in PNG buffer', () => {
    // Minimal PNG header (8 bytes) + IHDR (25 bytes)
    const dummyPng = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG Signature
      0x00, 0x00, 0x00, 0x0d, // IHDR length (13)
      0x49, 0x48, 0x44, 0x52, // 'IHDR'
      0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0x64, 0x08, 0x06, 0x00, 0x00, 0x00, // 100x100 RGBA
      0x70, 0xe1, 0xd5, 0x57, // IHDR CRC
    ]);

    const withDpi = setPngDpiInBuffer(dummyPng, 300);
    expect(withDpi.length).toBe(dummyPng.length + 21);
    // Signature preserved
    expect(withDpi[0]).toBe(0x89);
    expect(withDpi[1]).toBe(0x50);
    // At offset 33 (after IHDR), pHYs chunk starts
    expect(withDpi[33]).toBe(0x00);
    expect(withDpi[34]).toBe(0x00);
    expect(withDpi[35]).toBe(0x00);
    expect(withDpi[36]).toBe(0x09); // length 9
    expect(String.fromCharCode(...withDpi.slice(37, 41))).toBe('pHYs');
    // Unit specifier at index 49 (33 + 16) is 1 (meter)
    expect(withDpi[49]).toBe(1);
    // 300 DPI = 11811 pixels/meter = 0x00002e23
    expect(withDpi[43]).toBe(0x2e);
    expect(withDpi[44]).toBe(0x23);
  });
});

