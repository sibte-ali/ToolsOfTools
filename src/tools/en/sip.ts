import type { ToolConfig } from '../../lib/engine/types';
import { calculateSip } from '../../lib/finance/sip';

export const config: ToolConfig = {
  id: 'sip',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'monthlyAmount',
      label: 'Monthly Investment Amount',
      type: 'number',
      min: 100,
      max: 5000000,
      step: 500,
      default: 5000,
      unit: '₹',
      help: 'Amount invested in mutual fund SIP on a fixed day each month',
    },
    {
      key: 'expectedReturnPct',
      label: 'Expected Return Rate (% p.a.)',
      type: 'number',
      min: 1,
      max: 35,
      step: 0.1,
      default: 12,
      unit: '%',
      help: 'Long-term annualized return expectation (historical equity funds average 12-14%)',
    },
    {
      key: 'years',
      label: 'Investment Time Period (Years)',
      type: 'number',
      min: 1,
      max: 40,
      step: 1,
      default: 10,
      unit: 'years',
    },
    {
      key: 'stepUpPct',
      label: 'Annual Step-Up (% optional)',
      type: 'number',
      min: 0,
      max: 30,
      step: 1,
      default: 0,
      unit: '%',
      help: 'Automatic yearly increase in monthly SIP contribution as income grows',
    },
  ],
  outputs: [
    {
      key: 'maturityValue',
      label: 'Expected Maturity Wealth',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalInvested',
      label: 'Total Amount Invested',
      format: 'currency',
    },
    {
      key: 'estimatedReturns',
      label: 'Estimated Wealth Gain',
      format: 'currency',
    },
  ],
  compute(values) {
    const monthlyAmount = Number(values.monthlyAmount) || 5000;
    const expectedReturnPct = Number(values.expectedReturnPct) || 12;
    const years = Number(values.years) || 10;
    const stepUpPct = Number(values.stepUpPct) || 0;

    const res = calculateSip(monthlyAmount, expectedReturnPct, years, stepUpPct);

    const labels = res.yearlyRows.map((r) => `Yr ${r.year}`);
    const balanceSeries = res.yearlyRows.map((r) => r.yearEndBalance);
    const investedSeries = res.yearlyRows.map((r) => r.totalInvested);

    return {
      maturityValue: res.maturityValue,
      totalInvested: res.totalInvested,
      estimatedReturns: res.estimatedReturns,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Total Wealth Value', color: '#10b981', values: balanceSeries },
          { name: 'Invested Capital', color: '#3b82f6', values: investedSeries },
        ],
      },
    };
  },
  table(values) {
    const monthlyAmount = Number(values.monthlyAmount) || 5000;
    const expectedReturnPct = Number(values.expectedReturnPct) || 12;
    const years = Number(values.years) || 10;
    const stepUpPct = Number(values.stepUpPct) || 0;

    const res = calculateSip(monthlyAmount, expectedReturnPct, years, stepUpPct);

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'monthlyInvestment', label: 'Monthly SIP', format: 'currency' },
        { key: 'yearlyInvested', label: 'Invested in Year', format: 'currency' },
        { key: 'totalInvested', label: 'Total Invested', format: 'currency' },
        { key: 'yearEndBalance', label: 'Year-End Value', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
