import type { ToolConfig } from '../../lib/engine/types';
import { calculateFriendship } from '../../lib/fun/friendship';

export { calculateFriendship };

const config: ToolConfig = {
  id: 'friendship-calculator-by-name',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'name1',
      label: 'Your Name',
      type: 'text',
      default: 'Sam',
      placeholder: 'Enter first person name',
    },
    {
      key: 'name2',
      label: "Friend's Name",
      type: 'text',
      default: 'Morgan',
      placeholder: 'Enter friend name',
    },
  ],
  compute(values) {
    const name1 = String(values.name1 || 'Sam').trim();
    const name2 = String(values.name2 || 'Morgan').trim();
    return calculateFriendship(name1, name2);
  },
  outputs: [
    { key: 'percentage', label: 'Friendship Compatibility', format: 'percentage', highlight: true },
    { key: 'badge', label: 'Friendship Badge', format: 'text', highlight: true },
    { key: 'friendshipTier', label: 'Camaraderie Level', format: 'text' },
    { key: 'description', label: 'Friendship Dynamic', format: 'text' },
    { key: 'adventureSuggestion', label: 'Recommended Activity', format: 'text' },
    { key: 'shareableSnippet', label: 'Share with Your Bestie', format: 'text' },
  ],
};

export default config;
