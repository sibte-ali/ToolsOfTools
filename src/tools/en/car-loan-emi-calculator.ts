import type { ToolConfig } from '../../lib/engine/types';
import { calculateAmortizationSchedule } from '../../lib/finance/emi';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export const config: ToolConfig = {
  id: 'car-loan-emi-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'carPrice',
      label: 'On-Road Car Price',
      type: 'number',
      min: 50000,
      max: 50000000,
      step: 10000,
      default: 1200000,
      unit: '₹',
      help: 'Total showroom + registration price of the vehicle',
    },
    {
      key: 'downPayment',
      label: 'Down Payment Paid',
      type: 'number',
      min: 0,
      max: 50000000,
      step: 10000,
      default: 200000,
      unit: '₹',
      help: 'Upfront cash down payment',
    },
    {
      key: 'rate',
      label: 'Car Loan Interest Rate (% p.a.)',
      type: 'number',
      min: 5,
      max: 25,
      step: 0.1,
      default: 8.8,
      unit: '%',
    },
    {
      key: 'tenureYears',
      label: 'Loan Tenure (Years)',
      type: 'number',
      min: 1,
      max: 8,
      step: 1,
      default: 5,
      unit: 'years',
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
      key: 'loanAmount',
      label: 'Net Loan Financed',
      format: 'currency',
    },
    {
      key: 'totalInterest',
      label: 'Total Interest Payable',
      format: 'currency',
    },
    {
      key: 'totalCarCost',
      label: 'Total Car Cost (Price + Interest)',
      format: 'currency',
    },
  ],
  compute(values) {
    const carPrice = Number(values.carPrice) || 1200000;
    const downPayment = Number(values.downPayment) || 0;
    const loanAmount = Math.max(0, carPrice - downPayment);
    const rate = Number(values.rate) || 8.8;
    const tenureYears = Number(values.tenureYears) || 5;

    const schedule = calculateAmortizationSchedule(loanAmount, rate, tenureYears);
    const totalCarCost = roundHalfAwayFromZero(downPayment + schedule.totalPayment, 2);

    return {
      monthlyEmi: schedule.monthlyEmi,
      loanAmount,
      totalInterest: schedule.totalInterest,
      totalCarCost,
      chartData: {
        type: 'stacked',
        labels: ['Car Cost Breakdown'],
        series: [
          { name: 'Down Payment', color: '#10b981', values: [downPayment] },
          { name: 'Principal Loan', color: '#3b82f6', values: [loanAmount] },
          { name: 'Interest', color: '#ef4444', values: [schedule.totalInterest] },
        ],
      },
    };
  },
  table(values) {
    const carPrice = Number(values.carPrice) || 1200000;
    const downPayment = Number(values.downPayment) || 0;
    const loanAmount = Math.max(0, carPrice - downPayment);
    const rate = Number(values.rate) || 8.8;
    const tenureYears = Number(values.tenureYears) || 5;

    const schedule = calculateAmortizationSchedule(loanAmount, rate, tenureYears);

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Opening Loan Balance', format: 'currency' },
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
