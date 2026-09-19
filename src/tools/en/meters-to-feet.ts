import type { ToolConfig } from '../../lib/engine/types';
import { lengthConverter } from '../../lib/units';

export function calculateMetersToFeet(meters: number): {
  meters: number;
  feet: number;
  inches: number;
  feetAndInches: string;
  centimeters: number;
  yards: number;
} {
  const feet = lengthConverter.convert(meters, 'm', 'ft').toValue;
  const totalInches = feet * 12;
  const wholeFeet = Math.floor(feet);
  const remInches = (feet - wholeFeet) * 12;
  const centimeters = meters * 100;
  const yards = lengthConverter.convert(meters, 'm', 'yd').toValue;
  return {
    meters,
    feet,
    inches: totalInches,
    feetAndInches: `${wholeFeet} ft ${remInches.toFixed(2)} in`,
    centimeters,
    yards,
  };
}

const config: ToolConfig = {
  id: 'meters-to-feet',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'meters',
      label: 'Length in Meters',
      type: 'number',
      min: 0,
      max: 1_000_000,
      step: 0.01,
      default: 1,
      unit: 'm',
    },
  ],
  compute(values) {
    const meters = Math.max(0, Number(values.meters) || 1);
    return calculateMetersToFeet(meters);
  },
  outputs: [
    { key: 'feet', label: 'Feet (ft)', format: 'number', highlight: true },
    { key: 'feetAndInches', label: 'Feet + Inches', format: 'text', highlight: true },
    { key: 'inches', label: 'Total Inches', format: 'number' },
    { key: 'centimeters', label: 'Centimeters (cm)', format: 'number' },
    { key: 'yards', label: 'Yards (yd)', format: 'number' },
  ],
  table(values) {
    const commonMeters = [0.5, 1, 1.5, 1.8, 2, 3, 5, 10, 20, 50, 100];
    return {
      columns: [
        { key: 'meters', label: 'Meters (m)', format: 'number' },
        { key: 'feet', label: 'Feet (ft)', format: 'number' },
        { key: 'feetAndInches', label: 'Feet + Inches', format: 'text' },
        { key: 'centimeters', label: 'cm', format: 'number' },
      ],
      rows: commonMeters.map((m) => {
        const r = calculateMetersToFeet(m);
        return { meters: m, feet: +r.feet.toFixed(4), feetAndInches: r.feetAndInches, centimeters: r.centimeters };
      }),
    };
  },
};

export default config;
