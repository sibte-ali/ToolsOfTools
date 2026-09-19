import type { ToolConfig } from '../../lib/engine/types';
import { calculateLumpSum } from '../../lib/finance/compound';

export const config: ToolConfig = {
  id: 'lump-sum-amount',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'principal',
      label: 'Lump-Sum Investment Amount',
      type: 'number',
      min: 1000,
      max: 1000000000,
      step: 5000,
      default: 500000,
      unit: '₹',
      help: 'One-time initial capital committed to investment',
    },
    {
      key: 'returnPct',
      label: 'Expected Return Rate (% p.a.)',
      type: 'number',
      min: 1,
      max: 40,
      step: 0.1,
      default: 12,
      unit: '%',
      help: 'Annualized expected rate of capital growth',
    },
    {
      key: 'years',
      label: 'Investment Time Horizon (Years)',
      type: 'number',
      min: 1,
      max: 40,
      step: 1,
      default: 10,
      unit: 'years',
    },
    {
      key: 'compounding',
      label: 'Compounding Frequency',
      type: 'select',
      default: 'annual',
      options: [
        { label: 'Annually (Default)', value: 'annual' },
        { label: 'Semi-Annually', value: 'semi-annual' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Monthly', value: 'monthly' },
      ],
    },
    {
      key: 'inflationPct',
      label: 'Expected Inflation Rate (% optional)',
      type: 'number',
      min: 0,
      max: 20,
      step: 0.5,
      default: 6,
      unit: '%',
      help: 'Discount rate to estimate future real purchasing power',
    },
  ],
  outputs: [
    {
      key: 'futureValue',
      label: 'Estimated Nominal Maturity Value',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'realPurchasingPower',
      label: 'Real Purchasing Power (Inflation-Adjusted)',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalGain',
      label: 'Total Nominal Wealth Gain',
      format: 'currency',
    },
    {
      key: 'inflationLoss',
      label: 'Purchasing Power Lost to Inflation',
      format: 'currency',
    },
  ],
  compute(values) {
    const principal = Number(values.principal) || 500000;
    const returnPct = Number(values.returnPct) || 12;
    const years = Number(values.years) || 10;
    const compounding = String(values.compounding || 'annual');
    const inflationPct = Number(values.inflationPct) || 0;

    const res = calculateLumpSum(principal, returnPct, years, compounding, inflationPct);

    const labels = res.yearlyRows.map((r) => `Yr ${r.year}`);
    const nominalSeries = res.yearlyRows.map((r) => r.nominalValue);
    const realSeries = res.yearlyRows.map((r) => r.realValue);

    return {
      futureValue: res.futureValue,
      realPurchasingPower: res.realPurchasingPower,
      totalGain: res.totalGain,
      inflationLoss: res.inflationLoss,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Nominal Portfolio Value', color: '#10b981', values: nominalSeries },
          { name: 'Real Inflation-Adjusted Value', color: '#6366f1', values: realSeries },
        ],
      },
    };
  },
  table(values) {
    const principal = Number(values.principal) || 500000;
    const returnPct = Number(values.returnPct) || 12;
    const years = Number(values.years) || 10;
    const compounding = String(values.compounding || 'annual');
    const inflationPct = Number(values.inflationPct) || 0;

    const res = calculateLumpSum(principal, returnPct, years, compounding, inflationPct);

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'nominalValue', label: 'Nominal Value (₹)', format: 'currency' },
        { key: 'realValue', label: 'Real Purchasing Power (₹)', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
