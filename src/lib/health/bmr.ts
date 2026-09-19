import { roundHalfAwayFromZero } from '../engine/math';

export type Gender = 'male' | 'female';
export type BmrFormula = 'mifflin' | 'harris_benedict' | 'katch_mcardle';

export interface BmrParams {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  bodyFatPct?: number;
  formula?: BmrFormula;
}

export function calculateMifflinStJeor(gender: Gender, weightKg: number, heightCm: number, ageYears: number): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return roundHalfAwayFromZero(bmr, 0);
}

export function calculateHarrisBenedict(gender: Gender, weightKg: number, heightCm: number, ageYears: number): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return 0;
  let bmr = 0;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageYears);
  } else {
    bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageYears);
  }
  return roundHalfAwayFromZero(bmr, 0);
}

export function calculateKatchMcArdle(weightKg: number, bodyFatPct: number): number {
  if (weightKg <= 0 || bodyFatPct < 0 || bodyFatPct >= 100) return 0;
  const leanMassKg = weightKg * (1 - bodyFatPct / 100);
  const bmr = 370 + 21.6 * leanMassKg;
  return roundHalfAwayFromZero(bmr, 0);
}

export function calculateBmr(params: BmrParams): number {
  const formula = params.formula || 'mifflin';
  if (formula === 'katch_mcardle' && params.bodyFatPct !== undefined && params.bodyFatPct > 0) {
    return calculateKatchMcArdle(params.weightKg, params.bodyFatPct);
  }
  if (formula === 'harris_benedict') {
    return calculateHarrisBenedict(params.gender, params.weightKg, params.heightCm, params.ageYears);
  }
  return calculateMifflinStJeor(params.gender, params.weightKg, params.heightCm, params.ageYears);
}
