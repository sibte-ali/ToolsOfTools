import type { ToolConfig } from '../../lib/engine/types';
import { calculateMulank } from '../../lib/fun/numerology';

export { calculateMulank };

const config: ToolConfig = {
  id: 'mulank-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'day',
      label: 'Day of Birth (1 to 31)',
      type: 'number',
      min: 1,
      max: 31,
      step: 1,
      default: 28,
    },
  ],
  compute(values) {
    const day = Math.min(31, Math.max(1, Number(values.day) || 28));
    const res = calculateMulank(day);
    return {
      mulank: res.mulank,
      day: res.day,
      rulingPlanet: res.rulingPlanet,
      traits: res.traits,
      luckyColor: res.luckyColor,
      luckyDay: res.luckyDay,
      disclaimerNote: 'Traditional beliefs for cultural and entertainment enjoyment only.',
    };
  },
  outputs: [
    { key: 'mulank', label: 'Mulank (Driver / Root Number)', format: 'number', highlight: true },
    { key: 'rulingPlanet', label: 'Ruling Celestial Body', format: 'text', highlight: true },
    { key: 'traits', label: 'Core Personality Strengths', format: 'text' },
    { key: 'luckyColor', label: 'Traditional Lucky Colors', format: 'text' },
    { key: 'luckyDay', label: 'Traditional Lucky Day', format: 'text' },
    { key: 'disclaimerNote', label: 'Cultural Note', format: 'text' },
  ],
};

export default config;
