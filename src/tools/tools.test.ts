import { describe, it, expect } from 'vitest';
import { expectClose } from '../lib/engine/test-utils';

// Import tool configs and pure functions
import swpConfig from './en/swp-calculator';
import { calculatePf } from './en/pf-calculator';
import { computeDiscountLogic } from './en/discount-calculator';
import xirrConfig from './en/xirr-calculator';
import personalLoanConfig from './en/personal-loan-emi-calculator';
import { computeGst } from './en/gst-calculator';
import dailySipConfig from './en/daily-sip-calculator';
import { calculateLotSize } from './en/lot-size-calculator';
import carLoanConfig from './en/car-loan-emi-calculator';
import { calculateInvestimentoBrasil } from './pt-br/calculadora-de-investimentos';
import homeLoanConfig from './en/home-loan-calculator';
import sipConfig from './en/sip';
import { calculateScss } from './en/scss-calculator';
import cashConfig, { numberToIndianWords } from './en/cash-calculator';
import reducingEmiConfig from './en/reducing-emi-calculator';
import emiConfig from './en/emi-calculator';
import { calculateGpf } from './en/gpf-calculator';
import gannConfig, { calculateGannSquareOf9 } from './en/gann-square-of-9-calculator';
import { calculateMortgage } from './en/mortgage-loan-calculator';
import compoundConfig from './en/compound-interest-calculator';
import lumpSumConfig from './en/lump-sum-amount';

function runCompute(config: { compute: (v: any) => any }, values: Record<string, any>): Record<string, any> {
  const res = config.compute(values);
  if (res instanceof Error) throw res;
  return res as Record<string, any>;
}

