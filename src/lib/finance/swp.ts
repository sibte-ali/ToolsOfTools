import { roundHalfAwayFromZero } from '../engine/math';

export interface SwpYearlyRow {
  year: number;
  openingBalance: number;
  monthlyWithdrawal: number;
  totalWithdrawnYear: number;
  interestEarnedYear: number;
  closingBalance: number;
}

export interface SwpResult {
  totalInvested: number;
  totalWithdrawn: number;
  finalBalance: number;
  totalInterestEarned: number;
  isDepleted: boolean;
  depletionYear: number | null;
  depletionMonth: number | null;
  yearlyRows: SwpYearlyRow[];
}

export function calculateSwp(
  totalInvestment: number,
  monthlyWithdrawal: number,
  expectedReturnPct: number,
  years: number,
  stepUpPct = 0
): SwpResult {
  if (totalInvestment <= 0 || years <= 0) {
    return {
      totalInvested: 0,
      totalWithdrawn: 0,
      finalBalance: 0,
      totalInterestEarned: 0,
      isDepleted: false,
      depletionYear: null,
      depletionMonth: null,
      yearlyRows: [],
    };
  }

  const monthlyRate = expectedReturnPct > 0 ? expectedReturnPct / 12 / 100 : 0;
  let balance = totalInvestment;
  let currentWithdrawal = monthlyWithdrawal;
  let totalWithdrawn = 0;
  let totalInterest = 0;
  let isDepleted = false;
  let depletionYear: number | null = null;
  let depletionMonth: number | null = null;

  const yearlyRows: SwpYearlyRow[] = [];

  for (let yr = 1; yr <= years; yr++) {
    const openingBalance = roundHalfAwayFromZero(balance, 2);
    let yearWithdrawn = 0;
    let yearInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) {
        if (!isDepleted) {
          isDepleted = true;
          depletionYear = yr;
          depletionMonth = m;
        }
        break;
      }

      // Monthly loop: bal = bal*(1 + r/12) - w
      const interestForMonth = roundHalfAwayFromZero(balance * monthlyRate, 2);
      balance += interestForMonth;
      yearInterest += interestForMonth;
      totalInterest += interestForMonth;

      const actualWithdrawal = Math.min(balance, currentWithdrawal);
      balance = Math.max(0, balance - actualWithdrawal);
      yearWithdrawn += actualWithdrawal;
      totalWithdrawn += actualWithdrawal;

      if (balance === 0 && !isDepleted) {
        isDepleted = true;
        depletionYear = yr;
        depletionMonth = m;
      }
    }

    yearlyRows.push({
      year: yr,
      openingBalance,
      monthlyWithdrawal: roundHalfAwayFromZero(currentWithdrawal, 2),
      totalWithdrawnYear: roundHalfAwayFromZero(yearWithdrawn, 2),
      interestEarnedYear: roundHalfAwayFromZero(yearInterest, 2),
      closingBalance: roundHalfAwayFromZero(balance, 2),
    });

    if (stepUpPct > 0 && !isDepleted) {
      currentWithdrawal = roundHalfAwayFromZero(currentWithdrawal * (1 + stepUpPct / 100), 2);
    }
  }

  return {
    totalInvested: roundHalfAwayFromZero(totalInvestment, 2),
    totalWithdrawn: roundHalfAwayFromZero(totalWithdrawn, 2),
    finalBalance: roundHalfAwayFromZero(balance, 2),
    totalInterestEarned: roundHalfAwayFromZero(totalInterest, 2),
    isDepleted,
    depletionYear,
    depletionMonth,
    yearlyRows,
  };
}
