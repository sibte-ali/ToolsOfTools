import type { ToolConfig } from '../../lib/engine/types';

/**
 * JSON to Excel converter.
 * Static build: renders a preview table of the default sample JSON.
 * SheetJS (xlsx) is lazy-loaded ONLY when the user clicks "Download XLSX".
 * The build-time compute shows the table preview rows.
 */
const DEFAULT_JSON = JSON.stringify([
  { name: 'Alice', department: 'Engineering', salary: 95000, joined: '2021-03-15' },
  { name: 'Bob', department: 'Marketing', salary: 72000, joined: '2022-07-01' },
  { name: 'Carol', department: 'Finance', salary: 85000, joined: '2020-11-20' },
]);

/**
 * Flatten a nested object with dot notation.
 * { a: { b: 1 } } → { 'a.b': 1 }
 */
export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

/**
 * Parse JSON array string → flattened rows + header columns.
 */
export function parseJsonForTable(jsonStr: string): {
  headers: string[];
  rows: Record<string, any>[];
  rowCount: number;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      return { headers: [], rows: [], rowCount: 0, error: 'Input must be a JSON array (e.g., [{...}, {...}])' };
    }
    if (parsed.length === 0) {
      return { headers: [], rows: [], rowCount: 0, error: 'Array is empty' };
    }

    const rows = parsed.map((item) =>
      typeof item === 'object' && item !== null ? flattenObject(item) : { value: item }
    );

    // Collect all unique headers
    const headerSet = new Set<string>();
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        headerSet.add(key);
      }
    }
    const headers = Array.from(headerSet);
    return { headers, rows, rowCount: rows.length };
  } catch (e) {
    return {
      headers: [],
      rows: [],
      rowCount: 0,
      error: e instanceof SyntaxError ? `JSON parse error: ${e.message}` : String(e),
    };
  }
}

const config: ToolConfig = {
  id: 'json-to-excel',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'jsonInput',
      label: 'JSON Array Input',
      type: 'text',
      default: DEFAULT_JSON,
      help: 'Paste a JSON array of objects. Nested keys are flattened with dot notation.',
    },
  ],
  compute(values) {
    const input = String(values.jsonInput || DEFAULT_JSON);
    const result = parseJsonForTable(input);
    if (result.error) return new Error(result.error);
    return {
      rowCount: result.rowCount,
      columnCount: result.headers.length,
      headers: result.headers.join(', '),
      preview: `${result.rowCount} rows × ${result.headers.length} columns ready to download`,
      _tableData: { headers: result.headers, rows: result.rows },
    };
  },
  outputs: [
    { key: 'preview', label: 'Preview', format: 'text', highlight: true },
    { key: 'rowCount', label: 'Total Rows', format: 'number' },
    { key: 'columnCount', label: 'Total Columns', format: 'number' },
    { key: 'headers', label: 'Column Headers', format: 'text' },
  ],
  table(values) {
    const input = String(values.jsonInput || DEFAULT_JSON);
    const result = parseJsonForTable(input);
    if (result.error || result.rows.length === 0) return { columns: [], rows: [] };
    // Show first 20 rows for preview
    return {
      columns: result.headers.map((h) => ({ key: h, label: h, format: 'text' as const })),
      rows: result.rows.slice(0, 20),
    };
  },
};

export default config;
