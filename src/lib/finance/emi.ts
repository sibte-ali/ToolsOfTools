import { roundHalfAwayFromZero } from '../engine/math';

export interface AmortizationRow {
  month: number;
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  prepayment: number;
  totalPayment: number;
  closingBalance: number;
}

export interface AmortizationSchedule {
  monthlyEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  processingFeeAmount: number;
  totalCostWithFees: number;
  actualMonths: number;
  monthsSaved: number;
  interestSaved: number;
  monthlyRows: AmortizationRow[];
  yearlyRows: {
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    prepayment: number;
    totalPayment: number;
    closingBalance: number;
  }[];
}

export function calculateEmi(
  principal: number,
  annualRatePct: number,
  tenureYears: number,
  tenureMonths = 0
): number {
  if (principal <= 0) return 0;
  const totalMonths = tenureYears * 12 + tenureMonths;
  if (totalMonths <= 0) return 0;
  if (annualRatePct <= 0) return roundHalfAwayFromZero(principal / totalMonths, 2);

  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return roundHalfAwayFromZero(emi, 2);
}

export function calculateAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  tenureYears: number,
  options?: {
    tenureMonths?: number;
    monthlyPrepayment?: number;
    yearlyPrepayment?: number;
    processingFeePct?: number;
  }
): AmortizationSchedule {
  const tenureMonths = options?.tenureMonths || 0;
  const totalScheduledMonths = tenureYears * 12 + tenureMonths;
  const monthlyPrepay = options?.monthlyPrepayment || 0;
  const yearlyPrepay = options?.yearlyPrepayment || 0;
  const processingFeePct = options?.processingFeePct || 0;

  const baseEmi = calculateEmi(principal, annualRatePct, tenureYears, tenureMonths);
  const processingFeeAmount = roundHalfAwayFromZero((principal * processingFeePct) / 100, 2);

  if (principal <= 0 || totalScheduledMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalPayment: 0,
      processingFeeAmount: 0,
      totalCostWithFees: 0,
      actualMonths: 0,
      monthsSaved: 0,
      interestSaved: 0,
      monthlyRows: [],
      yearlyRows: [],
    };
  }

  const monthlyRate = annualRatePct > 0 ? annualRatePct / 12 / 100 : 0;
  let balance = principal;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  const monthlyRows: AmortizationRow[] = [];

  for (let m = 1; m <= totalScheduledMonths && balance > 0.005; m++) {
    const opening = balance;
    const interest = roundHalfAwayFromZero(opening * monthlyRate, 2);
    let regularPrincipal = roundHalfAwayFromZero(baseEmi - interest, 2);
    if (regularPrincipal > opening) {
      regularPrincipal = opening;
    }

    let prepay = monthlyPrepay;
    if (m % 12 === 0 && yearlyPrepay > 0) {
      prepay += yearlyPrepay;
    }

    // Cap prepayment to remaining balance
    if (opening - regularPrincipal < prepay) {
      prepay = Math.max(0, roundHalfAwayFromZero(opening - regularPrincipal, 2));
    }

    const principalTotalForMonth = regularPrincipal + prepay;
    const closing = Math.max(0, roundHalfAwayFromZero(opening - principalTotalForMonth, 2));
    const totalMonthPayment = regularPrincipal + interest + prepay;

    totalInterestPaid += interest;
    totalPrincipalPaid += principalTotalForMonth;
    balance = closing;

    const yearNum = Math.ceil(m / 12);
    monthlyRows.push({
      month: m,
      year: yearNum,
      openingBalance: opening,
      principalPaid: regularPrincipal,
      interestPaid: interest,
      prepayment: prepay,
      totalPayment: totalMonthPayment,
      closingBalance: closing,
    });
  }

  // Yearly aggregates
  const yearlyMap = new Map<
    number,
    {
      year: number;
      openingBalance: number;
      principalPaid: number;
      interestPaid: number;
      prepayment: number;
      totalPayment: number;
      closingBalance: number;
    }
  >();

  for (const row of monthlyRows) {
    let yearAgg = yearlyMap.get(row.year);
    if (!yearAgg) {
      yearAgg = {
        year: row.year,
        openingBalance: row.openingBalance,
        principalPaid: 0,
        interestPaid: 0,
        prepayment: 0,
        totalPayment: 0,
        closingBalance: row.closingBalance,
      };
      yearlyMap.set(row.year, yearAgg);
    }
    yearAgg.principalPaid = roundHalfAwayFromZero(yearAgg.principalPaid + row.principalPaid, 2);
    yearAgg.interestPaid = roundHalfAwayFromZero(yearAgg.interestPaid + row.interestPaid, 2);
    yearAgg.prepayment = roundHalfAwayFromZero(yearAgg.prepayment + row.prepayment, 2);
    yearAgg.totalPayment = roundHalfAwayFromZero(yearAgg.totalPayment + row.totalPayment, 2);
    yearAgg.closingBalance = row.closingBalance;
  }

  const yearlyRows = Array.from(yearlyMap.values());
  const actualMonths = monthlyRows.length;
  const monthsSaved = Math.max(0, totalScheduledMonths - actualMonths);

  // Baseline interest without prepayments
  const baselineTotalPayment = roundHalfAwayFromZero(baseEmi * totalScheduledMonths, 2);
  const baselineInterest = roundHalfAwayFromZero(baselineTotalPayment - principal, 2);
  const totalInterestRounded = roundHalfAwayFromZero(totalInterestPaid, 2);
  const interestSaved = Math.max(0, roundHalfAwayFromZero(baselineInterest - totalInterestRounded, 2));
  const totalPayment = roundHalfAwayFromZero(totalPrincipalPaid + totalInterestRounded, 2);
  const totalCostWithFees = roundHalfAwayFromZero(totalPayment + processingFeeAmount, 2);

  return {
    monthlyEmi: baseEmi,
    totalPrincipal: roundHalfAwayFromZero(totalPrincipalPaid, 2),
    totalInterest: totalInterestRounded,
    totalPayment,
    processingFeeAmount,
    totalCostWithFees,
    actualMonths,
    monthsSaved,
    interestSaved,
    monthlyRows,
    yearlyRows,
  };
}

