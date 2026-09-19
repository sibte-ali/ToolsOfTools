import type { ToolConfig } from '../../lib/engine/types';
import { massConverter } from '../../lib/units';

export function calculateGramsToLbs(grams: number): {
  grams: number;
  pounds: number;
  ounces: number;
  kilograms: number;
  poundsAndOunces: string;
} {
  const pounds = massConverter.convert(grams, 'g', 'lb').toValue;
  const ounces = massConverter.convert(grams, 'g', 'oz').toValue;
  const kilograms = massConverter.convert(grams, 'g', 'kg').toValue;
  const wholePounds = Math.floor(pounds);
  const remOz = (pounds - wholePounds) * 16;
  const poundsAndOunces = `${wholePounds} lb ${remOz.toFixed(2)} oz`;
  return { grams, pounds, ounces, kilograms, poundsAndOunces };
}

const config: ToolConfig = {
  id: 'grams-to-lbs',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'grams',
      label: 'Weight in Grams',
      type: 'number',
      min: 0,
      max: 1_000_000,
      step: 1,
      default: 500,
      unit: 'g',
    },
  ],
  compute(values) {
    const grams = Math.max(0, Number(values.grams) || 500);
    return calculateGramsToLbs(grams);
  },
  outputs: [
    { key: 'pounds', label: 'Pounds (lb)', format: 'number', highlight: true },
    { key: 'poundsAndOunces', label: 'Pounds + Ounces', format: 'text', highlight: true },
    { key: 'ounces', label: 'Ounces (oz)', format: 'number' },
    { key: 'kilograms', label: 'Kilograms (kg)', format: 'number' },
  ],
  table(values) {
    const base = Math.max(0, Number(values.grams) || 500);
    const commonValues = base > 1000
      ? [100, 250, 500, 750, 1000, 1500, 2000, base].sort((a, b) => a - b)
      : [10, 25, 50, 100, 250, 500, 750, 1000];
    const unique = [...new Set(commonValues)];
    return {
      columns: [
        { key: 'grams', label: 'Grams (g)', format: 'number' },
        { key: 'pounds', label: 'Pounds (lb)', format: 'number' },
        { key: 'ounces', label: 'Ounces (oz)', format: 'number' },
        { key: 'kilograms', label: 'Kilograms (kg)', format: 'number' },
      ],
      rows: unique.map((g) => {
        const r = calculateGramsToLbs(g);
        return { grams: r.grams, pounds: +r.pounds.toFixed(6), ounces: +r.ounces.toFixed(4), kilograms: +r.kilograms.toFixed(4) };
      }),
    };
  },
};

export default config;
