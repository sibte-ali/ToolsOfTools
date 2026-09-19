import type { ToolConfig } from '../../lib/engine/types';
import { calculateAmortizationSchedule } from '../../lib/finance/emi';

export const config: ToolConfig = {
  id: 'emi-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'principal',
      label: 'Loan Amount',
      type: 'number',
      min: 1000,
      max: 1000000000,
      step: 5000,
      default: 1000000,
      unit: '₹',
      help: 'Total principal loan borrowed',
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
      help: 'Annual interest rate on reducing balance',
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
      key: 'tenure',
      label: 'Tenure Duration',
      type: 'number',
      min: 1,
      max: 360,
      step: 1,
      default: 20,
      unit: 'period',
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
      label: 'Principal Loan Amount',
      format: 'currency',
    },
    {
      key: 'totalInterest',
      label: 'Total Interest Payable',
      format: 'currency',
    },
    {
      key: 'totalPayment',
      label: 'Total Amount Payable (Principal + Interest)',
      format: 'currency',
    },
  ],
  compute(values) {
    const principal = Number(values.principal) || 1000000;
    const rate = Number(values.rate) || 10;
    const tenureType = values.tenureType === 'months' ? 'months' : 'years';
    const tenureVal = Number(values.tenure) || (tenureType === 'months' ? 240 : 20);

    const tenureYears = tenureType === 'years' ? tenureVal : 0;
    const tenureMonths = tenureType === 'months' ? tenureVal : 0;

    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears, {
      tenureMonths,
    });

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
          { name: 'Interest Paid', color: '#ef4444', values: interestValues },
        ],
      },
    };
  },
  table(values) {
    const principal = Number(values.principal) || 1000000;
    const rate = Number(values.rate) || 10;
    const tenureType = values.tenureType === 'months' ? 'months' : 'years';
    const tenureVal = Number(values.tenure) || (tenureType === 'months' ? 240 : 20);

    const tenureYears = tenureType === 'years' ? tenureVal : 0;
    const tenureMonths = tenureType === 'months' ? tenureVal : 0;

    const schedule = calculateAmortizationSchedule(principal, rate, tenureYears, {
      tenureMonths,
    });

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
