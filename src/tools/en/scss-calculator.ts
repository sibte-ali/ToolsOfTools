import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import ratesData from '../../data/rates.json';

export function calculateScss(params: {
  deposit: number;
  ratePct?: number;
  tenureYears?: number;
}) {
  const deposit = Math.min(ratesData.scss.max_deposit, Math.max(1000, params.deposit));
  const ratePct = params.ratePct ?? ratesData.scss.rate;
  const tenureYears = params.tenureYears || 5;

  const annualInterest = roundHalfAwayFromZero((deposit * ratePct) / 100, 2);
  const quarterlyPayout = roundHalfAwayFromZero(annualInterest / 4, 2);
  const monthlyEquivalent = roundHalfAwayFromZero(annualInterest / 12, 2);
  const totalQuarters = tenureYears * 4;
  const totalInterest = roundHalfAwayFromZero(quarterlyPayout * totalQuarters, 2);
  const totalMaturityWithPrincipal = roundHalfAwayFromZero(deposit + totalInterest, 2);

  const yearlyRows = [];
  for (let yr = 1; yr <= tenureYears; yr++) {
    yearlyRows.push({
      year: yr,
      depositAmount: deposit,
      quarterlyPayout,
      annualInterestReceived: roundHalfAwayFromZero(quarterlyPayout * 4, 2),
      cumulativeInterest: roundHalfAwayFromZero(quarterlyPayout * 4 * yr, 2),
    });
  }

  return {
    deposit,
    ratePct,
    tenureYears,
    quarterlyPayout,
    monthlyEquivalent,
    totalInterest,
    totalMaturityWithPrincipal,
    yearlyRows,
  };
}

export const config: ToolConfig = {
  id: 'scss-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'deposit',
      label: 'Deposit Amount (Max ₹30,00,000)',
      type: 'number',
      min: 1000,
      max: ratesData.scss.max_deposit,
      step: 1000,
      default: 1500000,
      unit: '₹',
      help: `Statutory ceiling limit under Indian Post Office Rules: ₹${ratesData.scss.max_deposit.toLocaleString('en-IN')}`,
    },
    {
      key: 'ratePct',
      label: 'Interest Rate (% p.a.)',
      type: 'number',
      min: 6,
      max: 12,
      step: 0.1,
      default: ratesData.scss.rate,
      unit: '%',
      help: `Government notified rate (currently ${ratesData.scss.rate}% p.a., verified ${ratesData.scss.last_verified})`,
    },
    {
      key: 'tenureYears',
      label: 'Tenure Duration',
      type: 'select',
      default: '5',
      options: [
        { label: '5 Years (Standard Initial Term)', value: '5' },
        { label: '8 Years (With 3-Year Extension Block)', value: '8' },
      ],
      help: 'SCSS matures after 5 years, extendable once by 3 years upon application',
    },
  ],
  outputs: [
    {
      key: 'quarterlyPayout',
      label: 'Quarterly Interest Payout',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'monthlyEquivalent',
      label: 'Monthly Equivalent Payout',
      format: 'currency',
    },
    {
      key: 'totalInterest',
      label: 'Total Cumulative Interest',
      format: 'currency',
    },
    {
      key: 'totalMaturityWithPrincipal',
      label: 'Total Returned (Deposit + Interest)',
      format: 'currency',
    },
  ],
  compute(values) {
    const deposit = Number(values.deposit) || 1500000;
    const ratePct = Number(values.ratePct) || ratesData.scss.rate;
    const tenureYears = Number(values.tenureYears) || 5;

    const res = calculateScss({ deposit, ratePct, tenureYears });

    return {
      quarterlyPayout: res.quarterlyPayout,
      monthlyEquivalent: res.monthlyEquivalent,
      totalInterest: res.totalInterest,
      totalMaturityWithPrincipal: res.totalMaturityWithPrincipal,
      chartData: {
        type: 'stacked',
        labels: ['Capital vs Return'],
        series: [
          { name: 'Original Principal Returned', color: '#3b82f6', values: [res.deposit] },
          { name: 'Cumulative Interest Paid Out', color: '#10b981', values: [res.totalInterest] },
        ],
      },
    };
  },
  table(values) {
    const deposit = Number(values.deposit) || 1500000;
    const ratePct = Number(values.ratePct) || ratesData.scss.rate;
    const tenureYears = Number(values.tenureYears) || 5;

    const res = calculateScss({ deposit, ratePct, tenureYears });

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'depositAmount', label: 'Invested Principal', format: 'currency' },
        { key: 'quarterlyPayout', label: 'Quarterly Payout', format: 'currency' },
        { key: 'annualInterestReceived', label: 'Annual Total', format: 'currency' },
        { key: 'cumulativeInterest', label: 'Cumulative Interest', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'stacked',
};

export default config;
