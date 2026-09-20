import type { ToolConfig } from '../../lib/engine/types';

const DEFAULT_JSON = `{"name":"ToolsOfTools","version":"2.0","features":["beautify","validate","sort"],"active":true}`;

const config: ToolConfig = {
  id: 'json-beautifier',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'Paste JSON Here',
      type: 'textarea',
      default: DEFAULT_JSON,
      help: 'Paste minified or messy JSON to beautify it instantly',
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
        { label: 'No – keep original order', value: 'no' },
        { label: 'Yes – A → Z', value: 'yes' },
      ],
    },
  ],
  compute(values) {
    const input = String(values.jsonInput || DEFAULT_JSON).trim();
    const indentRaw = String(values.indent || '2');
    const indent = indentRaw === 'tab' ? '\t' : Number(indentRaw);
    const sortKeys = values.sortKeys === 'yes';

    let parsed: any;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      return new Error(`Invalid JSON: ${(e as SyntaxError).message}`);
    }

    function sortDeep(obj: any): any {
      if (Array.isArray(obj)) return obj.map(sortDeep);
      if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj)
          .sort()
          .reduce((acc: any, k) => { acc[k] = sortDeep(obj[k]); return acc; }, {});
      }
      return obj;
    }

    const finalObj = sortKeys ? sortDeep(parsed) : parsed;
    const beautified = JSON.stringify(finalObj, null, indent);
    const charsBefore = input.replace(/\s/g, '').length;
    const charsAfter = beautified.length;

    return {
      beautified,
      charsBefore,
      charsAfter,
      lineCount: beautified.split('\n').length,
    };
  },
  outputs: [
    { key: 'beautified', label: 'Beautified JSON', format: 'code' },
    { key: 'lineCount', label: 'Lines', format: 'number' },
    { key: 'charsAfter', label: 'Formatted Chars', format: 'number' },
    { key: 'charsBefore', label: 'Minified Chars', format: 'number' },
  ],
};

export default config;
