import type { ToolConfig } from '../../lib/engine/types';
import { calculateLoShuGrid } from '../../lib/fun/numerology';

export { calculateLoShuGrid };

const config: ToolConfig = {
  id: 'lo-shu-grid',
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

    const res = calculateLoShuGrid(day, month, year);

    // Format grid display
    const gridDisplay = `
[ ${res.grid[0][0]} ] [ ${res.grid[0][1]} ] [ ${res.grid[0][2]} ]   (Mental: 4-9-2)
[ ${res.grid[1][0]} ] [ ${res.grid[1][1]} ] [ ${res.grid[1][2]} ]   (Emotional: 3-5-7)
[ ${res.grid[2][0]} ] [ ${res.grid[2][1]} ] [ ${res.grid[2][2]} ]   (Practical: 8-1-6)
`.trim();

    const repeatingStr = res.repeatingNumbers.length > 0
      ? res.repeatingNumbers.map((r) => `Number ${r.number} (${r.count}x)`).join(', ')
      : 'None';

    return {
      mulank: res.mulank,
      bhagyank: res.bhagyank,
      presentNumbers: res.presentNumbers.join(', '),
      missingNumbers: res.missingNumbers.join(', ') || 'None',
      repeatingNumbers: repeatingStr,
      gridDisplay,
      mentalPlane: res.planes.mental.status,
      emotionalPlane: res.planes.emotional.status,
      practicalPlane: res.planes.practical.status,
      willPlane: res.planes.will.status,
      actionPlane: res.planes.action.status,
      goldenSuccessPlane: res.planes.goldenSuccess.status,
    };
  },
  outputs: [
    { key: 'mulank', label: 'Mulank (Driver Number)', format: 'number', highlight: true },
    { key: 'bhagyank', label: 'Bhagyank (Destiny Number)', format: 'number', highlight: true },
    { key: 'gridDisplay', label: 'Lo Shu 3x3 Grid (Digit Counts)', format: 'text' },
    { key: 'presentNumbers', label: 'Numbers Present', format: 'text' },
    { key: 'missingNumbers', label: 'Missing Numbers (Karmic Focus)', format: 'text' },
    { key: 'repeatingNumbers', label: 'Repeating Numbers', format: 'text' },
    { key: 'mentalPlane', label: 'Mental Plane (4-9-2)', format: 'text' },
    { key: 'emotionalPlane', label: 'Emotional Plane (3-5-7)', format: 'text' },
    { key: 'practicalPlane', label: 'Practical Plane (8-1-6)', format: 'text' },
    { key: 'goldenSuccessPlane', label: 'Golden Success Plane (4-5-6)', format: 'text' },
  ],
};

export default config;
