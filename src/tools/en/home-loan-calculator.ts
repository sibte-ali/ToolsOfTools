import type { ToolConfig } from '../../lib/engine/types';
import { calculateAmortizationSchedule } from '../../lib/finance/emi';

export const config: ToolConfig = {
  id: 'home-loan-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'principal',
      label: 'Home Loan Amount',
      type: 'number',
      min: 100000,
      max: 500000000,
      step: 50000,
      default: 4000000,
      unit: '₹',
      help: 'Total housing loan amount sanction',
    },
    {
      key: 'rate',
      label: 'Interest Rate (% p.a.)',
      type: 'number',
      min: 5,
      max: 20,
      step: 0.05,
      default: 8.5,
      unit: '%',
      help: 'Floating or fixed home loan interest rate',
    },
    {
      key: 'tenureYears',
      label: 'Loan Tenure (Years)',
      type: 'number',
      min: 1,
      max: 35,
      step: 1,
      default: 20,
      unit: 'years',
    },
    {
      key: 'monthlyPrepayment',
      label: 'Extra Monthly Prepayment (₹ optional)',
      type: 'number',
      min: 0,
      max: 1000000,
      step: 1000,
      default: 5000,
      unit: '₹',
      help: 'Extra principal amount repaid every month alongside EMI',
    },
    {
      key: 'yearlyPrepayment',
      label: 'Annual Lump-Sum Prepayment (₹ optional)',
      type: 'number',
      min: 0,
      max: 10000000,
      step: 5000,
      default: 0,
      unit: '₹',
      help: 'Lump-sum principal payment made once every year (e.g., from annual bonus)',
    },
  ],
  outputs: [
    {
      key: 'monthlyEmi',
      label: 'Monthly EMI (Base)',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'monthsSaved',
      label: 'Tenure Saved by Prepayments',
      format: 'text',
      highlight: true,
    },
    {
      key: 'totalInterest',
      label: 'Total Interest Payable',
      format: 'currency',
    },
    {
      key: 'interestSaved',
      label: 'Total Interest Saved',
      format: 'currency',
    },
  ],
  compute(values) {
    const principal = Number(values.principal) || 4000000;
    const rate = Number(values.rate) || 8.5;
    const tenureYears = Number(values.tenureYears) || 20;
    const monthlyPrepayment = Number(values.monthlyPrepayment) || 0;
    const yearlyPrepayment = Number(values.yearlyPrepayment) || 0;

    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears, {
      monthlyPrepayment,
      yearlyPrepayment,
    });

    const yearsSaved = Math.floor(schedule.monthsSaved / 12);
    const remMonths = schedule.monthsSaved % 12;
    const savedText =
      schedule.monthsSaved > 0
        ? `${yearsSaved > 0 ? `${yearsSaved} yrs ` : ''}${remMonths} mos (${schedule.monthsSaved} months early)`
        : '0 months';

    return {
      monthlyEmi: schedule.monthlyEmi,
      monthsSaved: savedText,
      totalInterest: schedule.totalInterest,
      interestSaved: schedule.interestSaved,
      chartData: {
        type: 'stacked',
        labels: ['Repayment Breakdown'],
        series: [
          { name: 'Principal Repaid', color: '#0ea5e9', values: [schedule.totalPrincipal] },
          { name: 'Interest Paid', color: '#ef4444', values: [schedule.totalInterest] },
          ...(schedule.interestSaved > 0
            ? [{ name: 'Interest Saved', color: '#10b981', values: [schedule.interestSaved] }]
            : []),
        ],
      },
    };
  },
  table(values) {
    const principal = Number(values.principal) || 4000000;
    const rate = Number(values.rate) || 8.5;
    const tenureYears = Number(values.tenureYears) || 20;
    const monthlyPrepayment = Number(values.monthlyPrepayment) || 0;
    const yearlyPrepayment = Number(values.yearlyPrepayment) || 0;

    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears, {
      monthlyPrepayment,
      yearlyPrepayment,
    });

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Opening Balance', format: 'currency' },
        { key: 'principalPaid', label: 'Principal Paid', format: 'currency' },
        { key: 'interestPaid', label: 'Interest Paid', format: 'currency' },
        { key: 'prepayment', label: 'Prepayments', format: 'currency' },
        { key: 'closingBalance', label: 'Closing Balance', format: 'currency' },
      ],
      rows: schedule.yearlyRows,
    };
  },
  chart: 'stacked',
};

export default config;
