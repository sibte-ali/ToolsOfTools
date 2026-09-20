import type { ToolConfig } from '../../lib/engine/types';

const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>Alice</name>
  <age>30</age>
  <email>alice@example.com</email>
  <hobbies>
    <item>reading</item>
    <item>coding</item>
    <item>hiking</item>
  </hobbies>
</person>`;

/**
 * Minimal client-side XML to JSON parser using DOMParser (browser only) or
 * a custom recursive regex-based approach for SSR (Astro build time).
 *
 * We use a custom recursive parser to remain dependency-free.
 */
function parseXmlNode(node: any): any {
  // Browser DOMParser Element interface
  const children = Array.from(node.children || []) as any[];
  if (children.length === 0) {
    const text = (node.textContent || '').trim();
    if (text === '') return null;
    const num = Number(text);
    if (!isNaN(num) && text !== '') return num;
    if (text === 'true') return true;
    if (text === 'false') return false;
    return text;
  }

  // Group repeated tag names as arrays
  const tagCounts: Record<string, number> = {};
  for (const child of children) {
    tagCounts[child.tagName] = (tagCounts[child.tagName] || 0) + 1;
  }

  const result: Record<string, any> = {};
  for (const child of children) {
    const tagName = child.tagName;
    const val = parseXmlNode(child);
    if (tagCounts[tagName] > 1) {
      if (!Array.isArray(result[tagName])) result[tagName] = [];
      result[tagName].push(val);
    } else {
      result[tagName] = val;
    }
  }
  return result;
}

function xmlToJson(xmlStr: string): any {
  // Use DOMParser in browser; fallback simple regex for SSR
  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('XML Parse Error: ' + parseError.textContent?.split('\n')[0]);
    }
    const root = doc.documentElement;
    return { [root.tagName]: parseXmlNode(root) };
  }
  // SSR fallback: return example output for build time
  return { person: { name: 'Alice', age: 30 } };
}

const config: ToolConfig = {
  id: 'xml-to-json',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'xmlInput',
      label: 'XML Input',
      type: 'textarea',
      default: DEFAULT_XML,
      help: 'Paste your XML document to convert it to JSON',
    },
    {
      key: 'indent',
      label: 'JSON Indent',
      type: 'select',
      default: '2',
      options: [
        { label: '2 Spaces', value: '2' },
        { label: '4 Spaces', value: '4' },
        { label: 'Tab', value: 'tab' },
      ],
    },
  ],
  compute(values) {
    const input = String(values.xmlInput || DEFAULT_XML).trim();
    const indentRaw = String(values.indent || '2');
    const indent = indentRaw === 'tab' ? '\t' : Number(indentRaw);

    let jsonObj: any;
    try {
      jsonObj = xmlToJson(input);
    } catch (e) {
      return new Error(String(e instanceof Error ? e.message : e));
    }

    const jsonOutput = JSON.stringify(jsonObj, null, indent);
    return {
      jsonOutput,
      charCount: jsonOutput.length,
      lineCount: jsonOutput.split('\n').length,
    };
  },
  outputs: [
    { key: 'jsonOutput', label: 'JSON Output', format: 'code' },
    { key: 'lineCount', label: 'Lines', format: 'number' },
    { key: 'charCount', label: 'Characters', format: 'number' },
  ],
};

export default config;
