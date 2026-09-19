import type { ToolConfig } from '../../lib/engine/types';

export interface ResinInput {
  shape: 'rectangle' | 'round';
  length?: number;
  width?: number;
  diameter?: number;
  depth: number;
  unit: 'cm' | 'in' | 'mm';
  ratio: '1:1' | '2:1' | '3:1';
  density: number;
  wastagePct: number;
}

export function calculateResin(input: ResinInput) {
  // Convert all dimensions to cm
  const toCm: Record<string, number> = { cm: 1, in: 2.54, mm: 0.1 };
  const f = toCm[input.unit];

  let volumeCm3: number;
  if (input.shape === 'rectangle') {
    volumeCm3 = (input.length! * f) * (input.width! * f) * (input.depth * f);
  } else {
    const r = (input.diameter! / 2) * f;
    volumeCm3 = Math.PI * r * r * (input.depth * f);
  }

  const wasteFactor = 1 + input.wastagePct / 100;
  const totalVolCm3 = volumeCm3 * wasteFactor;
  const totalMl = totalVolCm3; // 1 cm³ = 1 mL
  const totalFlOz = totalMl / 29.5735;
  const totalGrams = totalMl * input.density;

  // Split by ratio
  const [partANum, partBNum] = input.ratio.split(':').map(Number);
  const sumParts = partANum + partBNum;
  const partAMl = (partANum / sumParts) * totalMl;
  const partBMl = (partBNum / sumParts) * totalMl;

  return {
    volumeNetto: +totalVolCm3.toFixed(1),
    totalMl: +totalMl.toFixed(1),
    totalFlOz: +totalFlOz.toFixed(2),
    totalGrams: +totalGrams.toFixed(1),
    partAMl: +partAMl.toFixed(1),
    partBMl: +partBMl.toFixed(1),
    partAOz: +(partAMl / 29.5735).toFixed(2),
    partBOz: +(partBMl / 29.5735).toFixed(2),
  };
}

const config: ToolConfig = {
  id: 'resin-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'shape',
      label: 'Mold Shape',
      type: 'select',
      default: 'rectangle',
      options: [
        { label: 'Rectangle / Square', value: 'rectangle' },
        { label: 'Round / Cylinder', value: 'round' },
      ],
    },
    { key: 'unit', label: 'Measurement Unit', type: 'select', default: 'cm', options: [
      { label: 'Centimeters (cm)', value: 'cm' },
      { label: 'Inches (in)', value: 'in' },
      { label: 'Millimeters (mm)', value: 'mm' },
    ]},
    { key: 'length', label: 'Length (rectangle)', type: 'number', min: 0, step: 0.1, default: 20, unit: '' },
    { key: 'width', label: 'Width (rectangle)', type: 'number', min: 0, step: 0.1, default: 15, unit: '' },
    { key: 'diameter', label: 'Diameter (round mold)', type: 'number', min: 0, step: 0.1, default: 15, unit: '' },
    { key: 'depth', label: 'Depth / Pour Height', type: 'number', min: 0, step: 0.1, default: 2, unit: '' },
    {
      key: 'ratio',
      label: 'Resin Mix Ratio (Part A : Part B)',
      type: 'select',
      default: '1:1',
      options: [
        { label: '1:1 (most epoxy resins)', value: '1:1' },
        { label: '2:1 (polyurethane / some epoxies)', value: '2:1' },
        { label: '3:1 (specialty resins)', value: '3:1' },
      ],
    },
    {
      key: 'density',
      label: 'Resin Density (g/mL)',
      type: 'number',
      min: 0.5, max: 2.5, step: 0.01, default: 1.1,
      help: 'Most epoxy resins: 1.1 g/mL. Check your product datasheet.',
    },
    {
      key: 'wastagePct',
      label: 'Wastage Buffer %',
      type: 'number',
      min: 0, max: 30, step: 1, default: 10,
      unit: '%',
      help: 'Add 10% to account for mixing losses and cup residue',
    },
  ],
  compute(values) {
    const shape = String(values.shape || 'rectangle') as 'rectangle' | 'round';
    const unit = String(values.unit || 'cm') as 'cm' | 'in' | 'mm';
    const ratio = String(values.ratio || '1:1') as '1:1' | '2:1' | '3:1';
    return calculateResin({
      shape, unit, ratio,
      length: Number(values.length) || 20,
      width: Number(values.width) || 15,
      diameter: Number(values.diameter) || 15,
      depth: Number(values.depth) || 2,
      density: Number(values.density) || 1.1,
      wastagePct: Number(values.wastagePct) || 10,
    });
  },
  outputs: [
    { key: 'totalMl', label: 'Total Resin Needed (mL)', format: 'number', highlight: true },
    { key: 'totalFlOz', label: 'Total Resin (fl oz)', format: 'number', highlight: true },
    { key: 'partAMl', label: 'Part A (mL)', format: 'number' },
    { key: 'partBMl', label: 'Part B (mL)', format: 'number' },
    { key: 'partAOz', label: 'Part A (fl oz)', format: 'number' },
    { key: 'partBOz', label: 'Part B (fl oz)', format: 'number' },
    { key: 'totalGrams', label: 'Total Weight (g)', format: 'number' },
    { key: 'volumeNetto', label: 'Net Volume (mL / cm³)', format: 'number' },
  ],
};

export default config;