export function compareReducingVsFlat(
  principal: number,
  flatRatePct: number,
  tenureYears: number
) {
  const totalMonths = tenureYears * 12;
  const flatInterest = roundHalfAwayFromZero(principal * (flatRatePct / 100) * tenureYears, 2);
  const flatTotalPayment = roundHalfAwayFromZero(principal + flatInterest, 2);
  const flatMonthlyEmi = roundHalfAwayFromZero(flatTotalPayment / totalMonths, 2);

  // Equivalent reducing balance loan with same EMI:
  // We solve for the interest rate that produces flatMonthlyEmi on principal over totalMonths
  // Using bisection
  let lowRate = 0;
  let highRate = 100;
  let effectiveReducingRate = flatRatePct;

  for (let i = 0; i < 50; i++) {
    const midRate = (lowRate + highRate) / 2;
    const emi = calculateEmi(principal, midRate, tenureYears);
    if (Math.abs(emi - flatMonthlyEmi) < 0.01) {
      effectiveReducingRate = midRate;
      break;
    }
    if (emi < flatMonthlyEmi) {
      lowRate = midRate;
    } else {
      highRate = midRate;
    }
    effectiveReducingRate = midRate;
  }

  const reducingEmiAtFlatRate = calculateEmi(principal, flatRatePct, tenureYears);
  const reducingTotalPayment = roundHalfAwayFromZero(reducingEmiAtFlatRate * totalMonths, 2);
  const reducingTotalInterest = roundHalfAwayFromZero(reducingTotalPayment - principal, 2);
  const interestDifference = roundHalfAwayFromZero(flatInterest - reducingTotalInterest, 2);

  return {
    principal,
    flatRatePct,
    tenureYears,
    flatMonthlyEmi,
    flatInterest,
    flatTotalPayment,
    reducingEmiAtFlatRate,
    reducingTotalInterest,
    reducingTotalPayment,
    effectiveReducingRate: roundHalfAwayFromZero(effectiveReducingRate, 2),
    interestDifference,
  };
}
