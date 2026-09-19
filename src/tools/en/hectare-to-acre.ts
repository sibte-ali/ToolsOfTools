import type { ToolConfig } from '../../lib/engine/types';
import { areaConverter } from '../../lib/units';
import landUnitsData from '../../data/land-units.json';

export function calculateHectareToAcre(hectares: number): {
  hectares: number;
  acres: number;
  sqMeters: number;
  sqFeet: number;
  bigha_up: number;
  guntha: number;
} {
  const sqMeters = hectares * 10000;
  const acres = areaConverter.convert(hectares, 'ha', 'acre').toValue;
  const sqFeet = areaConverter.convert(hectares, 'ha', 'sqft').toValue;

  // Land units from data file
  const bighaUp = landUnitsData.units.find((u) => u.key === 'bigha_up')!;
  const gunthaUnit = landUnitsData.units.find((u) => u.key === 'guntha')!;

  return {
    hectares,
    acres,
    sqMeters,
    sqFeet,
    bigha_up: sqMeters / bighaUp.to_sqm,
    guntha: sqMeters / gunthaUnit.to_sqm,
  };
}

const config: ToolConfig = {
  id: 'hectare-to-acre',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'hectares',
      label: 'Area in Hectares',
      type: 'number',
      min: 0,
      max: 1_000_000,
      step: 0.01,
      default: 1,
      unit: 'ha',
    },
  ],
  compute(values) {
    const hectares = Math.max(0, Number(values.hectares) || 1);
    return calculateHectareToAcre(hectares);
  },
  outputs: [
    { key: 'acres', label: 'Acres', format: 'number', highlight: true },
    { key: 'sqMeters', label: 'Square Meters (m²)', format: 'number' },
    { key: 'sqFeet', label: 'Square Feet (ft²)', format: 'number' },
    { key: 'bigha_up', label: 'Bigha (UP, approx.)', format: 'number' },
    { key: 'guntha', label: 'Guntha (approx.)', format: 'number' },
  ],
  table() {
    const commonHa = [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100];
    return {
      columns: [
        { key: 'hectares', label: 'Hectares (ha)', format: 'number' },
        { key: 'acres', label: 'Acres', format: 'number' },
        { key: 'sqMeters', label: 'Square Meters', format: 'number' },
        { key: 'sqFeet', label: 'Square Feet', format: 'number' },
      ],
      rows: commonHa.map((ha) => {
        const r = calculateHectareToAcre(ha);
        return {
          hectares: ha,
          acres: +r.acres.toFixed(5),
          sqMeters: +r.sqMeters.toFixed(0),
          sqFeet: +r.sqFeet.toFixed(0),
        };
      }),
    };
  },
};

export default config;
