import type { ToolConfig } from '../../lib/engine/types';
import { calculateSwp } from '../../lib/finance/swp';

export const config: ToolConfig = {
  id: 'swp-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'totalInvestment',
      label: 'Total Investment',
      type: 'number',
      min: 10000,
      max: 1000000000,
      step: 10000,
      default: 1000000,
      unit: '₹',
      help: 'Initial corpus invested in mutual fund or scheme',
    },
    {
      key: 'monthlyWithdrawal',
      label: 'Monthly Withdrawal',
      type: 'number',
      min: 500,
      max: 5000000,
      step: 500,
      default: 8000,
      unit: '₹',
      help: 'Amount withdrawn at the end of each month',
    },
    {
      key: 'expectedReturnPct',
      label: 'Expected Return (% p.a.)',
      type: 'number',
      min: 1,
      max: 30,
      step: 0.1,
      default: 10,
      unit: '%',
      help: 'Annualized expected rate of return on remaining corpus',
    },
    {
      key: 'years',
      label: 'Time Period (Years)',
      type: 'number',
      min: 1,
      max: 40,
      step: 1,
      default: 10,
      unit: 'years',
      help: 'Duration for systematic withdrawals',
    },
    {
      key: 'stepUpPct',
      label: 'Annual Step-Up (% optional)',
      type: 'number',
      min: 0,
      max: 25,
      step: 1,
      default: 0,
      unit: '%',
      help: 'Annual percentage increase in monthly withdrawal to counter inflation',
    },
  ],
  outputs: [
    {
      key: 'finalBalance',
      label: 'Final Remaining Balance',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalWithdrawn',
      label: 'Total Withdrawn',
      format: 'currency',
    },
    {
      key: 'totalInterestEarned',
      label: 'Total Growth Earned',
      format: 'currency',
    },
    {
      key: 'depletionStatus',
      label: 'Corpus Sustainability',
      format: 'text',
    },
  ],
  compute(values) {
    const totalInvestment = Number(values.totalInvestment) || 1000000;
    const monthlyWithdrawal = Number(values.monthlyWithdrawal) || 8000;
    const expectedReturnPct = Number(values.expectedReturnPct) || 10;
    const years = Number(values.years) || 10;
    const stepUpPct = Number(values.stepUpPct) || 0;

    const res = calculateSwp(
      totalInvestment,
      monthlyWithdrawal,
      expectedReturnPct,
      years,
      stepUpPct
    );

    const depletionStatus = res.isDepleted
      ? `Depleted in Year ${res.depletionYear}, Month ${res.depletionMonth}`
      : 'Corpus remains solvent';

    const labels = res.yearlyRows.map((r) => `Yr ${r.year}`);
    const balanceSeries = res.yearlyRows.map((r) => r.closingBalance);
    const withdrawnSeries = res.yearlyRows.map((r) => r.totalWithdrawnYear);

    return {
      finalBalance: res.finalBalance,
      totalWithdrawn: res.totalWithdrawn,
      totalInterestEarned: res.totalInterestEarned,
      depletionStatus,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Remaining Balance', color: '#10b981', values: balanceSeries },
          { name: 'Withdrawn (Yearly)', color: '#3b82f6', values: withdrawnSeries },
        ],
      },
    };
  },
  table(values) {
    const totalInvestment = Number(values.totalInvestment) || 1000000;
    const monthlyWithdrawal = Number(values.monthlyWithdrawal) || 8000;
    const expectedReturnPct = Number(values.expectedReturnPct) || 10;
    const years = Number(values.years) || 10;
    const stepUpPct = Number(values.stepUpPct) || 0;

    const res = calculateSwp(
      totalInvestment,
      monthlyWithdrawal,
      expectedReturnPct,
      years,
      stepUpPct
    );

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Opening Balance', format: 'currency' },
        { key: 'monthlyWithdrawal', label: 'Monthly Withdrawal', format: 'currency' },
        { key: 'totalWithdrawnYear', label: 'Withdrawn in Year', format: 'currency' },
        { key: 'interestEarnedYear', label: 'Interest in Year', format: 'currency' },
        { key: 'closingBalance', label: 'Closing Balance', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
