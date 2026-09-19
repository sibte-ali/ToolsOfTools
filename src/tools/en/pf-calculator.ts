import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import ratesData from '../../data/rates.json';

export interface PfYearlyRow {
  year: number;
  age: number;
  monthlySalary: number;
  employeeContribYear: number;
  employerEpfYear: number;
  interestEarnedYear: number;
  closingBalance: number;
}

export function calculatePf(params: {
  monthlyBasicAndDa: number;
  employeePct?: number;
  employerPct?: number;
  currentAge: number;
  retirementAge: number;
  annualHikePct?: number;
  currentBalance?: number;
  epfRatePct?: number;
}) {
  const {
    monthlyBasicAndDa,
    employeePct = ratesData.epf.statutory_employee_rate,
    employerPct = 12,
    currentAge,
    retirementAge,
    annualHikePct = 5,
    currentBalance = 0,
    epfRatePct = ratesData.epf.rate,
  } = params;

  const totalYears = Math.max(1, retirementAge - currentAge);
  const monthlyRate = epfRatePct / 12 / 100;
  const epsCeiling = ratesData.epf.eps_wage_ceiling; // 15,000

  let balance = currentBalance;
  let currentSalary = monthlyBasicAndDa;
  let totalEmployeeContrib = 0;
  let totalEmployerEpfContrib = 0;
  let totalInterest = 0;

  const yearlyRows: PfYearlyRow[] = [];

  for (let yr = 1; yr <= totalYears; yr++) {
    const age = currentAge + yr;
    let employeeYear = 0;
    let employerYear = 0;
    let interestYear = 0;

    // Monthly basic & contributions
    const monthlyEmployee = roundHalfAwayFromZero((currentSalary * employeePct) / 100, 2);
    
    // EPS contribution = 8.33% capped at 15000 wage (statutory max 1250)
    const epsWage = Math.min(currentSalary, epsCeiling);
    const epsAmount =
      epsWage >= epsCeiling
        ? 1250
        : roundHalfAwayFromZero((epsWage * 8.33333333) / 100, 2);
    const totalEmployerShare = roundHalfAwayFromZero((currentSalary * employerPct) / 100, 2);
    const monthlyEmployerEpf = Math.max(0, roundHalfAwayFromZero(totalEmployerShare - epsAmount, 2));

    for (let m = 1; m <= 12; m++) {
      balance += monthlyEmployee + monthlyEmployerEpf;
      employeeYear += monthlyEmployee;
      employerYear += monthlyEmployerEpf;

      const monthlyInterest = roundHalfAwayFromZero(balance * monthlyRate, 2);
      balance += monthlyInterest;
      interestYear += monthlyInterest;
    }

    totalEmployeeContrib += employeeYear;
    totalEmployerEpfContrib += employerYear;
    totalInterest += interestYear;

    yearlyRows.push({
      year: yr,
      age,
      monthlySalary: roundHalfAwayFromZero(currentSalary, 2),
      employeeContribYear: roundHalfAwayFromZero(employeeYear, 2),
      employerEpfYear: roundHalfAwayFromZero(employerYear, 2),
      interestEarnedYear: roundHalfAwayFromZero(interestYear, 2),
      closingBalance: roundHalfAwayFromZero(balance, 2),
    });

    // Salary hike for next year
    currentSalary = roundHalfAwayFromZero(currentSalary * (1 + annualHikePct / 100), 2);
  }

  const finalCorpus = roundHalfAwayFromZero(balance, 2);
  const totalOwn = roundHalfAwayFromZero(currentBalance + totalEmployeeContrib, 2);
  const totalEmployer = roundHalfAwayFromZero(totalEmployerEpfContrib, 2);
  const totalInterestEarned = roundHalfAwayFromZero(totalInterest, 2);

  return {
    finalCorpus,
    totalOwn,
    totalEmployer,
    totalInterestEarned,
    yearlyRows,
  };
}

