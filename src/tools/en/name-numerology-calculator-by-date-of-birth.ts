import type { ToolConfig } from '../../lib/engine/types';
import {
  calculateNameNumerology,
  calculateBhagyank,
  NUMBER_MEANINGS,
} from '../../lib/fun/numerology';

export { calculateNameNumerology };

const config: ToolConfig = {
  id: 'name-numerology-calculator-by-date-of-birth',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      default: 'Emma Charlotte Duerre Watson',
      placeholder: 'Enter full legal or commonly used name',
    },
    {
      key: 'system',
      label: 'Numerology System',
      type: 'select',
      options: [
        { label: 'Pythagorean (Western Standard: A=1..I=9)', value: 'pythagorean' },
        { label: 'Chaldean (Ancient Mystical: 1 to 8)', value: 'chaldean' },
      ],
      default: 'pythagorean',
    },
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
      default: 4,
    },
    {
      key: 'year',
      label: 'Birth Year (YYYY)',
      type: 'number',
      min: 1900,
      max: 2099,
      step: 1,
      default: 1990,
    },
  ],
  compute(values) {
    const rawName = String(values.name || 'Emma Watson').trim();
    const system = (values.system === 'chaldean' ? 'chaldean' : 'pythagorean') as 'chaldean' | 'pythagorean';
    const day = Math.min(31, Math.max(1, Number(values.day) || 15));
    const month = Math.min(12, Math.max(1, Number(values.month) || 4));
    const year = Math.min(2099, Math.max(1900, Number(values.year) || 1990));

    const nameRes = calculateNameNumerology(rawName, system);
    const lifePathRes = calculateBhagyank(day, month, year);

    const lifePathMeaning = NUMBER_MEANINGS[lifePathRes.bhagyank] ?? 'Dynamic path of personal discovery.';

    return {
      rootNumber: nameRes.rootNumber,
      compoundNumber: nameRes.compoundNumber,
      lifePathNumber: lifePathRes.bhagyank,
      soulUrgeNumber: nameRes.soulUrgeNumber,
      personalityNumber: nameRes.personalityNumber,
      systemUsed: system === 'chaldean' ? 'Chaldean' : 'Pythagorean',
      nameMeaning: nameRes.meaning,
      lifePathMeaning,
    };
  },
  outputs: [
    { key: 'rootNumber', label: 'Expression / Name Number', format: 'number', highlight: true },
    { key: 'lifePathNumber', label: 'Life Path Number (from DOB)', format: 'number', highlight: true },
    { key: 'compoundNumber', label: 'Compound Name Sum', format: 'number' },
    { key: 'soulUrgeNumber', label: "Soul Urge (Heart's Desire)", format: 'number' },
    { key: 'personalityNumber', label: 'Personality Number (Consonants)', format: 'number' },
    { key: 'nameMeaning', label: 'Name Vibration Meaning', format: 'text' },
    { key: 'lifePathMeaning', label: 'Life Path Journey', format: 'text' },
  ],
};

export default config;
