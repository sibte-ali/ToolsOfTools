import type { ToolConfig } from '../../lib/engine/types';
import { calculateAmortizationSchedule } from '../../lib/finance/emi';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export function calculateMortgage(params: {
  homePrice: number;
  downPaymentValue: number;
  downPaymentMode: 'dollar' | 'percent';
  ratePct: number;
  termYears: number;
  propertyTaxAnnualRatePct?: number;
  homeInsuranceAnnual?: number;
  hoaMonthly?: number;
  pmiRatePct?: number;
}) {
  const {
    homePrice,
    downPaymentValue,
    downPaymentMode,
    ratePct,
    termYears,
    propertyTaxAnnualRatePct = 1.2,
    homeInsuranceAnnual = 1200,
    hoaMonthly = 0,
    pmiRatePct = 0.5,
  } = params;

  let downPayment = downPaymentValue;
  if (downPaymentMode === 'percent') {
    downPayment = (homePrice * downPaymentValue) / 100;
  }
  downPayment = Math.min(homePrice, Math.max(0, downPayment));
  const loanAmount = Math.max(0, homePrice - downPayment);
  const ltv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;

  const schedule = calculateAmortizationSchedule(loanAmount, ratePct, termYears);
  const monthlyPi = schedule.monthlyEmi;

  const monthlyPropertyTax = roundHalfAwayFromZero(
    (homePrice * (propertyTaxAnnualRatePct / 100)) / 12,
    2
  );
  const monthlyHomeInsurance = roundHalfAwayFromZero(homeInsuranceAnnual / 12, 2);

  // PMI applies if LTV > 80% (down payment < 20%)
  const monthlyPmi =
    ltv > 80 ? roundHalfAwayFromZero((loanAmount * (pmiRatePct / 100)) / 12, 2) : 0;

  const monthlyTotalPiti = roundHalfAwayFromZero(
    monthlyPi + monthlyPropertyTax + monthlyHomeInsurance + hoaMonthly + monthlyPmi,
    2
  );

  return {
    homePrice: roundHalfAwayFromZero(homePrice, 2),
    downPayment: roundHalfAwayFromZero(downPayment, 2),
    loanAmount: roundHalfAwayFromZero(loanAmount, 2),
    monthlyPi,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    monthlyPmi,
    monthlyHoa: hoaMonthly,
    monthlyTotalPiti,
    totalInterest: schedule.totalInterest,
    schedule,
  };
}

