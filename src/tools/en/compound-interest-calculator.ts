import type { ToolConfig } from '../../lib/engine/types';
import { calculateCompoundInterest } from '../../lib/finance/compound';

export const config: ToolConfig = {
  id: 'compound-interest-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'principal',
      label: 'Initial Principal Investment',
      type: 'number',
      min: 0,
      max: 1000000000,
      step: 100,
      default: 10000,
      unit: '$',
    },
    {
      key: 'ratePct',
      label: 'Annual Interest Rate (% p.a.)',
      type: 'number',
      min: 0.1,
      max: 50,
      step: 0.1,
      default: 7.5,
      unit: '%',
    },
    {
      key: 'years',
      label: 'Investment Horizon (Years)',
      type: 'number',
      min: 1,
      max: 50,
      step: 1,
      default: 10,
      unit: 'years',
    },
    {
      key: 'frequency',
      label: 'Compounding Frequency',
      type: 'select',
      default: 'annual',
      options: [
        { label: 'Annually (1/yr)', value: 'annual' },
        { label: 'Semi-Annually (2/yr)', value: 'semi-annual' },
        { label: 'Quarterly (4/yr)', value: 'quarterly' },
        { label: 'Monthly (12/yr)', value: 'monthly' },
        { label: 'Daily (365/yr)', value: 'daily' },
      ],
    },
    {
      key: 'monthlyContribution',
      label: 'Additional Monthly Contribution ($ optional)',
      type: 'number',
      min: 0,
      max: 1000000,
      step: 50,
      default: 200,
      unit: '$',
      help: 'Regular ongoing monthly additions to accelerate wealth',
    },
  ],
  outputs: [
    {
      key: 'futureValue',
      label: 'Total Accumulated Value',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalDeposits',
      label: 'Total Principal Invested',
      format: 'currency',
    },
    {
      key: 'totalInterestEarned',
      label: 'Total Compound Interest',
      format: 'currency',
    },
  ],
  compute(values) {
    const principal = Number(values.principal) || 10000;
    const ratePct = Number(values.ratePct) || 7.5;
    const years = Number(values.years) || 10;
    const frequency = String(values.frequency || 'annual');
    const monthlyContribution = Number(values.monthlyContribution) || 0;

    const res = calculateCompoundInterest(
      principal,
      ratePct,
      years,
      frequency,
      monthlyContribution
    );

    const labels = res.yearlyRows.map((r) => `Yr ${r.year}`);
    const balanceSeries = res.yearlyRows.map((r) => r.closingBalance);
    const contributionsCumulative: number[] = [];
    let sumContrib = principal;
    for (const r of res.yearlyRows) {
      sumContrib += r.contributions;
      contributionsCumulative.push(sumContrib);
    }

    return {
      futureValue: res.futureValue,
      totalDeposits: principal + res.totalContributions,
      totalInterestEarned: res.totalInterestEarned,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Total Wealth Balance', color: '#10b981', values: balanceSeries },
          { name: 'Principal Deposited', color: '#3b82f6', values: contributionsCumulative },
        ],
      },
    };
  },
  table(values) {
    const principal = Number(values.principal) || 10000;
    const ratePct = Number(values.ratePct) || 7.5;
    const years = Number(values.years) || 10;
    const frequency = String(values.frequency || 'annual');
    const monthlyContribution = Number(values.monthlyContribution) || 0;

    const res = calculateCompoundInterest(
      principal,
      ratePct,
      years,
      frequency,
      monthlyContribution
    );

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Starting Balance', format: 'currency' },
        { key: 'contributions', label: 'Annual Contributions', format: 'currency' },
        { key: 'interestEarned', label: 'Interest Earned', format: 'currency' },
        { key: 'closingBalance', label: 'Ending Balance', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
