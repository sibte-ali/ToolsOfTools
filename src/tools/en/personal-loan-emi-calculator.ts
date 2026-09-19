import type { ToolConfig } from '../../lib/engine/types';
import { calculateAmortizationSchedule } from '../../lib/finance/emi';

export const config: ToolConfig = {
  id: 'personal-loan-emi-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'principal',
      label: 'Personal Loan Amount',
      type: 'number',
      min: 10000,
      max: 10000000,
      step: 10000,
      default: 500000,
      unit: '₹',
      help: 'Principal loan amount borrowed for personal expenses',
    },
    {
      key: 'rate',
      label: 'Interest Rate (% p.a.)',
      type: 'number',
      min: 8,
      max: 36,
      step: 0.1,
      default: 13.5,
      unit: '%',
      help: 'Annual interest rate offered by the lender',
    },
    {
      key: 'tenureType',
      label: 'Tenure Unit',
      type: 'select',
      default: 'years',
      options: [
        { label: 'Years', value: 'years' },
        { label: 'Months', value: 'months' },
      ],
    },
    {
      key: 'tenureValue',
      label: 'Tenure Duration',
      type: 'number',
      min: 1,
      max: 84,
      step: 1,
      default: 3,
      unit: 'period',
      help: 'Total repayment duration in years or months',
    },
    {
      key: 'processingFeePct',
      label: 'Processing Fee (% optional)',
      type: 'number',
      min: 0,
      max: 5,
      step: 0.25,
      default: 1.5,
      unit: '%',
      help: 'Upfront administrative fee charged by the bank + GST',
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
      key: 'totalInterest',
      label: 'Total Interest Charged',
      format: 'currency',
    },
    {
      key: 'processingFeeAmount',
      label: 'Upfront Processing Fee',
      format: 'currency',
    },
    {
      key: 'totalCostWithFees',
      label: 'Total Out-of-Pocket Cost',
      format: 'currency',
    },
  ],
  compute(values) {
    const principal = Number(values.principal) || 500000;
    const rate = Number(values.rate) || 13.5;
    const tenureType = values.tenureType === 'months' ? 'months' : 'years';
    const tenureVal = Number(values.tenureValue) || (tenureType === 'months' ? 36 : 3);
    const processingFeePct = Number(values.processingFeePct) || 0;

    const tenureYears = tenureType === 'years' ? tenureVal : 0;
    const tenureMonths = tenureType === 'months' ? tenureVal : 0;

    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears, {
      tenureMonths,
      processingFeePct,
    });

    return {
      monthlyEmi: schedule.monthlyEmi,
      totalInterest: schedule.totalInterest,
      processingFeeAmount: schedule.processingFeeAmount,
      totalCostWithFees: schedule.totalCostWithFees,
      chartData: {
        type: 'stacked',
        labels: ['Loan Breakdown'],
        series: [
          { name: 'Principal', color: '#0ea5e9', values: [principal] },
          { name: 'Interest', color: '#ef4444', values: [schedule.totalInterest] },
          ...(schedule.processingFeeAmount > 0
            ? [{ name: 'Fees', color: '#f59e0b', values: [schedule.processingFeeAmount] }]
            : []),
        ],
      },
    };
  },
  table(values) {
    const principal = Number(values.principal) || 500000;
    const rate = Number(values.rate) || 13.5;
    const tenureType = values.tenureType === 'months' ? 'months' : 'years';
    const tenureVal = Number(values.tenureValue) || (tenureType === 'months' ? 36 : 3);
    const processingFeePct = Number(values.processingFeePct) || 0;

    const tenureYears = tenureType === 'years' ? tenureVal : 0;
    const tenureMonths = tenureType === 'months' ? tenureVal : 0;

    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears, {
      tenureMonths,
      processingFeePct,
    });

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Opening Balance', format: 'currency' },
        { key: 'principalPaid', label: 'Principal Paid', format: 'currency' },
        { key: 'interestPaid', label: 'Interest Paid', format: 'currency' },
        { key: 'totalPayment', label: 'Total Paid in Year', format: 'currency' },
        { key: 'closingBalance', label: 'Closing Balance', format: 'currency' },
      ],
      rows: schedule.yearlyRows,
    };
  },
  chart: 'stacked',
};

export default config;
