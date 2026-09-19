import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export interface GannLevel {
  n: number;
  angle: string;
  type: 'Cardinal' | 'Ordinal' | 'Standard';
  targetPrice: number;
  levelType: 'Support' | 'Current' | 'Resistance';
}

export function calculateGannSquareOf9(price: number, step = 0.125): GannLevel[] {
  if (price <= 0) return [];

  const sqrtP = Math.sqrt(price);
  const levels: GannLevel[] = [];

  for (let n = -8; n <= 8; n++) {
    const term = sqrtP + n * step;
    if (term <= 0) continue;
    const targetPrice = roundHalfAwayFromZero(Math.pow(term, 2), 2);

    // Calculate angle in degrees: 1 full rotation step (n*step)
    // In Gann theory, a step of 0.25 represents 90 degrees (4 steps = 1 rotation = 360 degrees)
    // with base step 0.125 representing 45 degrees
    const deg = Math.abs(n * 45) % 360;
    let angleLabel = `${deg}°`;
    if (n === 0) angleLabel = '0° (Base)';

    let type: GannLevel['type'] = 'Standard';
    if (deg === 90 || deg === 180 || deg === 270 || deg === 0) {
      type = 'Cardinal';
    } else if (deg === 45 || deg === 135 || deg === 225 || deg === 315) {
      type = 'Ordinal';
    }

    let levelType: GannLevel['levelType'] = 'Current';
    if (n < 0) levelType = 'Support';
    else if (n > 0) levelType = 'Resistance';

    levels.push({
      n,
      angle: angleLabel,
      type,
      targetPrice,
      levelType,
    });
  }

  return levels;
}

export const config: ToolConfig = {
  id: 'gann-square-of-9-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'price',
      label: 'Asset / Index Reference Price',
      type: 'number',
      min: 0.01,
      max: 1000000,
      step: 0.01,
      default: 100,
      unit: 'pts',
      help: 'Enter closing, swing high, or swing low price',
    },
    {
      key: 'step',
      label: 'Angle Increment Step',
      type: 'select',
      default: '0.125',
      options: [
        { label: '0.125 (45° Ordinal & Cardinal Grid)', value: '0.125' },
        { label: '0.25 (90° Cardinal Quarter Cross)', value: '0.25' },
        { label: '0.50 (180° Half Cycle Opposition)', value: '0.5' },
        { label: '1.00 (360° Full Cycle Rotation)', value: '1.0' },
      ],
      help: 'Geometric angular step on the Gann Square of 9 wheel',
    },
  ],
  outputs: [
    {
      key: 'r1',
      label: 'Immediate Resistance (R1, +45°)',
      format: 'number',
      highlight: true,
    },
    {
      key: 's1',
      label: 'Immediate Support (S1, -45°)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'r2',
      label: 'Cardinal Resistance (R2, +90°)',
      format: 'number',
    },
    {
      key: 's2',
      label: 'Cardinal Support (S2, -90°)',
      format: 'number',
    },
    {
      key: 'notice',
      label: 'Regulatory Notice',
      format: 'text',
    },
  ],
  compute(values) {
    const price = Number(values.price) || 100;
    const step = Number(values.step) || 0.125;

    const levels = calculateGannSquareOf9(price, step);
    const r1 = levels.find((l) => l.n === 1)?.targetPrice || price;
    const s1 = levels.find((l) => l.n === -1)?.targetPrice || price;
    const r2 = levels.find((l) => l.n === 2)?.targetPrice || price;
    const s2 = levels.find((l) => l.n === -2)?.targetPrice || price;

    return {
      r1,
      s1,
      r2,
      s2,
      notice: 'For educational and technical study purposes only; not investment or trading advice.',
    };
  },
  table(values) {
    const price = Number(values.price) || 100;
    const step = Number(values.step) || 0.125;

    const levels = calculateGannSquareOf9(price, step);

    return {
      columns: [
        { key: 'n', label: 'Step (n)', format: 'number' },
        { key: 'levelType', label: 'Level', format: 'text' },
        { key: 'angle', label: 'Cycle Angle', format: 'text' },
        { key: 'type', label: 'Cross Type', format: 'text' },
        { key: 'targetPrice', label: 'Calculated Price', format: 'number' },
      ],
      rows: levels,
    };
  },
};

export default config;
