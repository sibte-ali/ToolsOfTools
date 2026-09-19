import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import { kgToLb, lbToKg } from '../../lib/health/bmi';

export interface PlateLoadingInput {
  unitSystem?: 'metric' | 'imperial';
  targetWeight: number;
  barWeight: number;
  collarsWeight?: number;
}

export interface PlateCount {
  weight: number;
  countPerSide: number;
}

export const METRIC_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
export const IMPERIAL_PLATES = [45, 35, 25, 10, 5, 2.5];

export function calculateBarbellPlates(input: PlateLoadingInput) {
  const isImperial = input.unitSystem === 'imperial';
  const { targetWeight, barWeight } = input;
  const collarsWeight = input.collarsWeight || 0;

  const totalBaseWeight = barWeight + collarsWeight;

  if (targetWeight < totalBaseWeight) {
    return {
      achievedWeight: totalBaseWeight,
      unachievedWeight: roundHalfAwayFromZero(totalBaseWeight - targetWeight, 1),
      weightPerSide: 0,
      platesPerSideString: 'None (Target is below empty bar weight)',
      totalPlatesUsed: 0,
      convertedWeight: isImperial ? `${lbToKg(totalBaseWeight)} kg` : `${kgToLb(totalBaseWeight)} lbs`
    };
  }

  const netNeeded = targetWeight - totalBaseWeight;
  let remainingPerSide = netNeeded / 2;

  const availablePlates = isImperial ? IMPERIAL_PLATES : METRIC_PLATES;
  const unit = isImperial ? 'lb' : 'kg';

  const platesLoaded: PlateCount[] = [];
  let loadedPerSideTotal = 0;

  for (const plate of availablePlates) {
    if (remainingPerSide >= plate) {
      const count = Math.floor(remainingPerSide / plate);
      platesLoaded.push({ weight: plate, countPerSide: count });
      remainingPerSide -= count * plate;
      loadedPerSideTotal += count * plate;
    }
  }

  const achievedWeight = totalBaseWeight + loadedPerSideTotal * 2;
  const unachievedWeight = roundHalfAwayFromZero(targetWeight - achievedWeight, 1);

  const totalPlatesUsed = platesLoaded.reduce((acc, p) => acc + p.countPerSide * 2, 0);

  const platesPerSideString =
    platesLoaded.length > 0
      ? platesLoaded.map(p => `${p.countPerSide} × ${p.weight} ${unit}`).join(', ')
      : 'None (Empty Barbell)';

  const convertedAchieved = isImperial
    ? `${lbToKg(achievedWeight)} kg`
    : `${kgToLb(achievedWeight)} lbs`;

  return {
    achievedWeight: roundHalfAwayFromZero(achievedWeight, 1),
    unachievedWeight: Math.abs(unachievedWeight),
    weightPerSide: roundHalfAwayFromZero(loadedPerSideTotal, 1),
    platesPerSideString,
    totalPlatesUsed,
    convertedWeight: convertedAchieved
  };
}

const config: ToolConfig = {
  id: 'plate-weight-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'unitSystem',
      label: 'Measurement Unit',
      type: 'select',
      default: 'metric',
      options: [
        { label: 'Metric (Kilograms - kg)', value: 'metric' },
        { label: 'Imperial (Pounds - lb)', value: 'imperial' }
      ]
    },
    {
      key: 'targetWeight',
      label: 'Target Total Lift Weight',
      type: 'number',
      min: 10,
      max: 500,
      step: 0.5,
      default: 100,
      unit: 'kg or lb',
      help: 'Target weight including barbell, collars, and plates.'
    },
    {
      key: 'barWeight',
      label: 'Barbell Weight',
      type: 'select',
      default: '20',
      options: [
        { label: '20 kg (Standard Olympic Men)', value: '20' },
        { label: '15 kg (Standard Olympic Women)', value: '15' },
        { label: '10 kg (Technique / Junior Bar)', value: '10' },
        { label: '45 lb (Standard Olympic Men)', value: '45' },
        { label: '35 lb (Standard Olympic Women)', value: '35' },
        { label: '25 lb (Light Training Bar)', value: '25' }
      ]
    },
    {
      key: 'collarsWeight',
      label: 'Collars / Clamps Weight (Pair)',
      type: 'number',
      min: 0,
      max: 10,
      step: 0.25,
      default: 0,
      unit: 'kg or lb',
      help: 'Optional: Olympic competition collars weigh 2.5 kg (5 lb) per pair.'
    }
  ],
  compute(values) {
    const unitSystem = (values.unitSystem as any) || 'metric';
    const targetWeight = Number(values.targetWeight) || (unitSystem === 'imperial' ? 225 : 100);
    const barWeight = Number(values.barWeight) || (unitSystem === 'imperial' ? 45 : 20);
    const collarsWeight = Number(values.collarsWeight) || 0;

    return calculateBarbellPlates({ unitSystem, targetWeight, barWeight, collarsWeight });
  },
  outputs: [
    { key: 'platesPerSideString', label: 'Plates to Load on EACH Side', format: 'text', highlight: true },
    { key: 'achievedWeight', label: 'Actual Total Loaded Weight', format: 'number', highlight: true },
    { key: 'weightPerSide', label: 'Plates Weight Per Sleeve', format: 'number' },
    { key: 'unachievedWeight', label: 'Unachieved Margin (Diff)', format: 'number' },
    { key: 'totalPlatesUsed', label: 'Total Number of Plates Across Bar', format: 'number' },
    { key: 'convertedWeight', label: 'Equivalent Weight (Other System)', format: 'text' }
  ],
  chart: 'none'
};

export default config;