export const config: ToolConfig = {
  id: 'pf-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'monthlyBasicAndDa',
      label: 'Monthly Basic + DA Salary',
      type: 'number',
      min: 1000,
      max: 2000000,
      step: 1000,
      default: 50000,
      unit: '₹',
      help: 'Your basic monthly pay plus dearness allowance',
    },
    {
      key: 'currentAge',
      label: 'Current Age',
      type: 'number',
      min: 18,
      max: 60,
      step: 1,
      default: 28,
      unit: 'yrs',
    },
    {
      key: 'retirementAge',
      label: 'Retirement Age',
      type: 'number',
      min: 40,
      max: 70,
      step: 1,
      default: 58,
      unit: 'yrs',
    },
    {
      key: 'annualHikePct',
      label: 'Annual Salary Hike (%)',
      type: 'number',
      min: 0,
      max: 25,
      step: 0.5,
      default: 5,
      unit: '%',
    },
    {
      key: 'currentBalance',
      label: 'Current EPF Balance',
      type: 'number',
      min: 0,
      max: 50000000,
      step: 10000,
      default: 100000,
      unit: '₹',
    },
    {
      key: 'epfRatePct',
      label: 'EPF Interest Rate (% p.a.)',
      type: 'number',
      min: 5,
      max: 15,
      step: 0.05,
      default: ratesData.epf.rate,
      unit: '%',
      help: `Default ${ratesData.epf.rate}% as notified by EPFO for FY ${ratesData.epf.effective_financial_year}`,
    },
    {
      key: 'employeePct',
      label: 'Employee Contribution (%)',
      type: 'number',
      min: 10,
      max: 20,
      step: 1,
      default: 12,
      unit: '%',
    },
    {
      key: 'employerPct',
      label: 'Employer Contribution (%)',
      type: 'number',
      min: 10,
      max: 20,
      step: 1,
      default: 12,
      unit: '%',
    },
  ],
  outputs: [
    {
      key: 'finalCorpus',
      label: 'Total Accumulated EPF Corpus',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalOwn',
      label: 'Your Total Contribution',
      format: 'currency',
    },
    {
      key: 'totalEmployer',
      label: "Employer's EPF Contribution",
      format: 'currency',
    },
    {
      key: 'totalInterestEarned',
      label: 'Total Interest Earned',
      format: 'currency',
    },
  ],
  compute(values) {
    const res = calculatePf({
      monthlyBasicAndDa: Number(values.monthlyBasicAndDa) || 50000,
      currentAge: Number(values.currentAge) || 28,
      retirementAge: Number(values.retirementAge) || 58,
      annualHikePct: Number(values.annualHikePct) ?? 5,
      currentBalance: Number(values.currentBalance) || 0,
      epfRatePct: Number(values.epfRatePct) || ratesData.epf.rate,
      employeePct: Number(values.employeePct) || 12,
      employerPct: Number(values.employerPct) || 12,
    });

    const labels = res.yearlyRows.map((r) => `Age ${r.age}`);
    const corpusValues = res.yearlyRows.map((r) => r.closingBalance);
    const interestValues = res.yearlyRows.map((r) => r.interestEarnedYear);

    return {
      finalCorpus: res.finalCorpus,
      totalOwn: res.totalOwn,
      totalEmployer: res.totalEmployer,
      totalInterestEarned: res.totalInterestEarned,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'EPF Corpus', color: '#059669', values: corpusValues },
          { name: 'Annual Interest', color: '#d97706', values: interestValues },
        ],
      },
    };
  },
  table(values) {
    const res = calculatePf({
      monthlyBasicAndDa: Number(values.monthlyBasicAndDa) || 50000,
      currentAge: Number(values.currentAge) || 28,
      retirementAge: Number(values.retirementAge) || 58,
      annualHikePct: Number(values.annualHikePct) ?? 5,
      currentBalance: Number(values.currentBalance) || 0,
      epfRatePct: Number(values.epfRatePct) || ratesData.epf.rate,
      employeePct: Number(values.employeePct) || 12,
      employerPct: Number(values.employerPct) || 12,
    });

    return {
      columns: [
        { key: 'year', label: 'Year', format: 'number' },
        { key: 'age', label: 'Age', format: 'number' },
        { key: 'monthlySalary', label: 'Basic + DA', format: 'currency' },
        { key: 'employeeContribYear', label: 'Employee Share', format: 'currency' },
        { key: 'employerEpfYear', label: 'Employer Share', format: 'currency' },
        { key: 'interestEarnedYear', label: 'Interest', format: 'currency' },
        { key: 'closingBalance', label: 'Closing Balance', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
