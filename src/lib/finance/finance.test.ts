import { describe, it, expect } from 'vitest';
import { calculateEmi, calculateAmortizationSchedule, compareReducingVsFlat } from './emi';
import { calculateSip, calculateDailySip } from './sip';
import { calculateSwp } from './swp';
import { computeCashFlowXirr, parseCashFlowCsv } from './xirr';
import { calculateCompoundInterest, calculateLumpSum } from './compound';
import { expectClose } from '../engine/test-utils';

describe('Shared Finance Libraries', () => {
  describe('EMI & Amortization (emi.ts)', () => {
    it('calculates standard loan EMI correctly (1M at 10% for 20y)', () => {
      // Benchmark: Standard loan formula P=1,000,000, r=10/12/100, n=240 -> EMI = 9650.22
      const emi = calculateEmi(1000000, 10, 20);
      expect(emi).toBe(9650.22);
    });

    it('calculates amortization with prepayments', () => {
      // Prepayment reduces total months and total interest
      const regular = calculateAmortizationSchedule(500000, 9, 10);
      const withPrepay = calculateAmortizationSchedule(500000, 9, 10, {
        monthlyPrepayment: 2000,
      });

      expect(withPrepay.actualMonths).toBeLessThan(regular.actualMonths);
      expect(withPrepay.totalInterest).toBeLessThan(regular.totalInterest);
      expect(withPrepay.monthsSaved).toBeGreaterThan(0);
    });

    it('compares reducing vs flat rate accurately', () => {
      // Flat rate loan: 100,000 at 10% flat for 3 years
      // Flat interest = 30,000; Flat total = 130,000; Flat EMI = 130,000 / 36 = 3611.11
      // Equivalent reducing rate is roughly 17.9% to 18.2%
      const comp = compareReducingVsFlat(100000, 10, 3);
      expect(comp.flatInterest).toBe(30000);
      expect(comp.flatMonthlyEmi).toBe(3611.11);
      expect(comp.effectiveReducingRate).toBeGreaterThan(17.5);
      expect(comp.effectiveReducingRate).toBeLessThan(18.5);
    });
  });

  describe('SIP & Daily SIP (sip.ts)', () => {
    it('computes regular monthly SIP compounding', () => {
      // Benchmark: 5,000/mo at 12% for 10 years (120 months)
      // Total Invested = 600,000. Maturity value ≈ 1,161,695.38
      const sip = calculateSip(5000, 12, 10);
      expect(sip.totalInvested).toBe(600000);
      expectClose(sip.maturityValue, 1161695.38, 5);
      expect(sip.yearlyRows.length).toBe(10);
    });

    it('computes step-up SIP with 10% annual increase', () => {
      const stepUp = calculateSip(5000, 12, 5, 10);
      // Yr 1 monthly: 5000, Yr 2 monthly: 5500, Yr 3 monthly: 6050
      expect(stepUp.yearlyRows[0].monthlyInvestment).toBe(5000);
      expect(stepUp.yearlyRows[1].monthlyInvestment).toBe(5500);
      expect(stepUp.yearlyRows[2].monthlyInvestment).toBe(6050);
      expect(stepUp.totalInvested).toBeGreaterThan(300000);
    });

    it('computes daily SIP correctly', () => {
      // 100/day at 12% for 1 year (365 days)
      const daily = calculateDailySip(100, 12, 1, 365);
      expect(daily.totalInvested).toBe(36500);
      expect(daily.maturityValue).toBeGreaterThan(38500);
      expect(daily.totalDays).toBe(365);
    });
  });

  describe('SWP (swp.ts)', () => {
    it('calculates sustainable SWP when return outpaces withdrawal', () => {
      // 1,000,000 at 12% with 5,000/mo withdrawal for 5 years
      // Monthly interest starts around 10,000, so withdrawal of 5,000 allows capital to grow
      const swp = calculateSwp(1000000, 5000, 12, 5);
      expect(swp.totalInvested).toBe(1000000);
      expect(swp.totalWithdrawn).toBe(300000);
      expect(swp.finalBalance).toBeGreaterThan(1000000);
      expect(swp.isDepleted).toBe(false);
    });

    it('detects corpus depletion when withdrawal exceeds return', () => {
      // 100,000 at 6% with 15,000/mo withdrawal
      // Depletes within ~7 months
      const swp = calculateSwp(100000, 15000, 6, 2);
      expect(swp.isDepleted).toBe(true);
      expect(swp.depletionYear).toBe(1);
      expect(swp.finalBalance).toBe(0);
    });
  });

  describe('XIRR (xirr.ts)', () => {
    it('computes XIRR from dated cash flows', () => {
      // Invest 10,000 on 2024-01-01, receive 11,000 on 2025-01-01 (1 year later = exactly 10% XIRR)
      const flows = [
        { date: '2024-01-01', amount: -10000 },
        { date: '2025-01-01', amount: 11000 },
      ];
      const res = computeCashFlowXirr(flows);
      expect(res.error).toBeUndefined();
      expectClose(res.xirrPct, 10.0, 0.1);
    });

    it('parses CSV cash flows cleanly', () => {
      const csv = `2024-01-01, -10000\n2024-07-01, -5000\n2025-01-01, 17000`;
      const parsed = parseCashFlowCsv(csv);
      expect(parsed.length).toBe(3);
      const res = computeCashFlowXirr(parsed);
      expect(res.error).toBeUndefined();
      expect(res.totalInvested).toBe(15000);
      expect(res.totalReceived).toBe(17000);
    });

    it('flags error if only positive or only negative cash flows', () => {
      const invalidFlows = [
        { date: '2024-01-01', amount: 1000 },
        { date: '2025-01-01', amount: 2000 },
      ];
      const res = computeCashFlowXirr(invalidFlows);
      expect(res.error).toBeDefined();
    });
  });

  describe('Compound Interest & Lump Sum (compound.ts)', () => {
    it('computes annual compounding vs monthly compounding', () => {
      // 10,000 at 10% for 5 years:
      // Annual: 10000 * 1.10^5 = 16,105.10
      const annual = calculateCompoundInterest(10000, 10, 5, 'annual');
      expectClose(annual.futureValue, 16105.1, 1);

      // Monthly compounding earns more
      const monthly = calculateCompoundInterest(10000, 10, 5, 'monthly');
      expect(monthly.futureValue).toBeGreaterThan(annual.futureValue);
    });

    it('calculates lump sum with inflation purchasing power adjustment', () => {
      // 100,000 at 8% return with 6% inflation for 10 years
      const res = calculateLumpSum(100000, 8, 10, 'annual', 6);
      expect(res.futureValue).toBeGreaterThan(200000);
      expect(res.realPurchasingPower).toBeLessThan(res.futureValue);
      expect(res.inflationLoss).toBeGreaterThan(0);
    });
  });
});
