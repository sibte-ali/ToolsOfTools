import type { ToolConfig } from '../../lib/engine/types';

const DEFAULT_JSON = `{
  "name": "ToolsOfTools",
  "version": "2.0.0",
  "description": "Free online tools for developers and professionals",
  "keywords": ["tools", "calculators", "converters"],
  "private": false
}`;

const config: ToolConfig = {
  id: 'json-minifier',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'JSON to Minify',
      type: 'textarea',
      default: DEFAULT_JSON,
      help: 'Paste formatted/beautified JSON to compress it by removing all whitespace and newlines',
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

    const minified = JSON.stringify(parsed);
    const originalBytes = new TextEncoder().encode(input).length;
    const minifiedBytes = new TextEncoder().encode(minified).length;
    const savedBytes = originalBytes - minifiedBytes;
    const compressionRatio = originalBytes > 0 ? ((savedBytes / originalBytes) * 100).toFixed(1) + '%' : '0%';

    return {
      minified,
      originalChars: input.length,
      minifiedChars: minified.length,
      savedChars: savedBytes,
      compressionRatio,
    };
  },
  outputs: [
    { key: 'minified', label: 'Minified JSON', format: 'code' },
    { key: 'compressionRatio', label: 'Compression', format: 'text', highlight: true },
    { key: 'originalChars', label: 'Original Length (chars)', format: 'number' },
    { key: 'minifiedChars', label: 'Minified Length (chars)', format: 'number' },
    { key: 'savedChars', label: 'Bytes Saved', format: 'number' },
  ],
};

export default config;
