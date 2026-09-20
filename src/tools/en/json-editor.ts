import type { ToolConfig } from '../../lib/engine/types';

const DEFAULT_JSON = `{
  "project": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite"
  }
}`;

const config: ToolConfig = {
  id: 'json-editor',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'Edit Your JSON',
      type: 'textarea',
      default: DEFAULT_JSON,
      help: 'Edit your JSON directly – live validation and stats update as you type',
    },
    {
      key: 'indent',
      label: 'Format With Indent',
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
    const input = String(values.jsonInput || DEFAULT_JSON);
    const indentRaw = String(values.indent || '2');
    const indent = indentRaw === 'tab' ? '\t' : Number(indentRaw);

    let parsed: any;
    let validationStatus: string;
    let formattedOutput: string;

    try {
      parsed = JSON.parse(input);
      formattedOutput = JSON.stringify(parsed, null, indent);
      validationStatus = '✅ Valid JSON';
    } catch (e) {
      return new Error(`Syntax Error: ${(e as SyntaxError).message}`);
    }

    function countKeys(obj: any): number {
      if (typeof obj !== 'object' || obj === null) return 0;
      let count = Object.keys(obj).length;
      for (const v of Object.values(obj)) {
        if (typeof v === 'object' && v !== null) count += countKeys(v);
      }
      return count;
    }

    return {
      formattedOutput,
      validationStatus,
      charCount: input.length,
      lineCount: formattedOutput.split('\n').length,
      keyCount: countKeys(parsed),
    };
  },
  outputs: [
    { key: 'formattedOutput', label: 'Formatted JSON', format: 'code' },
    { key: 'validationStatus', label: 'Validation', format: 'text', highlight: true },
    { key: 'charCount', label: 'Characters', format: 'number' },
    { key: 'lineCount', label: 'Lines', format: 'number' },
    { key: 'keyCount', label: 'Total Keys', format: 'number' },
  ],
};

export default config;
