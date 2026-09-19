import type { ToolConfig } from '../../lib/engine/types';
import { calculateCombinatorics } from '../../lib/math/combinatorics';

const config: ToolConfig = {
  id: 'combination-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'n',
      label: 'Total items (n)',
      type: 'number',
      min: 0,
      max: 500,
      step: 1,
      default: 10,
      help: 'Total number of items in the set',
    },
    {
      key: 'r',
      label: 'Items chosen (r)',
      type: 'number',
      min: 0,
      max: 500,
      step: 1,
      default: 3,
      help: 'Number of items selected at a time',
    },
  ],
  compute(values) {
    const n = Math.round(Math.max(0, Number(values.n) || 10));
    const r = Math.round(Math.max(0, Number(values.r) || 3));
    try {
      const res = calculateCombinatorics(n, r);
      return {
        nCr: res.nCr.toString(),
        nPr: res.nPr.toString(),
        nCrRepeat: res.nCrRepeat.toString(),
        nPrRepeat: res.nPrRepeat.toString(),
        expansionNCr: res.factorialExpansion.nCr,
        expansionNPr: res.factorialExpansion.nPr,
        n,
        r,
      };
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Calculation error');
    }
  },
  outputs: [
    { key: 'nCr', label: 'Combinations nCr (without repetition)', format: 'text', highlight: true },
    { key: 'nPr', label: 'Permutations nPr (without repetition)', format: 'text', highlight: true },
    { key: 'nCrRepeat', label: 'Combinations with Repetition', format: 'text' },
    { key: 'nPrRepeat', label: 'Permutations with Repetition (nʳ)', format: 'text' },
    { key: 'expansionNCr', label: 'nCr Factorial Expansion', format: 'text' },
    { key: 'expansionNPr', label: 'nPr Factorial Expansion', format: 'text' },
  ],
};

export default config;
