import type { ToolConfig } from '../../lib/engine/types';

// Weight of mild steel pipe (hollow cylinder):
// kg/m = (OD - WT) × WT × 0.02466
// where OD = outer diameter (mm), WT = wall thickness (mm)
// Source: IS 1239 / Steel Tables; density of MS = 7850 kg/m³
// Formula: π × (OD - WT) × WT × density_factor
// where density_factor = π × 7.85 / 1000 ≈ 0.024659
export function calculateMsPipeWeight(
  outerDiameterMm: number,
  wallThicknessMm: number,
  lengthM: number,
  quantity: number,
  densityKgM3 = 7850
): {
  weightPerMeter: number;
  totalWeight: number;
  innerDiameter: number;
  crossSectionArea: number;
  unit: string;
} {
  if (wallThicknessMm * 2 >= outerDiameterMm) {
    throw new Error('Wall thickness cannot be ≥ half of outer diameter');
  }
  // Standard formula: (OD - WT) × WT × π × density / 1,000,000
  const densityFactor = (Math.PI * densityKgM3) / 1_000_000;
  const weightPerMeter = (outerDiameterMm - wallThicknessMm) * wallThicknessMm * densityFactor;

  // Quick approximation (industry shorthand):
  // kg/m ≈ (OD - WT) × WT × 0.02466
  // const weightPerMeterApprox = (outerDiameterMm - wallThicknessMm) * wallThicknessMm * 0.02466;

  const totalWeight = weightPerMeter * lengthM * quantity;
  const innerDiameter = outerDiameterMm - 2 * wallThicknessMm;
  const crossSectionArea =
    (Math.PI / 4) * (outerDiameterMm * outerDiameterMm - innerDiameter * innerDiameter);

  return {
    weightPerMeter: +weightPerMeter.toFixed(4),
    totalWeight: +totalWeight.toFixed(3),
    innerDiameter: +innerDiameter.toFixed(2),
    crossSectionArea: +crossSectionArea.toFixed(2),
    unit: 'kg',
  };
}

const config: ToolConfig = {
  id: 'ms-pipe-weight-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  inputs: [
    {
      key: 'outerDiameter',
      label: 'Outer Diameter (OD)',
      type: 'number',
      min: 1, max: 2000, step: 0.1, default: 48.3,
      unit: 'mm',
      help: 'Standard NB 1½": OD = 48.3 mm (DN40)',
    },
    {
      key: 'wallThickness',
      label: 'Wall Thickness (WT)',
      type: 'number',
      min: 0.1, max: 100, step: 0.1, default: 3.68,
      unit: 'mm',
      help: 'Schedule 40 NB 1½": WT = 3.68 mm',
    },
    {
      key: 'length',
      label: 'Length',
      type: 'number',
      min: 0.01, max: 100000, step: 0.1, default: 6,
      unit: 'm',
    },
    {
      key: 'quantity',
      label: 'Number of Pipes',
      type: 'number',
      min: 1, max: 10000, step: 1, default: 1,
    },
    {
      key: 'densityKgM3',
      label: 'Steel Density',
      type: 'number',
      min: 7000, max: 8500, step: 10, default: 7850,
      unit: 'kg/m³',
      help: 'Standard mild steel density = 7850 kg/m³',
    },
  ],
  compute(values) {
    const od = Number(values.outerDiameter) || 48.3;
    const wt = Number(values.wallThickness) || 3.68;
    const len = Number(values.length) || 6;
    const qty = Number(values.quantity) || 1;
    const density = Number(values.densityKgM3) || 7850;
    try {
      return calculateMsPipeWeight(od, wt, len, qty, density);
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Calculation error');
    }
  },
  outputs: [
    { key: 'weightPerMeter', label: 'Weight per Metre (kg/m)', format: 'number', highlight: true },
    { key: 'totalWeight', label: 'Total Weight (kg)', format: 'number', highlight: true },
    { key: 'innerDiameter', label: 'Inner Diameter (mm)', format: 'number' },
    { key: 'crossSectionArea', label: 'Cross-Section Area (mm²)', format: 'number' },
  ],
};

export default config;
