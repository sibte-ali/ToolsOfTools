import type { ToolConfig } from '../../lib/engine/types';
import { calculateDailySip } from '../../lib/finance/sip';

export const config: ToolConfig = {
  id: 'daily-sip-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'dailyAmount',
      label: 'Daily Investment Amount',
      type: 'number',
      min: 10,
      max: 100000,
      step: 10,
      default: 100,
      unit: '₹',
      help: 'Amount invested every day (micro-SIP)',
    },
    {
      key: 'expectedReturnPct',
      label: 'Expected Return (% p.a.)',
      type: 'number',
      min: 1,
      max: 30,
      step: 0.1,
      default: 12,
      unit: '%',
      help: 'Annualized expected rate of return',
    },
    {
      key: 'years',
      label: 'Investment Period (Years)',
      type: 'number',
      min: 1,
      max: 35,
      step: 1,
      default: 5,
      unit: 'years',
    },
    {
      key: 'daysPerYear',
      label: 'Frequency Days / Year',
      type: 'select',
      default: '365',
      options: [
        { label: '365 Days (Calendar Daily)', value: '365' },
        { label: '260 Days (Working / Trading Days Only)', value: '260' },
      ],
      help: 'Select whether deposits happen every single day or on trading/working days',
    },
  ],
  outputs: [
    {
      key: 'maturityValue',
      label: 'Expected Maturity Amount',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalInvested',
      label: 'Total Amount Deposited',
      format: 'currency',
    },
    {
      key: 'estimatedReturns',
      label: 'Estimated Wealth Gain',
      format: 'currency',
    },
    {
      key: 'totalDays',
      label: 'Total Number of Installments',
      format: 'number',
    },
  ],
  compute(values) {
    const dailyAmount = Number(values.dailyAmount) || 100;
    const expectedReturnPct = Number(values.expectedReturnPct) || 12;
    const years = Number(values.years) || 5;
    const daysPerYear = Number(values.daysPerYear) || 365;

    const res = calculateDailySip(dailyAmount, expectedReturnPct, years, daysPerYear);

    const labels = res.yearlyRows.map((r) => `Yr ${r.year}`);
    const balanceValues = res.yearlyRows.map((r) => r.yearEndBalance);
    const investedValues = res.yearlyRows.map((r) => r.totalInvested);

    return {
      maturityValue: res.maturityValue,
      totalInvested: res.totalInvested,
      estimatedReturns: res.estimatedReturns,
      totalDays: res.totalDays,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Portfolio Balance', color: '#10b981', values: balanceValues },
          { name: 'Cumulative Invested', color: '#6366f1', values: investedValues },
        ],
      },
    };
  },
  table(values) {
    const dailyAmount = Number(values.dailyAmount) || 100;
    const expectedReturnPct = Number(values.expectedReturnPct) || 12;
    const years = Number(values.years) || 5;
    const daysPerYear = Number(values.daysPerYear) || 365;

    const res = calculateDailySip(dailyAmount, expectedReturnPct, years, daysPerYear);

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'yearlyInvested', label: 'Deposited in Year', format: 'currency' },
        { key: 'totalInvested', label: 'Total Invested', format: 'currency' },
        { key: 'yearEndBalance', label: 'Year-End Balance', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
