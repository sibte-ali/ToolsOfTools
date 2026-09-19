/**
 * Core mathematical and financial calculation utilities.
 * Pure functions, safe parsing, no eval/Function.
 */

/**
 * Rounds half away from zero (standard commercial / financial rounding).
 * E.g., 2.5 -> 3, -2.5 -> -3.
 */
export function roundHalfAwayFromZero(val: number, decimals = 2): number {
  if (!Number.isFinite(val)) return val;
  const factor = Math.pow(10, decimals);
  const sign = val < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(val) * factor + Number.EPSILON)) / factor;
}

/**
 * Calculates Equated Monthly Installment (EMI).
 * Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where r = annualRatePct / 1200, n = tenureYears * 12.
 */
export function calculateEmi(
  principal: number,
  annualRatePct: number,
  tenureYears: number
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const n = Math.round(tenureYears * 12);
  const r = annualRatePct / 100 / 12;

  if (r === 0) {
    return roundHalfAwayFromZero(principal / n, 2);
  }

  const factor = Math.pow(1 + r, n);
  const emi = (principal * r * factor) / (factor - 1);
  return roundHalfAwayFromZero(emi, 2);
}

export interface AmortizationRow {
  year: number;
  month?: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  closingBalance: number;
}

export interface AmortizationSchedule {
  monthlyEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  yearlyRows: AmortizationRow[];
}

/**
 * Generates full year-by-year amortization schedule for a reducing balance loan.
 */
export function calculateAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  tenureYears: number
): AmortizationSchedule {
  const emi = calculateEmi(principal, annualRatePct, tenureYears);
  const totalMonths = Math.round(tenureYears * 12);
  const monthlyRate = annualRatePct / 100 / 12;

  let balance = principal;
  let accumulatedPrincipal = 0;
  let accumulatedInterest = 0;

  const yearlyRows: AmortizationRow[] = [];
  let currentYearInterest = 0;
  let currentYearPrincipal = 0;
  let yearOpeningBalance = principal;

  for (let m = 1; m <= totalMonths; m++) {
    const interest = balance * monthlyRate;
    let principalPart = emi - interest;

    if (m === totalMonths || balance - principalPart < 0) {
      principalPart = balance;
    }

    balance = Math.max(0, balance - principalPart);
    currentYearInterest += interest;
    currentYearPrincipal += principalPart;
    accumulatedPrincipal += principalPart;
    accumulatedInterest += interest;

    if (m % 12 === 0 || m === totalMonths) {
      const yearIndex = Math.ceil(m / 12);
      yearlyRows.push({
        year: yearIndex,
        openingBalance: roundHalfAwayFromZero(yearOpeningBalance, 2),
        principalPaid: roundHalfAwayFromZero(currentYearPrincipal, 2),
        interestPaid: roundHalfAwayFromZero(currentYearInterest, 2),
        totalPayment: roundHalfAwayFromZero(
          currentYearPrincipal + currentYearInterest,
          2
        ),
        closingBalance: roundHalfAwayFromZero(balance, 2),
      });

      yearOpeningBalance = balance;
      currentYearInterest = 0;
      currentYearPrincipal = 0;
    }

    if (balance <= 0) break;
  }

  return {
    monthlyEmi: emi,
    totalPrincipal: roundHalfAwayFromZero(accumulatedPrincipal, 2),
    totalInterest: roundHalfAwayFromZero(accumulatedInterest, 2),
    totalPayment: roundHalfAwayFromZero(
      accumulatedPrincipal + accumulatedInterest,
      2
    ),
    yearlyRows,
  };
}

export interface SipResult {
  totalInvested: number;
  totalInterest: number;
  futureValue: number;
}

/**
 * Calculates Future Value of a Systematic Investment Plan (SIP) or annuity.
 * When inAdvance is true (default for monthly SIP deposited at beginning of month):
 * FV = P * [((1 + r)^n - 1) / r] * (1 + r)
 */
export function calculateSipFutureValue(
  monthlyDeposit: number,
  annualRatePct: number,
  years: number,
  inAdvance = true
): SipResult {
  if (monthlyDeposit <= 0 || years <= 0) {
    return { totalInvested: 0, totalInterest: 0, futureValue: 0 };
  }

  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const totalInvested = monthlyDeposit * n;

  if (r === 0) {
    return {
      totalInvested: roundHalfAwayFromZero(totalInvested, 2),
      totalInterest: 0,
      futureValue: roundHalfAwayFromZero(totalInvested, 2),
    };
  }

  const baseFactor = (Math.pow(1 + r, n) - 1) / r;
  const fv = inAdvance
    ? monthlyDeposit * baseFactor * (1 + r)
    : monthlyDeposit * baseFactor;

  const roundedFv = roundHalfAwayFromZero(fv, 2);
  const roundedInvested = roundHalfAwayFromZero(totalInvested, 2);
  const interest = Math.max(0, roundedFv - roundedInvested);

  return {
    totalInvested: roundedInvested,
    totalInterest: roundHalfAwayFromZero(interest, 2),
    futureValue: roundedFv,
  };
}

