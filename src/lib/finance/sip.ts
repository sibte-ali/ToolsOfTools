import { roundHalfAwayFromZero } from '../engine/math';

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  maturityValue: number;
  yearlyRows: {
    year: number;
    monthlyInvestment: number;
    yearlyInvested: number;
    totalInvested: number;
    yearEndBalance: number;
    interestEarned: number;
  }[];
}

export function calculateSip(
  monthlyInvestment: number,
  expectedReturnPct: number,
  years: number,
  stepUpPct = 0
): SipResult {
  if (monthlyInvestment <= 0 || years <= 0) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      maturityValue: 0,
      yearlyRows: [],
    };
  }

  const monthlyRate = expectedReturnPct > 0 ? expectedReturnPct / 12 / 100 : 0;
  let currentMonthly = monthlyInvestment;
  let runningBalance = 0;
  let cumulativeInvested = 0;
  const yearlyRows: SipResult['yearlyRows'] = [];

  for (let yr = 1; yr <= years; yr++) {
    let yearInvested = 0;
    const startBalance = runningBalance;

    for (let m = 1; m <= 12; m++) {
      cumulativeInvested += currentMonthly;
      yearInvested += currentMonthly;
      // SIP investment at beginning of month: (balance + deposit) * (1 + r)
      runningBalance = (runningBalance + currentMonthly) * (1 + monthlyRate);
    }

    const yearEndBalance = roundHalfAwayFromZero(runningBalance, 2);
    const interestEarnedInYear = roundHalfAwayFromZero(
      yearEndBalance - startBalance - yearInvested,
      2
    );

    yearlyRows.push({
      year: yr,
      monthlyInvestment: roundHalfAwayFromZero(currentMonthly, 2),
      yearlyInvested: roundHalfAwayFromZero(yearInvested, 2),
      totalInvested: roundHalfAwayFromZero(cumulativeInvested, 2),
      yearEndBalance,
      interestEarned: interestEarnedInYear,
    });

    if (stepUpPct > 0) {
      currentMonthly = roundHalfAwayFromZero(currentMonthly * (1 + stepUpPct / 100), 2);
    }
  }

  const totalInvested = roundHalfAwayFromZero(cumulativeInvested, 2);
  const maturityValue = roundHalfAwayFromZero(runningBalance, 2);
  const estimatedReturns = roundHalfAwayFromZero(maturityValue - totalInvested, 2);

  return {
    totalInvested,
    estimatedReturns,
    maturityValue,
    yearlyRows,
  };
}

export interface DailySipResult {
  totalInvested: number;
  estimatedReturns: number;
  maturityValue: number;
  totalDays: number;
  yearlyRows: {
    year: number;
    yearlyInvested: number;
    totalInvested: number;
    yearEndBalance: number;
  }[];
}

export function calculateDailySip(
  dailyInvestment: number,
  expectedReturnPct: number,
  years: number,
  daysPerYear = 365
): DailySipResult {
  if (dailyInvestment <= 0 || years <= 0 || daysPerYear <= 0) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      maturityValue: 0,
      totalDays: 0,
      yearlyRows: [],
    };
  }

  const dailyRate = expectedReturnPct > 0 ? expectedReturnPct / daysPerYear / 100 : 0;
  let balance = 0;
  let cumulativeInvested = 0;
  const yearlyRows: DailySipResult['yearlyRows'] = [];

  for (let yr = 1; yr <= years; yr++) {
    let yearInvested = 0;

    for (let d = 1; d <= daysPerYear; d++) {
      cumulativeInvested += dailyInvestment;
      yearInvested += dailyInvestment;
      balance = (balance + dailyInvestment) * (1 + dailyRate);
    }

    yearlyRows.push({
      year: yr,
      yearlyInvested: roundHalfAwayFromZero(yearInvested, 2),
      totalInvested: roundHalfAwayFromZero(cumulativeInvested, 2),
      yearEndBalance: roundHalfAwayFromZero(balance, 2),
    });
  }

  const totalInvested = roundHalfAwayFromZero(cumulativeInvested, 2);
  const maturityValue = roundHalfAwayFromZero(balance, 2);
  const estimatedReturns = roundHalfAwayFromZero(maturityValue - totalInvested, 2);

  return {
    totalInvested,
    estimatedReturns,
    maturityValue,
    totalDays: years * daysPerYear,
    yearlyRows,
  };
}
