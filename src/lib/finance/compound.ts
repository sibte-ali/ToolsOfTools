import { roundHalfAwayFromZero } from '../engine/math';

export type CompoundingFrequency = 'annual' | 'semi-annual' | 'quarterly' | 'monthly' | 'daily';

export function getFrequencyTimesPerYear(freq: CompoundingFrequency | string): number {
  switch (freq) {
    case 'annual':
    case '1':
      return 1;
    case 'semi-annual':
    case '2':
      return 2;
    case 'quarterly':
    case '4':
      return 4;
    case 'monthly':
    case '12':
      return 12;
    case 'daily':
    case '365':
      return 365;
    default:
      return 1;
  }
}

export interface CompoundYearlyRow {
  year: number;
  openingBalance: number;
  contributions: number;
  interestEarned: number;
  closingBalance: number;
}

export interface CompoundResult {
  principal: number;
  totalContributions: number;
  totalInterestEarned: number;
  futureValue: number;
  yearlyRows: CompoundYearlyRow[];
}

export function calculateCompoundInterest(
  principal: number,
  ratePct: number,
  years: number,
  frequency: CompoundingFrequency | string = 'annual',
  monthlyContribution = 0
): CompoundResult {
  if (principal < 0 || years <= 0) {
    return {
      principal: 0,
      totalContributions: 0,
      totalInterestEarned: 0,
      futureValue: 0,
      yearlyRows: [],
    };
  }

  const n = getFrequencyTimesPerYear(frequency);
  const r = ratePct > 0 ? ratePct / 100 : 0;
  let balance = principal;
  let totalContributions = 0;
  const yearlyRows: CompoundYearlyRow[] = [];

  for (let yr = 1; yr <= years; yr++) {
    const opening = balance;
    let yearContributions = 0;

    // Simulate month-by-month for consistent monthly contributions
    for (let m = 1; m <= 12; m++) {
      if (monthlyContribution > 0) {
        balance += monthlyContribution;
        yearContributions += monthlyContribution;
        totalContributions += monthlyContribution;
      }
      // Month end interest factor based on compounding frequency
      const monthlyEquivalentRate = Math.pow(1 + r / n, n / 12) - 1;
      balance = balance * (1 + monthlyEquivalentRate);
    }

    const closing = roundHalfAwayFromZero(balance, 2);
    const interest = roundHalfAwayFromZero(closing - opening - yearContributions, 2);

    yearlyRows.push({
      year: yr,
      openingBalance: roundHalfAwayFromZero(opening, 2),
      contributions: roundHalfAwayFromZero(yearContributions, 2),
      interestEarned: interest,
      closingBalance: closing,
    });
  }

  const futureValue = roundHalfAwayFromZero(balance, 2);
  const totalPrincipalDeposited = roundHalfAwayFromZero(principal + totalContributions, 2);
  const totalInterestEarned = roundHalfAwayFromZero(futureValue - totalPrincipalDeposited, 2);

  return {
    principal: roundHalfAwayFromZero(principal, 2),
    totalContributions: roundHalfAwayFromZero(totalContributions, 2),
    totalInterestEarned,
    futureValue,
    yearlyRows,
  };
}

export interface LumpSumResult {
  principal: number;
  futureValue: number;
  totalGain: number;
  realPurchasingPower: number;
  inflationLoss: number;
  yearlyRows: {
    year: number;
    nominalValue: number;
    realValue: number;
  }[];
}

export function calculateLumpSum(
  principal: number,
  returnPct: number,
  years: number,
  frequency: CompoundingFrequency | string = 'annual',
  inflationPct = 0
): LumpSumResult {
  if (principal <= 0 || years <= 0) {
    return {
      principal: 0,
      futureValue: 0,
      totalGain: 0,
      realPurchasingPower: 0,
      inflationLoss: 0,
      yearlyRows: [],
    };
  }

  const n = getFrequencyTimesPerYear(frequency);
  const r = returnPct > 0 ? returnPct / 100 : 0;
  const infl = inflationPct > 0 ? inflationPct / 100 : 0;
  const yearlyRows: LumpSumResult['yearlyRows'] = [];

  for (let yr = 1; yr <= years; yr++) {
    const nominal = principal * Math.pow(1 + r / n, n * yr);
    const real = nominal / Math.pow(1 + infl, yr);

    yearlyRows.push({
      year: yr,
      nominalValue: roundHalfAwayFromZero(nominal, 2),
      realValue: roundHalfAwayFromZero(real, 2),
    });
  }

  const futureValue = yearlyRows[yearlyRows.length - 1].nominalValue;
  const realPurchasingPower = yearlyRows[yearlyRows.length - 1].realValue;
  const totalGain = roundHalfAwayFromZero(futureValue - principal, 2);
  const inflationLoss = roundHalfAwayFromZero(futureValue - realPurchasingPower, 2);

  return {
    principal: roundHalfAwayFromZero(principal, 2),
    futureValue,
    totalGain,
    realPurchasingPower,
    inflationLoss,
    yearlyRows,
  };
}
