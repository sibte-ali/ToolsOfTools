import type { ToolConfig } from '../../lib/engine/types';
import { storageConverterDecimal, storageConverterBinary } from '../../lib/units';

export function calculateMbToKb(mbValue: number): {
  // SI decimal
  MB: number; KB: number; B: number; GB: number; TB: number;
  // IEC binary
  MiB: number; KiB: number; Bytes: number; GiB: number; TiB: number;
} {
  const B = storageConverterDecimal.convert(mbValue, 'MB', 'B').toValue;
  return {
    MB: mbValue,
    KB: storageConverterDecimal.convert(mbValue, 'MB', 'KB').toValue,
    B,
    GB: storageConverterDecimal.convert(mbValue, 'MB', 'GB').toValue,
    TB: storageConverterDecimal.convert(mbValue, 'MB', 'TB').toValue,
    MiB: storageConverterBinary.convert(B, 'B', 'MiB').toValue,
    KiB: storageConverterBinary.convert(B, 'B', 'KiB').toValue,
    Bytes: B,
    GiB: storageConverterBinary.convert(B, 'B', 'GiB').toValue,
    TiB: storageConverterBinary.convert(B, 'B', 'TiB').toValue,
  };
}

const config: ToolConfig = {
  id: 'mb-to-kb-converter',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'mbValue',
      label: 'Megabytes (MB)',
      type: 'number',
      min: 0,
      max: 1_000_000_000,
      step: 1,
      default: 100,
      unit: 'MB',
    },
  ],
  compute(values) {
    const mb = Math.max(0, Number(values.mbValue) || 100);
    return calculateMbToKb(mb);
  },
  outputs: [
    { key: 'KB', label: 'Kilobytes — Decimal (KB = 1000 B)', format: 'number', highlight: true },
    { key: 'KiB', label: 'Kibibytes — Binary (KiB = 1024 B)', format: 'number', highlight: true },
    { key: 'B', label: 'Bytes', format: 'number' },
    { key: 'GB', label: 'Gigabytes (GB)', format: 'number' },
    { key: 'GiB', label: 'Gibibytes (GiB)', format: 'number' },
    { key: 'TB', label: 'Terabytes (TB)', format: 'number' },
  ],
  table() {
    const rows = [1, 5, 10, 50, 100, 250, 500, 1000, 2000, 5000];
    return {
      columns: [
        { key: 'MB', label: 'MB (decimal)', format: 'number' },
        { key: 'KB', label: 'KB (decimal)', format: 'number' },
        { key: 'MiB', label: 'MiB (binary)', format: 'number' },
        { key: 'KiB', label: 'KiB (binary)', format: 'number' },
      ],
      rows: rows.map((mb) => {
        const r = calculateMbToKb(mb);
        return { MB: mb, KB: r.KB, MiB: +r.MiB.toFixed(4), KiB: +r.KiB.toFixed(2) };
      }),
    };
  },
};

export default config;
