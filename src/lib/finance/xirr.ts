import { calculateXirr, roundHalfAwayFromZero } from '../engine/math';

export interface CashFlow {
  date: string;
  amount: number;
}

export interface XirrValidation {
  isValid: boolean;
  errorMessage?: string;
  hasNegative: boolean;
  hasPositive: boolean;
  cleanFlows: CashFlow[];
}

export function validateCashFlows(flows: CashFlow[]): XirrValidation {
  const cleanFlows: CashFlow[] = [];
  let hasNegative = false;
  let hasPositive = false;

  for (const cf of flows) {
    if (!cf.date || isNaN(new Date(cf.date).getTime())) continue;
    const amount = Number(cf.amount);
    if (isNaN(amount) || amount === 0) continue;

    if (amount < 0) hasNegative = true;
    if (amount > 0) hasPositive = true;

    cleanFlows.push({ date: cf.date, amount });
  }

  if (cleanFlows.length < 2) {
    return {
      isValid: false,
      errorMessage: 'At least two dated cash flows are required to compute XIRR.',
      hasNegative,
      hasPositive,
      cleanFlows,
    };
  }

  if (!hasNegative || !hasPositive) {
    return {
      isValid: false,
      errorMessage:
        'Cash flows must contain both negative values (investments/outflows) and positive values (returns/inflows).',
      hasNegative,
      hasPositive,
      cleanFlows,
    };
  }

  // Sort by date ascending
  cleanFlows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    isValid: true,
    hasNegative,
    hasPositive,
    cleanFlows,
  };
}

export function parseCashFlowCsv(csvText: string): CashFlow[] {
  const lines = csvText.split(/\r?\n/);
  const flows: CashFlow[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/[,;\t]/);
    if (parts.length >= 2) {
      const dateStr = parts[0].trim();
      const rawAmt = parts[1].trim().replace(/[$,₹£€]/g, '').replace(/\s/g, '');
      const parsedAmt = Number(rawAmt);
      if (!isNaN(new Date(dateStr).getTime()) && !isNaN(parsedAmt)) {
        flows.push({ date: dateStr, amount: parsedAmt });
      }
    }
  }

  return flows;
}

export function computeCashFlowXirr(flows: CashFlow[]): {
  rate: number;
  xirrPct: number;
  totalInvested: number;
  totalReceived: number;
  netGain: number;
  error?: string;
} {
  const validation = validateCashFlows(flows);
  if (!validation.isValid) {
    return {
      rate: 0,
      xirrPct: 0,
      totalInvested: 0,
      totalReceived: 0,
      netGain: 0,
      error: validation.errorMessage,
    };
  }

  try {
    const rateDecimal = calculateXirr(validation.cleanFlows);
    const xirrPct = roundHalfAwayFromZero(rateDecimal * 100, 2);

    let totalInvested = 0;
    let totalReceived = 0;
    for (const cf of validation.cleanFlows) {
      if (cf.amount < 0) {
        totalInvested += Math.abs(cf.amount);
      } else {
        totalReceived += cf.amount;
      }
    }

    return {
      rate: rateDecimal,
      xirrPct,
      totalInvested: roundHalfAwayFromZero(totalInvested, 2),
      totalReceived: roundHalfAwayFromZero(totalReceived, 2),
      netGain: roundHalfAwayFromZero(totalReceived - totalInvested, 2),
    };
  } catch (err: any) {
    return {
      rate: 0,
      xirrPct: 0,
      totalInvested: 0,
      totalReceived: 0,
      netGain: 0,
      error: err.message || 'XIRR calculation did not converge.',
    };
  }
}
