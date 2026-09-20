import type { ToolConfig } from '../../lib/engine/types';

const DEFAULT_JSON = `{
  "person": {
    "name": "Alice",
    "age": 30,
    "email": "alice@example.com",
    "hobbies": ["reading", "coding", "hiking"]
  }
}`;

/**
 * Converts a parsed JSON object to an XML string.
 * Arrays become repeated child elements with the parent key name.
 */
function jsonToXml(obj: any, key: string, indent = 0): string {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);

  if (Array.isArray(obj)) {
    return obj.map((item) => jsonToXml(item, key, indent)).join('\n');
  }

  if (obj === null || obj === undefined) {
    return `${pad}<${key}/>`;
  }

  if (typeof obj !== 'object') {
    const escaped = String(obj)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    return `${pad}<${key}>${escaped}</${key}>`;
  }

  const children = Object.entries(obj)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return v.map((item) => jsonToXml(item, k, indent + 1)).join('\n');
      }
      return jsonToXml(v, k, indent + 1);
    })
    .join('\n');

  return `${pad}<${key}>\n${children}\n${pad}</${key}>`;
}

const config: ToolConfig = {
  id: 'json-to-xml',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'JSON Input',
      type: 'textarea',
      default: DEFAULT_JSON,
      help: 'Paste your JSON object to convert it into an XML document',
    },
    {
      key: 'rootElement',
      label: 'XML Root Element Name',
      type: 'text',
      default: 'root',
      help: 'The wrapping root tag name (default: root)',
    },
  ],
  compute(values) {
    const input = String(values.jsonInput || DEFAULT_JSON).trim();
    const rootElement = String(values.rootElement || 'root').replace(/[^a-zA-Z0-9_\-]/g, '') || 'root';

    let parsed: any;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      return new Error(`Invalid JSON: ${(e as SyntaxError).message}`);
    }

    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    const xmlBody = jsonToXml(parsed, rootElement, 0);
    const xmlOutput = `${xmlDeclaration}\n${xmlBody}`;
    const lineCount = xmlOutput.split('\n').length;

    return {
      xmlOutput,
      lineCount,
      charCount: xmlOutput.length,
    };
  },
  outputs: [
    { key: 'xmlOutput', label: 'XML Output', format: 'code' },
    { key: 'lineCount', label: 'Lines', format: 'number' },
    { key: 'charCount', label: 'Characters', format: 'number' },
  ],
};

export default config;
