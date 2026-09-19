import type { ToolConfig } from '../lib/engine/types';
import { calculateAmortizationSchedule } from '../lib/engine/math';

export const config: ToolConfig = {
  id: 'emi-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'principal',
      label: 'Loan Amount',
      type: 'number',
      min: 1000,
      max: 100000000,
      step: 1000,
      default: 1000000,
      unit: '$',
      help: 'Total principal loan amount to borrow',
    },
    {
      key: 'rate',
      label: 'Interest Rate (% p.a.)',
      type: 'number',
      min: 0.1,
      max: 50,
      step: 0.1,
      default: 10,
      unit: '%',
      help: 'Annual interest rate on a reducing balance',
    },
    {
      key: 'tenure',
      label: 'Loan Tenure (Years)',
      type: 'number',
      min: 1,
      max: 40,
      step: 1,
      default: 20,
      unit: 'years',
      help: 'Duration of the loan in years',
    },
  ],
  outputs: [
    {
      key: 'monthlyEmi',
      label: 'Monthly EMI',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalPrincipal',
      label: 'Total Principal',
      format: 'currency',
    },
    {
      key: 'totalInterest',
      label: 'Total Interest Payable',
      format: 'currency',
    },
    {
      key: 'totalPayment',
      label: 'Total Amount Payable',
      format: 'currency',
    },
  ],
  compute(values) {
    const principal = Number(values.principal) || 1000000;
    const rate = Number(values.rate) || 10;
    const tenure = Number(values.tenure) || 20;

    const schedule = calculateAmortizationSchedule(principal, rate, tenure);

    const labels = schedule.yearlyRows.map((r) => `Yr ${r.year}`);
    const balanceValues = schedule.yearlyRows.map((r) => r.closingBalance);
    const interestValues = schedule.yearlyRows.map((r) => r.interestPaid);

    return {
      monthlyEmi: schedule.monthlyEmi,
      totalPrincipal: schedule.totalPrincipal,
      totalInterest: schedule.totalInterest,
      totalPayment: schedule.totalPayment,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Remaining Balance', color: '#0ea5e9', values: balanceValues },
          { name: 'Yearly Interest', color: '#ef4444', values: interestValues },
        ],
      },
    };
  },
  table(values) {
    const principal = Number(values.principal) || 1000000;
    const rate = Number(values.rate) || 10;
    const tenure = Number(values.tenure) || 20;

    const schedule = calculateAmortizationSchedule(principal, rate, tenure);
    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Opening Balance', format: 'currency' },
        { key: 'principalPaid', label: 'Principal Paid', format: 'currency' },
        { key: 'interestPaid', label: 'Interest Paid', format: 'currency' },
        { key: 'totalPayment', label: 'Total Paid', format: 'currency' },
        { key: 'closingBalance', label: 'Closing Balance', format: 'currency' },
      ],
      rows: schedule.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