export interface CompoundInterestResult {
  principal: number;
  totalInterest: number;
  futureValue: number;
}

/**
 * Calculates Compound Interest.
 * Formula: A = P * (1 + r/n)^(n*t)
 */
export function calculateCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear = 1
): CompoundInterestResult {
  if (principal <= 0 || years <= 0) {
    return { principal, totalInterest: 0, futureValue: principal };
  }

  const r = annualRatePct / 100;
  const n = Math.max(1, compoundsPerYear);
  const fv = principal * Math.pow(1 + r / n, n * years);
  const roundedFv = roundHalfAwayFromZero(fv, 2);
  const roundedPrincipal = roundHalfAwayFromZero(principal, 2);

  return {
    principal: roundedPrincipal,
    totalInterest: roundHalfAwayFromZero(roundedFv - roundedPrincipal, 2),
    futureValue: roundedFv,
  };
}

export interface CashflowItem {
  amount: number;
  date: string | Date;
}

/**
 * Calculates Internal Rate of Return for irregular cash flows (XIRR).
 * Uses Newton-Raphson iteration with robust Bisection fallback.
 * Returns annualized rate as decimal (e.g. 0.125 for 12.5%).
 */
export function calculateXirr(
  cashflows: CashflowItem[],
  guess = 0.1
): number {
  if (cashflows.length < 2) {
    throw new Error('XIRR requires at least two cash flows');
  }

  const parsed = cashflows.map((c) => ({
    amount: Number(c.amount),
    time:
      (new Date(c.date).getTime() - new Date(cashflows[0].date).getTime()) /
      (1000 * 60 * 60 * 24 * 365),
  }));

  const hasPos = parsed.some((c) => c.amount > 0);
  const hasNeg = parsed.some((c) => c.amount < 0);
  if (!hasPos || !hasNeg) {
    throw new Error('XIRR requires at least one positive and one negative cash flow');
  }

  function npv(rate: number): number {
    if (rate <= -1) return Number.NEGATIVE_INFINITY;
    let sum = 0;
    for (const c of parsed) {
      sum += c.amount / Math.pow(1 + rate, c.time);
    }
    return sum;
  }

  function npvPrime(rate: number): number {
    if (rate <= -1) return 0;
    let sum = 0;
    for (const c of parsed) {
      sum += (-c.time * c.amount) / Math.pow(1 + rate, c.time + 1);
    }
    return sum;
  }

  // 1. Newton-Raphson
  let rate = guess;
  const maxIterations = 50;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    if (rate <= -0.999) rate = -0.99;
    const y = npv(rate);
    const yPrime = npvPrime(rate);

    if (Math.abs(yPrime) < 1e-12 || !Number.isFinite(y) || !Number.isFinite(yPrime)) {
      break; // Switch to bisection
    }

    const nextRate = rate - y / yPrime;
    if (Math.abs(nextRate - rate) < tolerance || Math.abs(y) < 1e-6) {
      return roundHalfAwayFromZero(nextRate, 6);
    }
    rate = nextRate;
  }

  // 2. Bisection Fallback
  let low = -0.99;
  let high = 10.0;
  let lowNpv = npv(low);
  let highNpv = npv(high);

  // Expand high if needed
  if (lowNpv * highNpv > 0) {
    for (let expand = 10; expand <= 100; expand += 20) {
      high = expand;
      highNpv = npv(high);
      if (lowNpv * highNpv <= 0) break;
    }
  }

  if (lowNpv * highNpv <= 0) {
    for (let iter = 0; iter < 100; iter++) {
      const mid = (low + high) / 2;
      const midNpv = npv(mid);

      if (Math.abs(midNpv) < 1e-6 || Math.abs(high - low) < tolerance) {
        return roundHalfAwayFromZero(mid, 6);
      }

      if (lowNpv * midNpv <= 0) {
        high = mid;
        highNpv = midNpv;
      } else {
        low = mid;
        lowNpv = midNpv;
      }
    }
    return roundHalfAwayFromZero((low + high) / 2, 6);
  }

  return roundHalfAwayFromZero(rate, 6);
}

/**
 * Safely parses localized numeric strings (supports English 1,234.56 and European/Latin 1.234,56).
 */
