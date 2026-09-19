import type { ToolConfig } from '../../lib/engine/types';

/**
 * JSON Formatter/Validator/Minifier.
 * All processing is client-side. No data leaves the browser.
 * Static default renders a formatted example JSON for view-source.
 */
const DEFAULT_JSON = `{
  "name": "ToolsOfTools",
  "version": "1.0",
  "features": ["format", "minify", "validate"]
}`;

export function formatJson(
  input: string,
  indent: 2 | 4 | 'tab',
  sortKeys: boolean
): { formatted: string; error: string | null; isValid: boolean } {
  try {
    let parsed = JSON.parse(input);
    if (sortKeys) {
      parsed = sortKeysDeep(parsed);
    }
    const indentValue = indent === 'tab' ? '\t' : indent;
    const formatted = JSON.stringify(parsed, null, indentValue);
    return { formatted, error: null, isValid: true };
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : String(e);
    return { formatted: '', error: msg, isValid: false };
  }
}

export function minifyJson(input: string): { minified: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { minified: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { minified: '', error: e instanceof Error ? e.message : String(e) };
  }
}

function sortKeysDeep(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, k) => { acc[k] = sortKeysDeep(obj[k]); return acc; }, {});
  }
  return obj;
}

const config: ToolConfig = {
  id: 'json-formatter',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'JSON Input',
      type: 'text',
      default: DEFAULT_JSON,
      help: 'Paste your JSON here to format, minify, or validate it',
    },
    {
      key: 'indent',
      label: 'Indent Style',
      type: 'select',
      default: '2',
      options: [
        { label: '2 Spaces', value: '2' },
        { label: '4 Spaces', value: '4' },
        { label: 'Tab', value: 'tab' },
      ],
    },
    {
      key: 'sortKeys',
      label: 'Sort Keys Alphabetically',
      type: 'select',
      default: 'no',
      options: [
        { label: 'No', value: 'no' },
        { label: 'Yes', value: 'yes' },
      ],
    },
  ],
  compute(values) {
    const input = String(values.jsonInput || DEFAULT_JSON);
    const indent = (String(values.indent || '2') === 'tab' ? 'tab' : Number(values.indent || 2)) as 2 | 4 | 'tab';
    const sortKeys = values.sortKeys === 'yes';

    const res = formatJson(input, indent, sortKeys);
    if (!res.isValid) {
      return new Error(`Invalid JSON: ${res.error}`);
    }
    const minRes = minifyJson(input);
    return {
      formatted: res.formatted,
      minified: minRes.minified,
      isValid: 'Valid ✓',
      charCount: res.formatted.length,
      minifiedCharCount: minRes.minified?.length ?? 0,
    };
  },
  outputs: [
    { key: 'formatted', label: 'Formatted JSON', format: 'text', highlight: true },
    { key: 'isValid', label: 'Validation Status', format: 'text' },
    { key: 'charCount', label: 'Formatted Length (chars)', format: 'number' },
    { key: 'minifiedCharCount', label: 'Minified Length (chars)', format: 'number' },
    { key: 'minified', label: 'Minified JSON', format: 'text' },
  ],
};

export default config;
