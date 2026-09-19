import type { ToolConfig } from '../../lib/engine/types';
import concreteData from '../../data/construction-costs.json';

// Concrete mix ratios (cement:sand:aggregate by volume)
// Source: IS 456:2000; dry volume factor 1.54 (for wet-to-dry shrinkage)
const MIX_RATIOS: Record<string, { label: string; cement: number; sand: number; aggregate: number; cementBagsPerM3: number }> = {
  M15: { label: 'M15 (1:2:4)', cement: 1, sand: 2, aggregate: 4, cementBagsPerM3: 6.3 },
  M20: { label: 'M20 (1:1.5:3)', cement: 1, sand: 1.5, aggregate: 3, cementBagsPerM3: 8.0 },
  M25: { label: 'M25 (1:1:2)', cement: 1, sand: 1, aggregate: 2, cementBagsPerM3: 11.1 },
};

export type ConcreteShape = 'slab' | 'footing' | 'column' | 'cylinder';
export type ConcreteUnit = 'm' | 'ft' | 'in';

const toMeters: Record<ConcreteUnit, number> = { m: 1, ft: 0.3048, in: 0.0254 };

export function calculateConcrete(
  shape: ConcreteShape,
  dims: Record<string, number>,
  unit: ConcreteUnit,
  mix: 'M15' | 'M20' | 'M25',
  wastagePct: number
): {
  volumeM3: number;
  volumeYd3: number;
  cementBags50kg: number;
  sandM3: number;
  aggregateM3: number;
  volumeWithWastageM3: number;
  mixLabel: string;
} {
  const f = toMeters[unit];
  let volumeM3 = 0;

  switch (shape) {
    case 'slab':
      volumeM3 = dims.length * f * dims.width * f * dims.thickness * f;
      break;
    case 'footing':
      volumeM3 = dims.length * f * dims.width * f * dims.depth * f;
      break;
    case 'column':
      volumeM3 = dims.length * f * dims.width * f * dims.height * f;
      break;
    case 'cylinder':
      volumeM3 = Math.PI * Math.pow(dims.diameter * f / 2, 2) * dims.height * f;
      break;
  }

  const wasteFactor = 1 + wastagePct / 100;
  const volumeWithWastageM3 = volumeM3 * wasteFactor;

  const mixData = MIX_RATIOS[mix];
  const sumRatios = mixData.cement + mixData.sand + mixData.aggregate;
  const dryFactor = 1.54; // Dry volume = 1.54 × wet volume

  const cementBags50kg = volumeWithWastageM3 * mixData.cementBagsPerM3;
  const sandM3 = (mixData.sand / sumRatios) * volumeWithWastageM3 * dryFactor;
  const aggregateM3 = (mixData.aggregate / sumRatios) * volumeWithWastageM3 * dryFactor;
  const volumeYd3 = volumeM3 / 0.764555;

  return {
    volumeM3: +volumeM3.toFixed(4),
    volumeYd3: +volumeYd3.toFixed(4),
    cementBags50kg: +cementBags50kg.toFixed(1),
    sandM3: +sandM3.toFixed(3),
    aggregateM3: +aggregateM3.toFixed(3),
    volumeWithWastageM3: +volumeWithWastageM3.toFixed(4),
    mixLabel: mixData.label,
  };
}

const config: ToolConfig = {
  id: 'concrete-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  inputs: [
    {
      key: 'shape',
      label: 'Concrete Structure',
      type: 'select',
      default: 'slab',
      options: [
        { label: 'Slab (length × width × thickness)', value: 'slab' },
        { label: 'Footing / Foundation (length × width × depth)', value: 'footing' },
        { label: 'Column (length × width × height)', value: 'column' },
        { label: 'Cylinder (diameter × height)', value: 'cylinder' },
      ],
    },
    { key: 'unit', label: 'Unit', type: 'select', default: 'm', options: [
      { label: 'Metres (m)', value: 'm' },
      { label: 'Feet (ft)', value: 'ft' },
      { label: 'Inches (in)', value: 'in' },
    ]},
    { key: 'length', label: 'Length / Side A', type: 'number', min: 0, step: 0.1, default: 5, unit: '' },
    { key: 'width', label: 'Width / Side B', type: 'number', min: 0, step: 0.1, default: 4, unit: '' },
    { key: 'thickness', label: 'Thickness (slab)', type: 'number', min: 0, step: 0.01, default: 0.15, unit: '' },
    { key: 'depth', label: 'Depth (footing)', type: 'number', min: 0, step: 0.1, default: 0.5, unit: '' },
    { key: 'height', label: 'Height (column / cylinder)', type: 'number', min: 0, step: 0.1, default: 3, unit: '' },
    { key: 'diameter', label: 'Diameter (cylinder)', type: 'number', min: 0, step: 0.1, default: 0.5, unit: '' },
    {
      key: 'mix',
      label: 'Mix Grade',
      type: 'select',
      default: 'M20',
      options: [
        { label: 'M15 – General construction (1:2:4)', value: 'M15' },
        { label: 'M20 – RCC slabs & columns (1:1.5:3)', value: 'M20' },
        { label: 'M25 – High-strength RCC (1:1:2)', value: 'M25' },
      ],
    },
    { key: 'wastagePct', label: 'Wastage %', type: 'number', min: 0, max: 30, step: 1, default: 5, unit: '%' },
  ],
  compute(values) {
    const shape = String(values.shape || 'slab') as ConcreteShape;
    const unit = String(values.unit || 'm') as ConcreteUnit;
    const mix = String(values.mix || 'M20') as 'M15' | 'M20' | 'M25';
    const dims: Record<string, number> = {
      length: Number(values.length) || 5,
      width: Number(values.width) || 4,
      thickness: Number(values.thickness) || 0.15,
      depth: Number(values.depth) || 0.5,
      height: Number(values.height) || 3,
      diameter: Number(values.diameter) || 0.5,
    };
    return calculateConcrete(shape, dims, unit, mix, Number(values.wastagePct) || 5);
  },
  outputs: [
    { key: 'volumeM3', label: 'Concrete Volume (m³)', format: 'number', highlight: true },
    { key: 'cementBags50kg', label: 'Cement Bags (50 kg)', format: 'number', highlight: true },
    { key: 'sandM3', label: 'Sand Required (m³)', format: 'number' },
    { key: 'aggregateM3', label: 'Aggregate Required (m³)', format: 'number' },
    { key: 'volumeYd3', label: 'Volume (cubic yards)', format: 'number' },
    { key: 'volumeWithWastageM3', label: 'Volume incl. Wastage (m³)', format: 'number' },
    { key: 'mixLabel', label: 'Mix Grade', format: 'text' },
  ],
};

export default config;

// Silence unused import warning
void concreteData;