export function parseLocalizedNumber(input: string | number): number {
  if (typeof input === 'number') return input;
  if (!input || typeof input !== 'string') return 0;

  let str = input.trim();
  if (str === '') return 0;

  // Detect negative
  const isNegative = str.includes('-') || /\(.*\)/.test(str);
  str = str.replace(/[^\d.,]/g, '');

  if (str === '') return 0;

  const dotIdx = str.lastIndexOf('.');
  const commaIdx = str.lastIndexOf(',');

  if (dotIdx !== -1 && commaIdx !== -1) {
    if (dotIdx > commaIdx) {
      // 1,234.56 -> comma is thousand, dot is decimal
      str = str.replace(/,/g, '');
    } else {
      // 1.234,56 -> dot is thousand, comma is decimal
      str = str.replace(/\./g, '').replace(',', '.');
    }
  } else if (commaIdx !== -1) {
    // Only commas present: e.g. "1234,56" or "1,234"
    const parts = str.split(',');
    if (parts.length === 2 && parts[1].length !== 3) {
      // Decimal comma (e.g. 12,5 or 1234,56)
      str = str.replace(',', '.');
    } else if (parts.length > 2) {
      // Multiple commas -> thousands separators: 1,000,000
      str = str.replace(/,/g, '');
    } else {
      // Single comma with 3 digits at end (e.g. 1,000)
      str = str.replace(',', '.');
    }
  }

  const parsed = parseFloat(str);
  if (isNaN(parsed)) return 0;
  return isNegative ? -parsed : parsed;
}

/**
 * Combinations: nCr = n! / (r! * (n - r)!)
 * Uses BigInt to prevent 64-bit float precision overflows.
 */
export function calculateCombinations(n: number, r: number): bigint {
  if (n < 0 || r < 0 || r > n) return 0n;
  if (r === 0 || r === n) return 1n;

  const k = r > n - r ? n - r : r;
  let result = 1n;

  for (let i = 1; i <= k; i++) {
    result = (result * BigInt(n - i + 1)) / BigInt(i);
  }

  return result;
}

/**
 * Safe arithmetic expression evaluator for basic calculators.
 * Implements Shunting-Yard algorithm (Dijkstra) with RPN evaluator.
 * Strictly NO eval or new Function.
 */
export function evaluateMathExpression(expression: string): number {
  const sanitized = expression.replace(/\s+/g, '');
  if (!sanitized) return 0;

  type TokenType = 'num' | 'op' | 'lparen' | 'rparen';
  interface Token {
    type: TokenType;
    val: string | number;
  }

  const tokens: Token[] = [];
  let i = 0;

  while (i < sanitized.length) {
    const char = sanitized[i];

    if (/\d/.test(char) || char === '.') {
      let numStr = '';
      while (i < sanitized.length && (/[\d.]/.test(sanitized[i]))) {
        numStr += sanitized[i];
        i++;
      }
      tokens.push({ type: 'num', val: parseFloat(numStr) });
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'lparen', val: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'rparen', val: ')' });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '%'].includes(char)) {
      // Check for unary minus
      const prev = tokens[tokens.length - 1];
      if (char === '-' && (!prev || prev.type === 'op' || prev.type === 'lparen')) {
        let numStr = '-';
        i++;
        while (i < sanitized.length && (/[\d.]/.test(sanitized[i]))) {
          numStr += sanitized[i];
          i++;
        }
        tokens.push({ type: 'num', val: parseFloat(numStr) });
        continue;
      }

      tokens.push({ type: 'op', val: char });
      i++;
      continue;
    }

    i++; // Skip unrecognized
  }

  // Shunting Yard: Infix to RPN
  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
  };

  const outputQueue: Token[] = [];
  const opStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'num') {
      outputQueue.push(token);
    } else if (token.type === 'op') {
      const op1 = token.val as string;
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1].type === 'op' &&
        precedence[opStack[opStack.length - 1].val as string] >= precedence[op1]
      ) {
        outputQueue.push(opStack.pop()!);
      }
      opStack.push(token);
    } else if (token.type === 'lparen') {
      opStack.push(token);
    } else if (token.type === 'rparen') {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'lparen') {
        outputQueue.push(opStack.pop()!);
      }
      if (opStack.length > 0 && opStack[opStack.length - 1].type === 'lparen') {
        opStack.pop();
      }
    }
  }

  while (opStack.length > 0) {
    outputQueue.push(opStack.pop()!);
  }

  // Evaluate RPN
  const evalStack: number[] = [];
  for (const token of outputQueue) {
    if (token.type === 'num') {
      evalStack.push(token.val as number);
    } else if (token.type === 'op') {
      const b = evalStack.pop() ?? 0;
      const a = evalStack.pop() ?? 0;
      let res = 0;
      switch (token.val) {
        case '+':
          res = a + b;
          break;
        case '-':
          res = a - b;
          break;
        case '*':
          res = a * b;
          break;
        case '/':
          res = b !== 0 ? a / b : 0;
          break;
        case '%':
          res = b !== 0 ? a % b : 0;
          break;
      }
      evalStack.push(res);
    }
  }

  return evalStack.length > 0 ? evalStack[0] : 0;
}
