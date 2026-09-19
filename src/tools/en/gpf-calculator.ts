import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import ratesData from '../../data/rates.json';

export function calculateGpf(params: {
  monthlySubscription: number;
  openingBalance?: number;
  ratePct?: number;
  years: number;
  yearlyIncreasePct?: number;
}) {
  const {
    monthlySubscription,
    openingBalance = 0,
    ratePct = ratesData.gpf.rate,
    years,
    yearlyIncreasePct = 0,
  } = params;

  let balance = openingBalance;
  let currentMonthly = monthlySubscription;
  let totalDeposited = openingBalance;
  let totalInterestEarned = 0;

  const yearlyRows: {
    year: number;
    openingBalance: number;
    monthlyDeposit: number;
    yearlyDeposit: number;
    interestEarned: number;
    closingBalance: number;
  }[] = [];

  for (let yr = 1; yr <= years; yr++) {
    const yrOpening = balance;
    let yrDeposit = 0;
    let sumMonthlyBalances = 0;

    for (let m = 1; m <= 12; m++) {
      balance += currentMonthly;
      yrDeposit += currentMonthly;
      totalDeposited += currentMonthly;
      sumMonthlyBalances += balance;
    }

    // GPF interest credited at end of year based on monthly progressive balance sum
    const yrInterest = roundHalfAwayFromZero(
      (sumMonthlyBalances * (ratePct / 100)) / 12,
      2
    );
    balance = roundHalfAwayFromZero(balance + yrInterest, 2);
    totalInterestEarned += yrInterest;

    yearlyRows.push({
      year: yr,
      openingBalance: roundHalfAwayFromZero(yrOpening, 2),
      monthlyDeposit: roundHalfAwayFromZero(currentMonthly, 2),
      yearlyDeposit: roundHalfAwayFromZero(yrDeposit, 2),
      interestEarned: yrInterest,
      closingBalance: balance,
    });

    if (yearlyIncreasePct > 0) {
      currentMonthly = roundHalfAwayFromZero(
        currentMonthly * (1 + yearlyIncreasePct / 100),
        2
      );
    }
  }

  return {
    maturityCorpus: roundHalfAwayFromZero(balance, 2),
    totalDeposited: roundHalfAwayFromZero(totalDeposited, 2),
    totalInterestEarned: roundHalfAwayFromZero(totalInterestEarned, 2),
    yearlyRows,
  };
}

export const config: ToolConfig = {
  id: 'gpf-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'monthlySubscription',
      label: 'Monthly Subscription Amount',
      type: 'number',
      min: 500,
      max: 1000000,
      step: 500,
      default: 10000,
      unit: '₹',
      help: 'Mandatory minimum subscription (at least 6% of basic pay under GPF rules)',
    },
    {
      key: 'openingBalance',
      label: 'Current / Opening Balance',
      type: 'number',
      min: 0,
      max: 50000000,
      step: 5000,
      default: 200000,
      unit: '₹',
      help: 'Existing GPF ledger balance at the beginning of the financial year',
    },
    {
      key: 'ratePct',
      label: 'GPF Interest Rate (% p.a.)',
      type: 'number',
      min: 5,
      max: 12,
      step: 0.05,
      default: ratesData.gpf.rate,
      unit: '%',
      help: `Government notified rate (currently ${ratesData.gpf.rate}%, verified ${ratesData.gpf.last_verified})`,
    },
    {
      key: 'years',
      label: 'Tenure Duration (Years)',
      type: 'number',
      min: 1,
      max: 35,
      step: 1,
      default: 15,
      unit: 'years',
      help: 'Years remaining until superannuation / retirement',
    },
    {
      key: 'yearlyIncreasePct',
      label: 'Annual Subscription Increase (% optional)',
      type: 'number',
      min: 0,
      max: 25,
      step: 1,
      default: 5,
      unit: '%',
      help: 'Anticipated percentage increase in monthly contribution following annual DA/increments',
    },
  ],
  outputs: [
    {
      key: 'maturityCorpus',
      label: 'Estimated GPF Maturity Corpus',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalDeposited',
      label: 'Total Principal Subscribed',
      format: 'currency',
    },
    {
      key: 'totalInterestEarned',
      label: 'Total Interest Credited',
      format: 'currency',
    },
  ],
  compute(values) {
    const monthlySubscription = Number(values.monthlySubscription) || 10000;
    const openingBalance = Number(values.openingBalance) || 0;
    const ratePct = Number(values.ratePct) || ratesData.gpf.rate;
    const years = Number(values.years) || 15;
    const yearlyIncreasePct = Number(values.yearlyIncreasePct) || 0;

    const res = calculateGpf({
      monthlySubscription,
      openingBalance,
      ratePct,
      years,
      yearlyIncreasePct,
    });

    const labels = res.yearlyRows.map((r) => `Yr ${r.year}`);
    const balanceValues = res.yearlyRows.map((r) => r.closingBalance);
    const interestValues = res.yearlyRows.map((r) => r.interestEarned);

    return {
      maturityCorpus: res.maturityCorpus,
      totalDeposited: res.totalDeposited,
      totalInterestEarned: res.totalInterestEarned,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'GPF Accumulation', color: '#059669', values: balanceValues },
          { name: 'Annual Interest Credited', color: '#f59e0b', values: interestValues },
        ],
      },
    };
  },
  table(values) {
    const monthlySubscription = Number(values.monthlySubscription) || 10000;
    const openingBalance = Number(values.openingBalance) || 0;
    const ratePct = Number(values.ratePct) || ratesData.gpf.rate;
    const years = Number(values.years) || 15;
    const yearlyIncreasePct = Number(values.yearlyIncreasePct) || 0;

    const res = calculateGpf({
      monthlySubscription,
      openingBalance,
      ratePct,
      years,
      yearlyIncreasePct,
    });

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'openingBalance', label: 'Opening Balance', format: 'currency' },
        { key: 'monthlyDeposit', label: 'Monthly Deposit', format: 'currency' },
        { key: 'yearlyDeposit', label: 'Annual Subscribed', format: 'currency' },
        { key: 'interestEarned', label: 'Interest Credited', format: 'currency' },
        { key: 'closingBalance', label: 'Closing Balance', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