export const config: ToolConfig = {
  id: 'mortgage-loan-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'homePrice',
      label: 'Home Purchase Price',
      type: 'number',
      min: 10000,
      max: 100000000,
      step: 5000,
      default: 400000,
      unit: '$',
    },
    {
      key: 'downPaymentMode',
      label: 'Down Payment Type',
      type: 'select',
      default: 'percent',
      options: [
        { label: 'Percentage (%)', value: 'percent' },
        { label: 'Fixed Dollar Amount ($)', value: 'dollar' },
      ],
    },
    {
      key: 'downPaymentValue',
      label: 'Down Payment Value',
      type: 'number',
      min: 0,
      max: 100000000,
      step: 1,
      default: 20,
      unit: 'val',
      help: '20% down eliminates Private Mortgage Insurance (PMI)',
    },
    {
      key: 'ratePct',
      label: 'Interest Rate (% p.a.)',
      type: 'number',
      min: 1,
      max: 20,
      step: 0.125,
      default: 6.5,
      unit: '%',
    },
    {
      key: 'termYears',
      label: 'Mortgage Loan Term',
      type: 'select',
      default: '30',
      options: [
        { label: '30 Years (Fixed)', value: '30' },
        { label: '20 Years (Fixed)', value: '20' },
        { label: '15 Years (Fixed)', value: '15' },
        { label: '10 Years (Fixed)', value: '10' },
      ],
    },
    {
      key: 'propertyTaxRate',
      label: 'Property Tax Rate (%/yr)',
      type: 'number',
      min: 0,
      max: 5,
      step: 0.05,
      default: 1.2,
      unit: '%',
      help: 'Annual local real estate property tax rate (national avg ~1.1-1.3%)',
    },
    {
      key: 'homeInsuranceAnnual',
      label: 'Homeowners Insurance ($/yr)',
      type: 'number',
      min: 0,
      max: 20000,
      step: 50,
      default: 1200,
      unit: '$',
    },
    {
      key: 'hoaMonthly',
      label: 'HOA Fees ($/mo)',
      type: 'number',
      min: 0,
      max: 5000,
      step: 10,
      default: 0,
      unit: '$',
    },
  ],
  outputs: [
    {
      key: 'monthlyTotalPiti',
      label: 'Total Monthly Payment (PITI)',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'monthlyPi',
      label: 'Principal & Interest (P&I)',
      format: 'currency',
    },
    {
      key: 'totalInterest',
      label: 'Total Lifetime Interest',
      format: 'currency',
    },
    {
      key: 'monthlyEscrow',
      label: 'Taxes, Insurance & Fees / mo',
      format: 'currency',
    },
  ],
  compute(values) {
    const res = calculateMortgage({
      homePrice: Number(values.homePrice) || 400000,
      downPaymentValue: Number(values.downPaymentValue) || 20,
      downPaymentMode: (values.downPaymentMode as any) || 'percent',
      ratePct: Number(values.ratePct) || 6.5,
      termYears: Number(values.termYears) || 30,
      propertyTaxAnnualRatePct: Number(values.propertyTaxRate) ?? 1.2,
      homeInsuranceAnnual: Number(values.homeInsuranceAnnual) ?? 1200,
      hoaMonthly: Number(values.hoaMonthly) || 0,
    });

    const monthlyEscrow = roundHalfAwayFromZero(
      res.monthlyPropertyTax + res.monthlyHomeInsurance + res.monthlyPmi + res.monthlyHoa,
      2
    );

    return {
      monthlyTotalPiti: res.monthlyTotalPiti,
      monthlyPi: res.monthlyPi,
      totalInterest: res.totalInterest,
      monthlyEscrow,
      chartData: {
        type: 'stacked',
        labels: ['Monthly PITI Breakdown'],
        series: [
          { name: 'Principal & Interest', color: '#0ea5e9', values: [res.monthlyPi] },
          { name: 'Property Tax', color: '#f59e0b', values: [res.monthlyPropertyTax] },
          { name: 'Home Insurance', color: '#10b981', values: [res.monthlyHomeInsurance] },
          ...(res.monthlyPmi > 0
            ? [{ name: 'PMI Insurance', color: '#ef4444', values: [res.monthlyPmi] }]
            : []),
          ...(res.monthlyHoa > 0
            ? [{ name: 'HOA Dues', color: '#8b5cf6', values: [res.monthlyHoa] }]
            : []),
        ],
      },
    };
  },
  table(values) {
    const res = calculateMortgage({
      homePrice: Number(values.homePrice) || 400000,
      downPaymentValue: Number(values.downPaymentValue) || 20,
      downPaymentMode: (values.downPaymentMode as any) || 'percent',
      ratePct: Number(values.ratePct) || 6.5,
      termYears: Number(values.termYears) || 30,
      propertyTaxAnnualRatePct: Number(values.propertyTaxRate) ?? 1.2,
      homeInsuranceAnnual: Number(values.homeInsuranceAnnual) ?? 1200,
      hoaMonthly: Number(values.hoaMonthly) || 0,
    });

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Beginning Loan Balance', format: 'currency' },
        { key: 'principalPaid', label: 'Principal Paid', format: 'currency' },
        { key: 'interestPaid', label: 'Interest Paid', format: 'currency' },
        { key: 'totalPayment', label: 'Total P&I Paid in Year', format: 'currency' },
        { key: 'closingBalance', label: 'Ending Balance', format: 'currency' },
      ],
      rows: res.schedule.yearlyRows,
    };
  },
  chart: 'stacked',
};

export default config;
