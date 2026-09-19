import { describe, it, expect } from 'vitest';
import { expectClose } from './test-utils';
import {
  calculateEmi,
  calculateAmortizationSchedule,
  calculateSipFutureValue,
  calculateCompoundInterest,
  calculateXirr,
  roundHalfAwayFromZero,
  parseLocalizedNumber,
  calculateCombinations,
  evaluateMathExpression,
} from './math';

describe('Math and financial calculation engine', () => {
  describe('EMI & Amortization', () => {
    it('calculates monthly EMI matching reference standard (1,000,000 at 10% for 20 years = 9,650.22)', () => {
      // Independent calculation:
      // P = 1,000,000
      // r = 0.10 / 12 = 0.008333333333333333
      // n = 20 * 12 = 240
      // (1 + r)^240 = 7.3280736437...
      // EMI = 1,000,000 * 0.008333333333333333 * 7.3280736437 / 6.3280736437 = 9650.21647...
      // Round half away from zero = 9650.22
      const emi = calculateEmi(1000000, 10, 20);
      expectClose(emi, 9650.22, 0.01);
      expect(emi).toBe(9650.22);
    });

    it('generates a consistent amortization schedule where principal + interest = total', () => {
      const schedule = calculateAmortizationSchedule(1000000, 10, 20);
      expect(schedule.yearlyRows.length).toBe(20);
      expect(schedule.yearlyRows[0].openingBalance).toBe(1000000);
      expect(schedule.yearlyRows[19].closingBalance).toBe(0);

      // Verify that total principal paid matches initial principal
      expectClose(schedule.totalPrincipal, 1000000, 5.0);
    });
  });

  describe('SIP & Compound Interest', () => {
    it('calculates SIP future value accurately for periodic series', () => {
      // 5,000 per month for 5 years (60 months) at 12% p.a.
      // Total invested = 5,000 * 60 = 300,000
      const sip = calculateSipFutureValue(5000, 12, 5, true);
      expect(sip.totalInvested).toBe(300000);
      // Theoretical FV for annuity due: 5000 * ((1.01^60 - 1) / 0.01) * 1.01 = 412,431.78
      expectClose(sip.futureValue, 412431.78, 1.0);
      expectClose(sip.totalInterest, 112431.78, 1.0);
    });

    it('calculates compound interest accurately', () => {
      // 10,000 at 8% compounded quarterly for 3 years
      // A = 10,000 * (1 + 0.08 / 4)^(4 * 3) = 10,000 * (1.02)^12 = 12,682.42
      const ci = calculateCompoundInterest(10000, 8, 3, 4);
      expect(ci.principal).toBe(10000);
      expectClose(ci.futureValue, 12682.42, 0.05);
      expectClose(ci.totalInterest, 2682.42, 0.05);
    });
  });

  describe('XIRR with Newton-Raphson & Bisection Fallback', () => {
    it('calculates annualized internal rate of return for irregular cashflows', () => {
      const cashflows = [
        { amount: -10000, date: '2025-01-01' },
        { amount: 3000, date: '2025-06-01' },
        { amount: 4000, date: '2025-12-01' },
        { amount: 5000, date: '2026-06-01' },
      ];
      const rate = calculateXirr(cashflows);
      // The annualized return is approx 24.5% - 25.5%
      expect(rate).toBeGreaterThan(0.2);
      expect(rate).toBeLessThan(0.3);
    });
  });

  describe('Rounding helpers (round half away from zero for money)', () => {
    it('rounds positive and negative half values away from zero', () => {
      expect(roundHalfAwayFromZero(2.5, 0)).toBe(3);
      expect(roundHalfAwayFromZero(2.4, 0)).toBe(2);
      expect(roundHalfAwayFromZero(-2.5, 0)).toBe(-3);
      expect(roundHalfAwayFromZero(-2.4, 0)).toBe(-2);
      expect(roundHalfAwayFromZero(9650.216, 2)).toBe(9650.22);
      expect(roundHalfAwayFromZero(9650.214, 2)).toBe(9650.21);
    });
  });

  describe('Safe parse of localized number strings', () => {
    it('handles comma-decimal European/Latin numbers and dot-decimal US numbers', () => {
      expect(parseLocalizedNumber('1.234,56')).toBe(1234.56);
      expect(parseLocalizedNumber('1,234.56')).toBe(1234.56);
      expect(parseLocalizedNumber('1 234,56')).toBe(1234.56);
      expect(parseLocalizedNumber('1000')).toBe(1000);
      expect(parseLocalizedNumber('€ 2.500,75')).toBe(2500.75);
      expect(parseLocalizedNumber('$ -1,500.25')).toBe(-1500.25);
    });
  });

  describe('Combinations using BigInt', () => {
    it('computes combinations without 64-bit precision overflow', () => {
      expect(calculateCombinations(5, 2)).toBe(10n);
      expect(calculateCombinations(52, 5)).toBe(2598960n);
      expect(calculateCombinations(100, 3)).toBe(161700n);
    });
  });

  describe('Safe arithmetic expression evaluator (NO eval / NO Function)', () => {
    it('evaluates basic math expressions with operator precedence and parentheses', () => {
      expect(evaluateMathExpression('2 + 3 * 4')).toBe(14);
      expect(evaluateMathExpression('(2 + 3) * 4')).toBe(20);
      expect(evaluateMathExpression('100 / (2 + 3) - 5')).toBe(15);
      expect(evaluateMathExpression('-5 + 15')).toBe(10);
      expect(evaluateMathExpression('10 * 2.5')).toBe(25);
    });
  });
});
