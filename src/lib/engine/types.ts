/**
 * Configuration-driven calculator engine types.
 */

export type InputType =
  | 'number'
  | 'select'
  | 'date'
  | 'time'
  | 'text'
  | 'textarea'
  | 'radio'
  | 'rows';

export interface ToolInputOption {
  value: string;
  label: string;
}

export interface RowFieldDefinition {
  key: string;
  label: string;
  type: 'number' | 'text' | 'date';
  default?: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface ToolInput {
  key: string;
  label: string; // i18n key or string
  type: InputType;
  min?: number;
  max?: number;
  step?: number;
  default: any;
  unit?: string;
  options?: ToolInputOption[];
  help?: string;
  rowFields?: RowFieldDefinition[]; // For 'rows' type (e.g. cashflows with Date and Amount)
}

export type OutputFormat =
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'text'
  | 'duration'
  | 'code';

export interface ToolOutput {
  key: string;
  label: string;
  format: OutputFormat;
  highlight?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  format?: OutputFormat;
}

export interface TableData {
  columns: TableColumn[];
  rows: Record<string, any>[];
}

export interface ChartSeries {
  name: string;
  color?: string;
  values: number[];
}

export interface ChartData {
  type: 'line' | 'stacked';
  labels: string[];
  series: ChartSeries[];
}

export type ComputeResult = Record<string, any>;

export interface ToolConfig {
  id: string;
  lang: string;
  numberLocale: string;
  currency?: string;
  inputs: ToolInput[];
  compute: (values: Record<string, any>) => ComputeResult | Error;
  outputs: ToolOutput[];
  table?: (values: Record<string, any>) => TableData | Record<string, any>[];
  chart?: 'none' | 'line' | 'stacked';
}
