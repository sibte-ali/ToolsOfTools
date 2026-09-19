import type { ToolConfig } from '../../lib/engine/types';
import { calculateLove } from '../../lib/fun/love';

export { calculateLove };

const config: ToolConfig = {
  id: 'love-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'name1',
      label: 'Your Name',
      type: 'text',
      default: 'Alex',
      placeholder: 'Enter first person name',
    },
    {
      key: 'name2',
      label: 'Partner / Crush Name',
      type: 'text',
      default: 'Taylor',
      placeholder: 'Enter second person name',
    },
  ],
  compute(values) {
    const name1 = String(values.name1 || 'Alex').trim();
    const name2 = String(values.name2 || 'Taylor').trim();
    return calculateLove(name1, name2);
  },
  outputs: [
    { key: 'percentage', label: 'Love Compatibility Score', format: 'percentage', highlight: true },
    { key: 'tier', label: 'Harmony Tier', format: 'text', highlight: true },
    { key: 'headline', label: 'Connection Theme', format: 'text' },
    { key: 'message', label: 'Relationship Dynamic', format: 'text' },
    { key: 'tips', label: 'Fun Relationship Tip', format: 'text' },
  ],
};

export default config;
