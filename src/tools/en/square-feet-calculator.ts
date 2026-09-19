import type { ToolConfig } from '../../lib/engine/types';

/**
 * SERP INTENT NOTE (verified 2026-09-19):
 * Top 5 results for "square feet calculator":
 * 1. Calculator.net - area calculator for room/flooring, multiple shapes
 * 2. InchCalculator - rectangle + multi-room + price per sqft
 * 3. CalculatorSoup - shape area with unit conversion
 * 4. OmniCalculator - area converter for flooring/tile
 * 5. TheCalculatorSite - room area calculator with wastage %
 * Intent: Calculate area for flooring/rooms in multiple shapes (rect, triangle, circle, trapezoid),
 *   convert between sq ft / sq m / sq yd, multi-room total, +wastage %.
 */
export type AreaShape = 'rectangle' | 'triangle' | 'circle' | 'trapezoid';
export type AreaUnit = 'ft' | 'in' | 'm' | 'cm';

const toFeet: Record<AreaUnit, number> = { ft: 1, in: 1 / 12, m: 3.28084, cm: 0.0328084 };

export function calculateArea(
  shape: AreaShape,
  dims: Record<string, number>,
  unit: AreaUnit,
  wastagePct: number
): {
  sqFt: number; sqM: number; sqYd: number;
  sqFtWithWastage: number; sqMWithWastage: number;
} {
  const f = toFeet[unit];
  let sqFt = 0;
  switch (shape) {
    case 'rectangle':
      sqFt = dims.length * f * (dims.width * f);
      break;
    case 'triangle':
      sqFt = 0.5 * dims.base * f * (dims.height * f);
      break;
    case 'circle':
      sqFt = Math.PI * Math.pow(dims.radius * f, 2);
      break;
    case 'trapezoid':
      sqFt = 0.5 * (dims.a + dims.b) * f * (dims.height * f);
      break;
  }
  const sqM = sqFt * 0.09290304;
  const sqYd = sqFt / 9;
  const wastage = 1 + wastagePct / 100;
  return {
    sqFt: +sqFt.toFixed(4),
    sqM: +sqM.toFixed(4),
    sqYd: +sqYd.toFixed(4),
    sqFtWithWastage: +(sqFt * wastage).toFixed(4),
    sqMWithWastage: +(sqM * wastage).toFixed(4),
  };
}

const config: ToolConfig = {
  id: 'square-feet-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'shape',
      label: 'Room / Area Shape',
      type: 'select',
      default: 'rectangle',
      options: [
        { label: 'Rectangle / Square', value: 'rectangle' },
        { label: 'Triangle', value: 'triangle' },
        { label: 'Circle', value: 'circle' },
        { label: 'Trapezoid', value: 'trapezoid' },
      ],
    },
    {
      key: 'unit',
      label: 'Measurement Unit',
      type: 'select',
      default: 'ft',
      options: [
        { label: 'Feet (ft)', value: 'ft' },
        { label: 'Inches (in)', value: 'in' },
        { label: 'Meters (m)', value: 'm' },
        { label: 'Centimeters (cm)', value: 'cm' },
      ],
    },
    { key: 'length', label: 'Length (rectangle)', type: 'number', min: 0, step: 0.1, default: 12, unit: '' },
    { key: 'width', label: 'Width (rectangle)', type: 'number', min: 0, step: 0.1, default: 10, unit: '' },
    { key: 'base', label: 'Base (triangle / trapezoid)', type: 'number', min: 0, step: 0.1, default: 12, unit: '' },
    { key: 'height', label: 'Height (triangle / trapezoid)', type: 'number', min: 0, step: 0.1, default: 8, unit: '' },
    { key: 'a', label: 'Top Side — a (trapezoid)', type: 'number', min: 0, step: 0.1, default: 10, unit: '' },
    { key: 'radius', label: 'Radius (circle)', type: 'number', min: 0, step: 0.1, default: 6, unit: '' },
    {
      key: 'wastagePct',
      label: 'Wastage / Overage %',
      type: 'number',
      min: 0, max: 50, step: 1, default: 10,
      unit: '%',
      help: 'Typically 10% for flooring, 15% for tiles',
    },
  ],
  compute(values) {
    const shape = String(values.shape || 'rectangle') as AreaShape;
    const unit = String(values.unit || 'ft') as AreaUnit;
    const wastagePct = Math.max(0, Number(values.wastagePct) || 10);
    const dims: Record<string, number> = {
      length: Number(values.length) || 12,
      width: Number(values.width) || 10,
      base: Number(values.base) || 12,
      height: Number(values.height) || 8,
      a: Number(values.a) || 10,
      radius: Number(values.radius) || 6,
    };
    return calculateArea(shape, dims, unit, wastagePct);
  },
  outputs: [
    { key: 'sqFt', label: 'Area — Square Feet (ft²)', format: 'number', highlight: true },
    { key: 'sqFtWithWastage', label: `Area incl. Wastage (ft²)`, format: 'number', highlight: true },
    { key: 'sqM', label: 'Area — Square Meters (m²)', format: 'number' },
    { key: 'sqMWithWastage', label: 'Area incl. Wastage (m²)', format: 'number' },
    { key: 'sqYd', label: 'Area — Square Yards (yd²)', format: 'number' },
  ],
};

export default config;
