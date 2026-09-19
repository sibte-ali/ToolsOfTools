import type { ToolConfig } from '../../lib/engine/types';
import { calculateFlames } from '../../lib/fun/flames';

export { calculateFlames };

const config: ToolConfig = {
  id: 'flames-game',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'name1',
      label: 'First Name',
      type: 'text',
      default: 'Romeo',
      placeholder: 'e.g. Romeo',
    },
    {
      key: 'name2',
      label: 'Second Name',
      type: 'text',
      default: 'Juliet',
      placeholder: 'e.g. Juliet',
    },
  ],
  compute(values) {
    const name1 = String(values.name1 || 'Romeo').trim();
    const name2 = String(values.name2 || 'Juliet').trim();
    const res = calculateFlames(name1, name2);
    const stepsSummary = res.steps.map((s) => s.explanation).join('\n');
    return {
      outcomeLabel: res.outcomeLabel,
      outcomeCode: res.outcomeCode,
      count: res.count,
      commonLetters: res.commonLetters.join(', ') || 'None',
      interpretation: res.interpretation,
      stepsSummary,
    };
  },
  outputs: [
    { key: 'outcomeLabel', label: 'FLAMES Outcome', format: 'text', highlight: true },
    { key: 'outcomeCode', label: 'Result Acronym', format: 'text' },
    { key: 'count', label: 'Remaining Letter Count (N)', format: 'number' },
    { key: 'commonLetters', label: 'Common Cancelled Letters', format: 'text' },
    { key: 'interpretation', label: 'Dynamic Meaning', format: 'text' },
    { key: 'stepsSummary', label: 'Elimination Steps', format: 'text' },
  ],
};

export default config;
