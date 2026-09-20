import type { ToolConfig } from '../../lib/engine/types';

const DEFAULT_JSON = `{"user":{"id":42,"name":"Alice","roles":["admin","editor"]},"active":true,"score":98.5}`;

const config: ToolConfig = {
  id: 'json-parser',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'JSON String to Parse',
      type: 'textarea',
      default: DEFAULT_JSON,
      help: 'Paste your JSON string – the parser will extract structure, types, and key paths',
    },
  ],
  compute(values) {
    const input = String(values.jsonInput || DEFAULT_JSON).trim();

    let parsed: any;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      return new Error(`Parse Error: ${(e as SyntaxError).message}`);
    }

    function countKeys(obj: any, depth = 0): { keys: number; depth: number } {
      if (typeof obj !== 'object' || obj === null) return { keys: 0, depth };
      let keys = 0;
      let maxDepth = depth;
      for (const k of Object.keys(obj)) {
        keys += 1;
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const child = countKeys(obj[k], depth + 1);
          keys += child.keys;
          if (child.depth > maxDepth) maxDepth = child.depth;
        }
      }
      return { keys, depth: maxDepth };
    }

    const { keys: totalKeys, depth: nestingDepth } = countKeys(parsed);
    const rootType = Array.isArray(parsed) ? 'array' : typeof parsed;
    const rootLength = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
    const prettyPrinted = JSON.stringify(parsed, null, 2);

    return {
      prettyPrinted,
      rootType: rootType.charAt(0).toUpperCase() + rootType.slice(1),
      rootLength,
      totalKeys,
      nestingDepth,
    };
  },
  outputs: [
    { key: 'prettyPrinted', label: 'Parsed Output', format: 'code' },
    { key: 'rootType', label: 'Root Type', format: 'text' },
    { key: 'rootLength', label: 'Root Keys / Items', format: 'number' },
    { key: 'totalKeys', label: 'Total Keys (all levels)', format: 'number' },
    { key: 'nestingDepth', label: 'Max Nesting Depth', format: 'number' },
  ],
};

export default config;
