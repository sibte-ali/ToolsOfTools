import type { ToolConfig } from '../../lib/engine/types';
import { calculateStats, parseNumbers } from '../../lib/math/stats';

const config: ToolConfig = {
  id: 'standard-deviation-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'numbers',
      label: 'Enter Numbers (comma, space, or newline separated)',
      type: 'text',
      default: '10, 20, 30, 40, 50',
      help: 'Paste a list of numbers, e.g.: 10, 20, 30, 40, 50',
    },
  ],
  compute(values) {
    const input = String(values.numbers || '10, 20, 30, 40, 50');
    let data: number[];
    try {
      data = parseNumbers(input);
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Invalid input');
    }
    if (data.length < 2) return new Error('Please enter at least 2 numbers');

    const s = calculateStats(data);
    return {
      count: s.count,
      sum: s.sum,
      mean: s.mean,
      median: s.median,
      min: s.min,
      max: s.max,
      range: s.range,
      variancePop: s.variancePop,
      varianceSam: s.varianceSam,
      stdDevPop: s.stdDevPop,
      stdDevSam: s.stdDevSam,
      _steps: s.steps,
    };
  },
  outputs: [
    { key: 'stdDevSam', label: 'Sample Std Dev (s)', format: 'number', highlight: true },
    { key: 'stdDevPop', label: 'Population Std Dev (σ)', format: 'number', highlight: true },
    { key: 'mean', label: 'Mean (Average)', format: 'number' },
    { key: 'median', label: 'Median', format: 'number' },
    { key: 'varianceSam', label: 'Sample Variance (s²)', format: 'number' },
    { key: 'variancePop', label: 'Population Variance (σ²)', format: 'number' },
    { key: 'count', label: 'Count (n)', format: 'number' },
    { key: 'sum', label: 'Sum', format: 'number' },
    { key: 'min', label: 'Minimum', format: 'number' },
    { key: 'max', label: 'Maximum', format: 'number' },
    { key: 'range', label: 'Range (max − min)', format: 'number' },
  ],
  table(values) {
    const input = String(values.numbers || '10, 20, 30, 40, 50');
    let data: number[] = [];
    try { data = parseNumbers(input); } catch { /* ignore */ }
    if (data.length < 2) return { columns: [], rows: [] };

    const s = calculateStats(data);
    return {
      columns: [
        { key: 'value', label: 'Value (x)', format: 'number' },
        { key: 'deviation', label: 'Deviation (x − x̄)', format: 'number' },
        { key: 'deviationSq', label: 'Deviation² ', format: 'number' },
      ],
      rows: s.steps.map((step) => ({
        value: step.value,
        deviation: +step.deviation.toFixed(6),
        deviationSq: +step.deviationSq.toFixed(6),
      })),
    };
  },
};

export default config;
