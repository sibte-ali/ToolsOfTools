import type { ToolConfig } from '../../lib/engine/types';

export function calculateEpochConversion(input: string, direction: 'auto' | 'toHuman' | 'toEpoch'): {
  epochSeconds: number;
  epochMs: number;
  utcString: string;
  localString: string;
  iso8601: string;
  detected: 'seconds' | 'milliseconds' | 'from-date' | 'unknown';
} {
  let epochMs: number;
  let detected: 'seconds' | 'milliseconds' | 'from-date' | 'unknown' = 'unknown';

  const trimmed = input.trim();

  if (direction === 'toEpoch' || (direction === 'auto' && /^\d{4}[-\/]/.test(trimmed))) {
    // Parse as date string → epoch
    const d = new Date(trimmed.replace(/\//g, '-'));
    if (isNaN(d.getTime())) throw new Error(`Cannot parse date: "${trimmed}"`);
    epochMs = d.getTime();
    detected = 'from-date';
  } else {
    // Parse as number
    const num = Number(trimmed);
    if (isNaN(num)) throw new Error(`Invalid input: "${trimmed}"`);

    // Auto-detect seconds vs milliseconds
    // Unix epoch seconds: ~1.7B in 2024; ms: ~1.7T
    if (num > 1e12) {
      epochMs = num;
      detected = 'milliseconds';
    } else {
      epochMs = num * 1000;
      detected = 'seconds';
    }
  }

  const d = new Date(epochMs);
  return {
    epochSeconds: Math.floor(epochMs / 1000),
    epochMs,
    utcString: d.toUTCString(),
    localString: d.toLocaleString(),
    iso8601: d.toISOString(),
    detected,
  };
}

export function getCurrentEpoch(): { seconds: number; ms: number } {
  const now = Date.now();
  return { seconds: Math.floor(now / 1000), ms: now };
}

const config: ToolConfig = {
  id: 'epoch-converter',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'input',
      label: 'Unix Timestamp or Date String',
      type: 'text',
      default: '1700000000',
      help: 'Enter a Unix timestamp (seconds or ms) or a date string like "2024-01-15 10:30:00"',
    },
    {
      key: 'direction',
      label: 'Conversion Direction',
      type: 'select',
      default: 'auto',
      options: [
        { label: 'Auto-detect (timestamp ↔ date)', value: 'auto' },
        { label: 'Timestamp → Human Date', value: 'toHuman' },
        { label: 'Human Date → Timestamp', value: 'toEpoch' },
      ],
    },
  ],
  compute(values) {
    const input = String(values.input || '1700000000');
    const direction = String(values.direction || 'auto') as 'auto' | 'toHuman' | 'toEpoch';
    try {
      const res = calculateEpochConversion(input, direction);
      return {
        epochSeconds: res.epochSeconds,
        epochMs: res.epochMs,
        utcString: res.utcString,
        localString: res.localString,
        iso8601: res.iso8601,
        detected: `Detected as: ${res.detected}`,
      };
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Conversion error');
    }
  },
  outputs: [
    { key: 'utcString', label: 'UTC Date/Time', format: 'text', highlight: true },
    { key: 'iso8601', label: 'ISO 8601', format: 'text', highlight: true },
    { key: 'localString', label: 'Local Date/Time', format: 'text' },
    { key: 'epochSeconds', label: 'Unix Timestamp (seconds)', format: 'number' },
    { key: 'epochMs', label: 'Unix Timestamp (milliseconds)', format: 'number' },
    { key: 'detected', label: 'Input Detected As', format: 'text' },
  ],
};

export default config;
