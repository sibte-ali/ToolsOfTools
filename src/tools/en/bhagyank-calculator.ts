import type { ToolConfig } from '../../lib/engine/types';
import { calculateBhagyank, calculateMulank } from '../../lib/fun/numerology';

export { calculateBhagyank };

const config: ToolConfig = {
  id: 'bhagyank-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'day',
      label: 'Birth Day (DD)',
      type: 'number',
      min: 1,
      max: 31,
      step: 1,
      default: 15,
    },
    {
      key: 'month',
      label: 'Birth Month (MM)',
      type: 'number',
      min: 1,
      max: 12,
      step: 1,
      default: 8,
    },
    {
      key: 'year',
      label: 'Birth Year (YYYY)',
      type: 'number',
      min: 1900,
      max: 2099,
      step: 1,
      default: 1995,
    },
  ],
  compute(values) {
    const day = Math.min(31, Math.max(1, Number(values.day) || 15));
    const month = Math.min(12, Math.max(1, Number(values.month) || 8));
    const year = Math.min(2099, Math.max(1900, Number(values.year) || 1995));

    const res = calculateBhagyank(day, month, year);
    const mulankRes = calculateMulank(day);

    return {
      bhagyank: res.bhagyank,
      mulank: mulankRes.mulank,
      totalSum: res.totalSum,
      destinyTheme: res.destinyTheme,
      careerFields: res.careerFields.join(', '),
      lifeLesson: res.lifeLesson,
      connectionExplanation: `Your Mulank (${mulankRes.mulank}) drives how you take action, while your Bhagyank (${res.bhagyank}) reveals your lifelong destiny direction.`,
    };
  },
  outputs: [
    { key: 'bhagyank', label: 'Bhagyank (Destiny Number)', format: 'number', highlight: true },
    { key: 'mulank', label: 'Mulank (Driver Number)', format: 'number', highlight: true },
    { key: 'totalSum', label: 'Total Unreduced Date Sum', format: 'number' },
    { key: 'destinyTheme', label: 'Life Path Theme', format: 'text' },
    { key: 'careerFields', label: 'Resonant Career Paths', format: 'text' },
    { key: 'lifeLesson', label: 'Core Life Lesson', format: 'text' },
    { key: 'connectionExplanation', label: 'Mulank & Bhagyank Synergy', format: 'text' },
  ],
};

export default config;