describe('Batch A Finance Tools Compute Tests', () => {
  // 1. SWP Calculator
  describe('swp-calculator', () => {
    it('computes regular sustainable SWP (HDFC / Groww benchmark)', () => {
      // Source benchmark: 1,000,000 at 10% for 10 years with 8,000/mo withdrawal
      // Total withdrawn = 960,000; Final balance > 500,000
      const out = runCompute(swpConfig, {
        totalInvestment: 1000000,
        monthlyWithdrawal: 8000,
        expectedReturnPct: 10,
        years: 10,
        stepUpPct: 0,
      });
      expect(out.totalWithdrawn).toBe(960000);
      expect(out.finalBalance).toBeGreaterThan(500000);
      expect(out.depletionStatus).toBe('Corpus remains solvent');
    });

    it('detects corpus depletion when withdrawal is too high', () => {
      // 500,000 at 8% with 15,000/mo withdrawal
      const out = runCompute(swpConfig, {
        totalInvestment: 500000,
        monthlyWithdrawal: 15000,
        expectedReturnPct: 8,
        years: 5,
      });
      expect(out.finalBalance).toBe(0);
      expect(out.depletionStatus).toContain('Depleted in Year');
    });
  });

  // 2. PF Calculator
  describe('pf-calculator', () => {
    it('computes EPF accumulation with salary hike (EPFO statutory rules)', () => {
      // Source: EPFO official interest rules (8.25% rate)
      const res = calculatePf({
        monthlyBasicAndDa: 50000,
        currentAge: 28,
        retirementAge: 58,
        annualHikePct: 5,
        currentBalance: 100000,
        epfRatePct: 8.25,
      });
      expect(res.finalCorpus).toBeGreaterThan(10000000);
      expect(res.totalOwn).toBeGreaterThan(0);
      expect(res.totalEmployer).toBeGreaterThan(0);
      expect(res.yearlyRows.length).toBe(30);
    });

    it('caps EPS contribution at statutory ceiling of 15,000 basic', () => {
      // Source: Employees' Pension Scheme 1995 ceiling (8.33% of max 15000 = 1250/mo)
      const res = calculatePf({
        monthlyBasicAndDa: 100000,
        currentAge: 30,
        retirementAge: 31,
        annualHikePct: 0,
        currentBalance: 0,
        epfRatePct: 8.25,
      });
      // Employee: 12% of 100000 = 12000/mo
      // Employer total: 12000/mo, EPS capped at 1250, EPF employer share = 10750/mo
      expect(res.yearlyRows[0].employeeContribYear).toBe(144000);
      expect(res.yearlyRows[0].employerEpfYear).toBe(129000); // 10750 * 12
    });
  });

  // 3. Discount Calculator
  describe('discount-calculator', () => {
    it('computes standard discount with tax (Retail benchmark)', () => {
      // Source: $100 with 20% discount and 8% tax
      // Discount = $20, Pre-tax = $80, Tax = $6.40, Total = $86.40
      const res = computeDiscountLogic({
        mode: 'standard',
        originalPrice: 100,
        discountPct: 20,
        taxPct: 8,
      });
      expect(res.totalDiscountAmount).toBe(20);
      expect(res.finalPriceBeforeTax).toBe(80);
      expect(res.taxAmount).toBe(6.4);
      expect(res.finalPriceWithTax).toBe(86.4);
    });

    it('computes reverse discount and double successive discount', () => {
      // Reverse: $100 to $75 -> 25%
      const rev = computeDiscountLogic({
        mode: 'reverse',
        originalPrice: 100,
        finalPriceInput: 75,
      });
      expect(rev.effectiveDiscountPct).toBe(25);

      // Double: 20% then 10% -> 100 * 0.8 * 0.9 = 72 -> 28% effective
      const dbl = computeDiscountLogic({
        mode: 'double',
        originalPrice: 100,
        discountPct: 20,
        secondDiscountPct: 10,
      });
      expect(dbl.finalPriceBeforeTax).toBe(72);
      expect(dbl.effectiveDiscountPct).toBe(28);
    });
  });

  // 4. XIRR Calculator
  describe('xirr-calculator', () => {
    it('calculates XIRR matching Microsoft Excel XIRR formula', () => {
      // Source: Microsoft Excel =XIRR({-10000, 11000}, {"2023-01-01", "2024-01-01"}) -> 10.00%
      const out = runCompute(xirrConfig, {
        cashFlows: [
          { date: '2023-01-01', amount: -10000 },
          { date: '2024-01-01', amount: 11000 },
        ],
      });
      expectClose(out.xirrPct, 10.0, 0.1);
      expect(out.totalInvested).toBe(10000);
      expect(out.totalReceived).toBe(11000);
    });

    it('supports CSV pasted cash flows', () => {
      const csv = `2023-01-01, -50000\n2023-07-01, -50000\n2024-01-01, 115000`;
      const out = runCompute(xirrConfig, {
        csvPaste: csv,
      });
      expect(out.totalInvested).toBe(100000);
      expect(out.totalReceived).toBe(115000);
      expect(out.xirrPct).toBeGreaterThan(10);
    });
  });

  // 5. Personal Loan EMI Calculator
  describe('personal-loan-emi-calculator', () => {
    it('calculates personal loan EMI and processing fee (SBI / HDFC benchmark)', () => {
      // Source: SBI personal loan formula 500,000 at 13.5% for 3 years
      // EMI = 16,967.64; Fee 1.5% = 7,500
      const out = runCompute(personalLoanConfig, {
        principal: 500000,
        rate: 13.5,
        tenureType: 'years',
        tenureValue: 3,
        processingFeePct: 1.5,
      });
      expectClose(out.monthlyEmi, 16967.64, 0.1);
      expect(out.processingFeeAmount).toBe(7500);
      expect(out.totalCostWithFees).toBeGreaterThan(600000);
    });

    it('supports tenure in months toggle', () => {
      const out = runCompute(personalLoanConfig, {
        principal: 100000,
        rate: 12,
        tenureType: 'months',
        tenureValue: 12,
        processingFeePct: 0,
      });
      expectClose(out.monthlyEmi, 8884.88, 0.1);
    });
  });

  // 6. GST Calculator
  describe('gst-calculator', () => {
    it('computes adding GST with intra-state CGST + SGST split (CBIC rules)', () => {
      // Source: CBIC statutory GST rules. 10,000 at 18% -> GST 1800 (900 CGST, 900 SGST)
      const res = computeGst({
        amount: 10000,
        ratePct: 18,
        mode: 'add',
        supplyType: 'intra',
      });
      expect(res.netAmount).toBe(10000);
      expect(res.gstAmount).toBe(1800);
      expect(res.grossAmount).toBe(11800);
      expect(res.cgst).toBe(900);
      expect(res.sgst).toBe(900);
    });

    it('removes GST from inclusive gross amount (Reverse calculation)', () => {
      // Source: Inclusive price 11,800 at 18% -> Net = 10,000, GST = 1,800
      const res = computeGst({
        amount: 11800,
        ratePct: 18,
        mode: 'remove',
        supplyType: 'inter',
      });
      expect(res.netAmount).toBe(10000);
      expect(res.gstAmount).toBe(1800);
      expect(res.igst).toBe(1800);
    });
  });

  // 7. Daily SIP Calculator
  describe('daily-sip-calculator', () => {
    it('calculates daily compounding micro-SIP (Fintech benchmark)', () => {
      // 100/day for 1 year (365 days) at 12%
      const out = runCompute(dailySipConfig, {
        dailyAmount: 100,
        expectedReturnPct: 12,
        years: 1,
        daysPerYear: 365,
      });
      expect(out.totalInvested).toBe(36500);
      expect(out.maturityValue).toBeGreaterThan(38500);
      expect(out.totalDays).toBe(365);
    });

    it('handles 260 trading days per year option', () => {
      const out = runCompute(dailySipConfig, {
        dailyAmount: 500,
        expectedReturnPct: 10,
        years: 3,
        daysPerYear: 260,
      });
      expect(out.totalInvested).toBe(500 * 260 * 3);
      expect(out.totalDays).toBe(780);
    });
  });

  // 8. Lot Size Calculator
  describe('lot-size-calculator', () => {
    it('calculates EUR/USD forex position size (BabyPips benchmark)', () => {
      // Source: BabyPips Position Size Calculator benchmark
      // Balance: $10,000, 1% risk = $100. Stop Loss: 25 pips. EUR/USD pip value: $10/lot
      // standardLots = 100 / (25 * 10) = 0.40 standard lots (40,000 units)
      const res = calculateLotSize({
        accountBalance: 10000,
        riskPct: 1,
        stopLossPips: 25,
        pipValuePerStandardLot: 10,
      });
      expect(res.riskAmount).toBe(100);
      expect(res.standardLots).toBe(0.4);
      expect(res.units).toBe(40000);
      expect(res.miniLots).toBe(4);
    });

    it('calculates position size for high risk setup', () => {
      const res = calculateLotSize({
        accountBalance: 5000,
        riskPct: 2, // $100
        stopLossPips: 50,
        pipValuePerStandardLot: 10,
      });
      expect(res.standardLots).toBe(0.2);
      expect(res.units).toBe(20000);
    });
  });

  // 9. Car Loan EMI Calculator
  describe('car-loan-emi-calculator', () => {
    it('calculates car loan with down payment (BankBazaar benchmark)', () => {
      // Source: Car price 1,200,000, Down payment 200,000 -> Loan 1,000,000 at 8.8% for 5 years
      // EMI = 20,661.16; Total interest ≈ 239,669.60
      const out = runCompute(carLoanConfig, {
        carPrice: 1200000,
        downPayment: 200000,
        rate: 8.8,
        tenureYears: 5,
      });
      expect(out.loanAmount).toBe(1000000);
      expectClose(out.monthlyEmi, 20661.16, 0.5);
      expect(out.totalCarCost).toBeGreaterThan(1400000);
    });

    it('handles zero down payment car financing', () => {
      const out = runCompute(carLoanConfig, {
        carPrice: 800000,
        downPayment: 0,
        rate: 9,
        tenureYears: 3,
      });
      expect(out.loanAmount).toBe(800000);
      expect(out.monthlyEmi).toBeGreaterThan(25000);
    });
  });

  // 10. Calculadora de Investimentos (pt-BR)
  describe('calculadora-de-investimentos', () => {
    it('calculates Brazilian fixed income with CDI and IR regressivo (Tesouro Direto / Valor Investe benchmark)', () => {
      // Source: Brazilian Income Tax Regressive Table (Lei 11.033/2004)
      // Aporte inicial 5.000, mensal 500, prazo 36 meses (3 anos, IR 15%), taxa 13.15% a.a.
      const res = calculateInvestimentoBrasil({
        aporteInicial: 5000,
        aporteMensal: 500,
        taxa: 13.15,
        tipoTaxa: 'aa',
        prazoMeses: 36,
        aplicarIr: true,
      });
      expect(res.totalAportado).toBe(23000); // 5000 + 36*500
      expect(res.saldoBruto).toBeGreaterThan(28000);
      expect(res.aliquotaIr).toBe(15);
      expect(res.valorIr).toBeGreaterThan(0);
      expect(res.saldoLiquido).toBeLessThan(res.saldoBruto);
    });

    it('applies 22.5% IR rate for short term investments (<= 180 days)', () => {
      const res = calculateInvestimentoBrasil({
        aporteInicial: 10000,
        aporteMensal: 0,
        taxa: 12,
        tipoTaxa: 'aa',
        prazoMeses: 6,
        aplicarIr: true,
      });
      expect(res.aliquotaIr).toBe(22.5);
    });
  });

  // 11. Home Loan Calculator
  describe('home-loan-calculator', () => {
    it('computes home loan amortization and tenure savings with prepayments (HDFC benchmark)', () => {
      // Loan: 4,000,000 at 8.5% for 20 years
      // Without prepay EMI = 34,713.06
      const baseOut = runCompute(homeLoanConfig, {
        principal: 4000000,
        rate: 8.5,
        tenureYears: 20,
        monthlyPrepayment: 0,
      });
      expectClose(baseOut.monthlyEmi, 34713.06, 0.5);

      // With 5,000/mo prepayment -> saves years and interest
      const prepayOut = runCompute(homeLoanConfig, {
        principal: 4000000,
        rate: 8.5,
        tenureYears: 20,
        monthlyPrepayment: 5000,
      });
      expect(prepayOut.interestSaved).toBeGreaterThan(500000);
      expect(prepayOut.monthsSaved).not.toBe('0 months');
    });

    it('calculates lump-sum annual prepayment impact', () => {
      const out = runCompute(homeLoanConfig, {
        principal: 2000000,
        rate: 9,
        tenureYears: 15,
        monthlyPrepayment: 0,
        yearlyPrepayment: 50000,
      });
      expect(out.interestSaved).toBeGreaterThan(100000);
    });
  });

  // 12. SIP Calculator
  describe('sip', () => {
    it('calculates standard mutual fund SIP returns (AMFI benchmark)', () => {
      // Source: AMFI India benchmark: 5,000/mo at 12% for 10 years -> invested 600,000, maturity ≈ 1,161,695.38
      const out = runCompute(sipConfig, {
        monthlyAmount: 5000,
        expectedReturnPct: 12,
        years: 10,
        stepUpPct: 0,
      });
      expect(out.totalInvested).toBe(600000);
      expectClose(out.maturityValue, 1161695.38, 5);
    });

    it('supports annual step-up SIP', () => {
      const out = runCompute(sipConfig, {
        monthlyAmount: 10000,
        expectedReturnPct: 12,
        years: 5,
        stepUpPct: 10,
      });
      expect(out.totalInvested).toBeGreaterThan(600000);
      expect(out.maturityValue).toBeGreaterThan(800000);
    });
  });

  // 13. SCSS Calculator
  describe('scss-calculator', () => {
    it('calculates quarterly interest under Post Office rules (India Post benchmark)', () => {
      // Source: India Post SCSS rules. 1,500,000 at 8.2% for 5 years
      // Annual interest = 123,000; Quarterly payout = 30,750; Monthly equivalent = 10,250
      const res = calculateScss({
        deposit: 1500000,
        ratePct: 8.2,
        tenureYears: 5,
      });
      expect(res.quarterlyPayout).toBe(30750);
      expect(res.monthlyEquivalent).toBe(10250);
      expect(res.totalInterest).toBe(615000);
      expect(res.totalMaturityWithPrincipal).toBe(2115000);
    });

    it('enforces maximum statutory ceiling of ₹30 Lakhs', () => {
      const res = calculateScss({
        deposit: 5000000, // exceeds 30L ceiling
        ratePct: 8.2,
      });
      expect(res.deposit).toBe(3000000);
      expect(res.quarterlyPayout).toBe(6150000 / 100);
    });
  });

  // 14. Cash Calculator
  describe('cash-calculator', () => {
    it('tallies currency note counts and Indian number words', () => {
      // 10x500 (5000) + 5x200 (1000) + 15x100 (1500) + 50 coins = 7550
      const out = runCompute(cashConfig, {
        n500: 10,
        n200: 5,
        n100: 15,
        coins: 50,
      });
      expect(out.totalCash).toBe(7550);
      expect(out.totalNotes).toBe(30);
      expect(out.inWords).toContain('Seven Thousand Five Hundred and Fifty Rupees Only');
    });

    it('correctly converts Lakhs and Crores to Indian words', () => {
      expect(numberToIndianWords(100000)).toBe('One Lakh Rupees Only');
      expect(numberToIndianWords(25000000)).toBe('Two Crore Fifty Lakh Rupees Only');
    });
  });

  // 15. Reducing EMI Calculator
  describe('reducing-emi-calculator', () => {
    it('compares reducing vs flat rate loan (Fair lending transparency)', () => {
      // 500,000 at 12% flat vs reducing for 3 years
      // Flat interest = 500000 * 0.12 * 3 = 180,000; Flat EMI = 680,000 / 36 = 18,888.89
      // Reducing EMI = 16,607.15; Effective reducing rate ≈ 21.5%
      const out = runCompute(reducingEmiConfig, {
        principal: 500000,
        rate: 12,
        tenureYears: 3,
      });
      expectClose(out.reducingMonthlyEmi, 16607.15, 0.5);
      expect(out.flatMonthlyEmi).toBe(18888.89);
      expect(out.effectiveReducingRate).toBeGreaterThan(20);
      expect(out.interestDifference).toBeGreaterThan(50000);
    });

    it('works for short term loans', () => {
      const out = runCompute(reducingEmiConfig, {
        principal: 100000,
        rate: 10,
        tenureYears: 1,
      });
      expect(out.effectiveReducingRate).toBeGreaterThan(17);
    });
  });

  // 16. Canonical EMI Calculator
  describe('emi-calculator', () => {
    it('calculates canonical EMI loan 1,000,000 at 10% for 20 years = 9,650.22', () => {
      // Source: Core benchmark requirement
      const out = runCompute(emiConfig, {
        principal: 1000000,
        rate: 10,
        tenureType: 'years',
        tenure: 20,
      });
      expect(out.monthlyEmi).toBe(9650.22);
      expect(out.totalPrincipal).toBe(1000000);
      expectClose(out.totalPayment, 2316050.03, 1);
      expectClose(out.totalInterest, 1316050.03, 1);
    });

    it('supports tenure in months toggle', () => {
      const out = runCompute(emiConfig, {
        principal: 500000,
        rate: 8.5,
        tenureType: 'months',
        tenure: 120, // 10 years
      });
      expectClose(out.monthlyEmi, 6199.19, 0.1);
    });
  });

  // 17. GPF Calculator
  describe('gpf-calculator', () => {
    it('calculates GPF maturity using monthly progressive interest (Dept of Economic Affairs rules)', () => {
      // Source: Ministry of Finance / Dept of Economic Affairs GPF interest rules (7.1% p.a.)
      const res = calculateGpf({
        monthlySubscription: 10000,
        openingBalance: 200000,
        ratePct: 7.1,
        years: 5,
        yearlyIncreasePct: 0,
      });
      expect(res.totalDeposited).toBe(800000); // 200k + 5*120k
      expect(res.totalInterestEarned).toBeGreaterThan(150000);
      expect(res.maturityCorpus).toBe(res.totalDeposited + res.totalInterestEarned);
    });

    it('handles yearly subscription increments', () => {
      const res = calculateGpf({
        monthlySubscription: 15000,
        openingBalance: 0,
        ratePct: 7.1,
        years: 3,
        yearlyIncreasePct: 10,
      });
      expect(res.yearlyRows[0].monthlyDeposit).toBe(15000);
      expect(res.yearlyRows[1].monthlyDeposit).toBe(16500);
      expect(res.yearlyRows[2].monthlyDeposit).toBe(18150);
    });
  });

  // 18. Gann Square of 9 Calculator
  describe('gann-square-of-9-calculator', () => {
    it('calculates Gann square root support and resistance angles', () => {
      // Price = 100, sqrt(100) = 10
      // +45° (step 0.125): (10 + 0.125)^2 = 10.125^2 = 102.52
      // -45° (step 0.125): (10 - 0.125)^2 = 9.875^2 = 97.52
      const out = runCompute(gannConfig, {
        price: 100,
        step: 0.125,
      });
      expect(out.r1).toBe(102.52);
      expect(out.s1).toBe(97.52);
      expect(out.r2).toBe(105.06); // (10 + 0.25)^2 = 10.25^2 = 105.06
      expect(out.s2).toBe(95.06);  // (10 - 0.25)^2 = 9.75^2 = 95.06
      expect(out.notice).toContain('educational');
    });

    it('generates full 17-level angle table', () => {
      const levels = calculateGannSquareOf9(100, 0.125);
      expect(levels.length).toBe(17); // -8 to +8
      const center = levels.find((l) => l.n === 0);
      expect(center?.targetPrice).toBe(100);
    });
  });

  // 19. Mortgage Loan Calculator
  describe('mortgage-loan-calculator', () => {
    it('calculates US 30-year fixed mortgage with PITI and PMI exemption (Bankrate benchmark)', () => {
      // Source: Bankrate US Mortgage Calculator benchmark
      // Home: $400,000, 20% down ($80,000), Loan: $320,000, Rate: 6.5% for 30 years
      // Monthly P&I = $2,022.61; Property tax (1.2%) = $400/mo; Insurance = $100/mo; PMI = $0
      // Total PITI = $2,522.61
      const res = calculateMortgage({
        homePrice: 400000,
        downPaymentValue: 20,
        downPaymentMode: 'percent',
        ratePct: 6.5,
        termYears: 30,
        propertyTaxAnnualRatePct: 1.2,
        homeInsuranceAnnual: 1200,
        hoaMonthly: 0,
      });
      expectClose(res.monthlyPi, 2022.61, 0.1);
      expect(res.monthlyPropertyTax).toBe(400);
      expect(res.monthlyHomeInsurance).toBe(100);
      expect(res.monthlyPmi).toBe(0);
      expectClose(res.monthlyTotalPiti, 2522.61, 0.1);
    });

    it('applies PMI when down payment is less than 20% (LTV > 80%)', () => {
      // $300,000 with 10% down -> Loan $270,000 (LTV 90%) -> PMI applies
      const res = calculateMortgage({
        homePrice: 300000,
        downPaymentValue: 10,
        downPaymentMode: 'percent',
        ratePct: 7,
        termYears: 30,
        pmiRatePct: 0.5,
      });
      expect(res.monthlyPmi).toBeGreaterThan(0);
      expect(res.monthlyTotalPiti).toBeGreaterThan(res.monthlyPi);
    });
  });

  // 20. Compound Interest Calculator
  describe('compound-interest-calculator', () => {
    it('calculates compound interest matching SEC / Investor.gov benchmark', () => {
      // Source: Investor.gov compound interest calculator
      // $10,000 at 7.5% annual compounding for 10 years without extra contribution
      // FV = 10000 * 1.075^10 = 20,610.32
      const out = runCompute(compoundConfig, {
        principal: 10000,
        ratePct: 7.5,
        years: 10,
        frequency: 'annual',
        monthlyContribution: 0,
      });
      expectClose(out.futureValue, 20610.32, 1);
      expect(out.totalDeposits).toBe(10000);
      expect(out.totalInterestEarned).toBeGreaterThan(10000);
    });

    it('calculates compound interest with ongoing monthly additions', () => {
      const out = runCompute(compoundConfig, {
        principal: 10000,
        ratePct: 8,
        years: 5,
        frequency: 'monthly',
        monthlyContribution: 500,
      });
      expect(out.totalDeposits).toBe(40000); // 10k + 60*500
      expect(out.futureValue).toBeGreaterThan(50000);
    });
  });

  // 21. Lump Sum Amount Calculator
  describe('lump-sum-amount', () => {
    it('calculates lump sum maturity and inflation purchasing power erosion', () => {
      // Source: Standard compound return formula P*(1+r)^t
      // 500,000 at 12% for 10 years -> 500000 * 1.12^10 = 1,552,924.10
      // Real value at 6% inflation = 1552924.10 / 1.06^10 = 867,143.68
      const out = runCompute(lumpSumConfig, {
        principal: 500000,
        returnPct: 12,
        years: 10,
        compounding: 'annual',
        inflationPct: 6,
      });
      expectClose(out.futureValue, 1552924.1, 1);
      expectClose(out.realPurchasingPower, 867144.71, 1);
      expect(out.totalGain).toBeGreaterThan(1000000);
      expect(out.inflationLoss).toBeGreaterThan(600000);
    });

    it('calculates conservative lump sum deposit over 5 years', () => {
      const out = runCompute(lumpSumConfig, {
        principal: 100000,
        returnPct: 10,
        years: 5,
        compounding: 'annual',
        inflationPct: 0,
      });
      expectClose(out.futureValue, 161051, 1);
      expect(out.realPurchasingPower).toBe(out.futureValue);
    });
  });
});
