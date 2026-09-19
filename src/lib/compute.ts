/**
 * Core mathematical compute engines used by interactive widgets and worked examples.
 */

export interface SwpResult {
  totalWithdrawn: number;
  finalBalance: number;
  isExhausted: boolean;
}

export function computeSwp(
  investment: number,
  monthlyWithdrawal: number,
  annualReturnPct: number,
  years: number
): SwpResult {
  const months = years * 12;
  const monthlyRate = annualReturnPct / 100 / 12;
  let balance = investment;
  let totalWithdrawn = 0;
  let isExhausted = false;

  for (let m = 1; m <= months; m++) {
    if (balance <= 0) {
      isExhausted = true;
      break;
    }
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
    totalWithdrawn += monthlyWithdrawal;
    if (balance < 0) {
      balance = 0;
      isExhausted = true;
    }
  }

  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(balance),
    isExhausted,
  };
}

export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
}

export function computeBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Number(rawBmi.toFixed(1));

  let category: BmiResult['category'] = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25.0) category = 'Normal';
  else if (bmi < 30.0) category = 'Overweight';
  else category = 'Obese';

  return { bmi, category };
}

export interface AttendanceResult {
  currentPct: number;
  classesToAttend: number;
  classesCanMiss: number;
}

export function computeAttendance(
  totalHeld: number,
  attended: number,
  targetPct: number = 75
): AttendanceResult {
  const currentPct = Number(((attended / totalHeld) * 100).toFixed(1));
  const p = targetPct;
  const t = totalHeld;
  const a = attended;

  // Formula from spec:
  // classes to attend = ceil((p*t - 100*a) / (100 - p))
  // classes can miss = floor((100*a / p) - t)
  const reqToAttend = Math.max(0, Math.ceil((p * t - 100 * a) / (100 - p)));
  const canMiss = Math.max(0, Math.floor((100 * a) / p - t));

  return {
    currentPct,
    classesToAttend: reqToAttend,
    classesCanMiss: canMiss,
  };
}

export interface DiscountResult {
  finalPrice: number;
  savings: number;
}

export function computeDiscount(price: number, discountPct: number): DiscountResult {
  const savings = Number(((price * discountPct) / 100).toFixed(2));
  const finalPrice = Number((price - savings).toFixed(2));
  return { finalPrice, savings };
}

export interface DateDiffResult {
  days: number;
}

export function computeDaysBetween(startDateStr: string, endDateStr: string): DateDiffResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return { days };
}

export interface PaceResult {
  paceMinutes: number;
  paceSeconds: number;
  formattedPace: string;
}

export function computePace(distanceKm: number, timeMinutes: number): PaceResult {
  const totalSecondsPerKm = (timeMinutes * 60) / distanceKm;
  const paceMinutes = Math.floor(totalSecondsPerKm / 60);
  const paceSeconds = Math.round(totalSecondsPerKm % 60);
  const formattedPace = `${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds} /km`;
  return { paceMinutes, paceSeconds, formattedPace };
}
