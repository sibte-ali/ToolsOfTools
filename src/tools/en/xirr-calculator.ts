import type { ToolConfig } from '../../lib/engine/types';
import { computeCashFlowXirr, parseCashFlowCsv, type CashFlow } from '../../lib/finance/xirr';

export const config: ToolConfig = {
  id: 'xirr-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'cashFlows',
      label: 'Dated Cash Flows (Negative = Outflow/Investment, Positive = Inflow/Redemption)',
      type: 'rows',
      default: [
        { date: '2023-01-01', amount: -50000 },
        { date: '2023-07-01', amount: -50000 },
        { date: '2024-01-01', amount: -50000 },
        { date: '2024-12-31', amount: 180000 },
      ],
      options: [
        { label: 'Date', value: 'date' },
        { label: 'Amount', value: 'amount' },
      ],
      help: 'Add each transaction with date and cash amount. Both positive and negative amounts are required.',
    },
    {
      key: 'csvPaste',
      label: 'Or Paste CSV / Tab-separated Data (Date, Amount)',
      type: 'text',
      default: '',
      help: 'Format: YYYY-MM-DD, -50000 (one transaction per line). Overrides table rows if provided.',
    },
  ],
  outputs: [
    {
      key: 'xirrPct',
      label: 'Annualized XIRR Return',
      format: 'percent',
      highlight: true,
    },
    {
      key: 'totalInvested',
      label: 'Total Outflows (Invested)',
      format: 'currency',
    },
    {
      key: 'totalReceived',
      label: 'Total Inflows (Received)',
      format: 'currency',
    },
    {
      key: 'netGain',
      label: 'Net Profit / Gain',
      format: 'currency',
    },
  ],
  compute(values) {
    let flows: CashFlow[] = [];

    const csvText = typeof values.csvPaste === 'string' ? values.csvPaste.trim() : '';
    if (csvText) {
      flows = parseCashFlowCsv(csvText);
    }

    if (flows.length === 0 && Array.isArray(values.cashFlows)) {
      flows = values.cashFlows.map((row: any) => ({
        date: String(row.date || ''),
        amount: Number(row.amount) || 0,
      }));
    }

    if (flows.length === 0) {
      flows = [
        { date: '2023-01-01', amount: -50000 },
        { date: '2023-07-01', amount: -50000 },
        { date: '2024-01-01', amount: -50000 },
        { date: '2024-12-31', amount: 180000 },
      ];
    }

    const res = computeCashFlowXirr(flows);
    if (res.error) {
      return {
        xirrPct: 0,
        totalInvested: res.totalInvested,
        totalReceived: res.totalReceived,
        netGain: res.netGain,
        errorMessage: res.error,
      };
    }

    return {
      xirrPct: res.xirrPct,
      totalInvested: res.totalInvested,
      totalReceived: res.totalReceived,
      netGain: res.netGain,
    };
  },
  table(values) {
    let flows: CashFlow[] = [];
    const csvText = typeof values.csvPaste === 'string' ? values.csvPaste.trim() : '';
    if (csvText) {
      flows = parseCashFlowCsv(csvText);
    }
    if (flows.length === 0 && Array.isArray(values.cashFlows)) {
      flows = values.cashFlows.map((row: any) => ({
        date: String(row.date || ''),
        amount: Number(row.amount) || 0,
      }));
    }
    if (flows.length === 0) {
      flows = [
        { date: '2023-01-01', amount: -50000 },
        { date: '2023-07-01', amount: -50000 },
        { date: '2024-01-01', amount: -50000 },
        { date: '2024-12-31', amount: 180000 },
      ];
    }

    return {
      columns: [
        { key: 'index', label: '#', format: 'number' },
        { key: 'date', label: 'Date', format: 'text' },
        { key: 'type', label: 'Flow Type', format: 'text' },
        { key: 'amount', label: 'Cash Flow', format: 'currency' },
      ],
      rows: flows.map((f, idx) => ({
        index: idx + 1,
        date: f.date,
        type: f.amount < 0 ? 'Outflow (Investment)' : 'Inflow (Return)',
        amount: f.amount,
      })),
    };
  },
};

export default config;
