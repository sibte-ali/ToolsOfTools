import type { ToolConfig } from '../../lib/engine/types';

const DEFAULT_JSON = `{
  "company": "Acme Corp",
  "founded": 1999,
  "employees": 1200,
  "headquarters": {
    "city": "San Francisco",
    "country": "USA"
  },
  "products": ["Widget A", "Widget B", "Widget C"],
  "listed": true
}`;

const config: ToolConfig = {
  id: 'json-viewer',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'JSON to View',
      type: 'textarea',
      default: DEFAULT_JSON,
      help: 'Paste any JSON to explore its structure, types, and statistics',
    },
  ],
  compute(values) {
    const input = String(values.jsonInput || DEFAULT_JSON).trim();

    let parsed: any;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      return new Error(`Invalid JSON: ${(e as SyntaxError).message}`);
    }

    function analyze(obj: any, depth = 0): { keys: number; depth: number; strings: number; numbers: number; booleans: number; nulls: number; arrays: number; objects: number } {
      const result = { keys: 0, depth, strings: 0, numbers: 0, booleans: 0, nulls: 0, arrays: 0, objects: 0 };
      if (Array.isArray(obj)) {
        result.arrays++;
        for (const item of obj) {
          const child = analyze(item, depth + 1);
          result.keys += child.keys;
          if (child.depth > result.depth) result.depth = child.depth;
          result.strings += child.strings; result.numbers += child.numbers;
          result.booleans += child.booleans; result.nulls += child.nulls;
          result.arrays += child.arrays; result.objects += child.objects;
        }
      } else if (obj !== null && typeof obj === 'object') {
        result.objects++;
        for (const [, v] of Object.entries(obj)) {
          result.keys++;
          const child = analyze(v, depth + 1);
          if (child.depth > result.depth) result.depth = child.depth;
          result.strings += child.strings; result.numbers += child.numbers;
          result.booleans += child.booleans; result.nulls += child.nulls;
          result.arrays += child.arrays; result.objects += child.objects;
          result.keys += child.keys;
        }
      } else if (typeof obj === 'string') result.strings++;
      else if (typeof obj === 'number') result.numbers++;
      else if (typeof obj === 'boolean') result.booleans++;
      else if (obj === null) result.nulls++;
      return result;
    }

    const stats = analyze(parsed);
    const formatted = JSON.stringify(parsed, null, 2);
    const rootType = Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' ? 'Object' : typeof parsed;

    return {
      formatted,
      rootType,
      totalKeys: stats.keys,
      nestingDepth: stats.depth,
      typeBreakdown: `Strings: ${stats.strings}, Numbers: ${stats.numbers}, Booleans: ${stats.booleans}, Nulls: ${stats.nulls}`,
    };
  },
  outputs: [
    { key: 'formatted', label: 'Formatted View', format: 'code' },
    { key: 'rootType', label: 'Root Type', format: 'text', highlight: true },
    { key: 'totalKeys', label: 'Total Keys', format: 'number' },
    { key: 'nestingDepth', label: 'Nesting Depth', format: 'number' },
    { key: 'typeBreakdown', label: 'Value Types', format: 'text' },
  ],
};

export default config;
