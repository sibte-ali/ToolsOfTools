import type { ToolConfig } from '../../lib/engine/types';
import { calculateAmortizationSchedule, compareReducingVsFlat } from '../../lib/finance/emi';

export const config: ToolConfig = {
  id: 'reducing-emi-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'principal',
      label: 'Loan Principal Amount',
      type: 'number',
      min: 10000,
      max: 100000000,
      step: 10000,
      default: 500000,
      unit: '₹',
    },
    {
      key: 'rate',
      label: 'Quoted Interest Rate (% p.a.)',
      type: 'number',
      min: 1,
      max: 50,
      step: 0.1,
      default: 12,
      unit: '%',
      help: 'The interest rate quoted in the loan agreement',
    },
    {
      key: 'tenureYears',
      label: 'Loan Tenure (Years)',
      type: 'number',
      min: 1,
      max: 30,
      step: 1,
      default: 3,
      unit: 'years',
    },
  ],
  outputs: [
    {
      key: 'reducingMonthlyEmi',
      label: 'Reducing Balance EMI (Fair)',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'effectiveReducingRate',
      label: 'Effective Reducing Rate (If Quoted Flat)',
      format: 'percent',
      highlight: true,
    },
    {
      key: 'flatMonthlyEmi',
      label: 'Flat Rate Monthly EMI',
      format: 'currency',
    },
    {
      key: 'interestDifference',
      label: 'Extra Interest Under Flat Rate',
      format: 'currency',
    },
  ],
  compute(values) {
    const principal = Number(values.principal) || 500000;
    const rate = Number(values.rate) || 12;
    const tenureYears = Number(values.tenureYears) || 3;

    const comp = compareReducingVsFlat(principal, rate, tenureYears);
    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears);

    return {
      reducingMonthlyEmi: schedule.monthlyEmi,
      effectiveReducingRate: comp.effectiveReducingRate,
      flatMonthlyEmi: comp.flatMonthlyEmi,
      interestDifference: comp.interestDifference,
      chartData: {
        type: 'stacked',
        labels: ['Reducing vs Flat Total Interest'],
        series: [
          { name: 'Reducing Balance Interest', color: '#10b981', values: [comp.reducingTotalInterest] },
          { name: 'Extra Flat Rate Penalty', color: '#ef4444', values: [comp.interestDifference] },
        ],
      },
    };
  },
  table(values) {
    const principal = Number(values.principal) || 500000;
    const rate = Number(values.rate) || 12;
    const tenureYears = Number(values.tenureYears) || 3;

    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears);

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Opening Balance', format: 'currency' },
        { key: 'principalPaid', label: 'Principal Paid', format: 'currency' },
        { key: 'interestPaid', label: 'Interest Paid', format: 'currency' },
        { key: 'totalPayment', label: 'Total Payment', format: 'currency' },
        { key: 'closingBalance', label: 'Closing Balance', format: 'currency' },
      ],
      rows: schedule.yearlyRows,
    };
  },
  chart: 'stacked',
};

export default config;
