import { roundHalfAwayFromZero } from '../engine/math';

export interface BmiCategoryInfo {
  category: string;
  minBmi: number;
  maxBmi: number;
  color: string;
  description: string;
}

export const WHO_BMI_CATEGORIES: BmiCategoryInfo[] = [
  { category: 'Underweight', minBmi: 0, maxBmi: 18.49, color: '#3b82f6', description: 'Body mass is below the standard healthy threshold.' },
  { category: 'Normal weight', minBmi: 18.5, maxBmi: 24.99, color: '#10b981', description: 'Body mass is within the standard healthy range.' },
  { category: 'Overweight', minBmi: 25.0, maxBmi: 29.99, color: '#f59e0b', description: 'Elevated body mass relative to stature.' },
  { category: 'Obesity Class I', minBmi: 30.0, maxBmi: 34.99, color: '#f97316', description: 'Moderate obesity.' },
  { category: 'Obesity Class II', minBmi: 35.0, maxBmi: 39.99, color: '#ef4444', description: 'Severe obesity.' },
  { category: 'Obesity Class III', minBmi: 40.0, maxBmi: 100, color: '#b91c1c', description: 'Very severe or morbid obesity.' }
];

export const ASIAN_BMI_CATEGORIES: BmiCategoryInfo[] = [
  { category: 'Underweight', minBmi: 0, maxBmi: 18.49, color: '#3b82f6', description: 'Below recommended threshold.' },
  { category: 'Normal weight', minBmi: 18.5, maxBmi: 22.99, color: '#10b981', description: 'Optimal weight threshold for Asian populations.' },
  { category: 'Overweight (Increased Risk)', minBmi: 23.0, maxBmi: 27.49, color: '#f59e0b', description: 'Substantially elevated metabolic risk.' },
  { category: 'Obese (High Risk)', minBmi: 27.5, maxBmi: 100, color: '#ef4444', description: 'High cardiometabolic risk.' }
];

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return roundHalfAwayFromZero(weightKg / (heightM * heightM), 1);
}

export function calculateBmiImperial(weightLb: number, heightInches: number): number {
  if (weightLb <= 0 || heightInches <= 0) return 0;
  return roundHalfAwayFromZero((703 * weightLb) / (heightInches * heightInches), 1);
}

export function getBmiCategory(bmi: number, isAsianCutoffs = false): BmiCategoryInfo {
  const categories = isAsianCutoffs ? ASIAN_BMI_CATEGORIES : WHO_BMI_CATEGORIES;
  for (const cat of categories) {
    if (bmi >= cat.minBmi && bmi <= cat.maxBmi) {
      return cat;
    }
  }
  return categories[categories.length - 1];
}

export function getHealthyWeightRange(heightCm: number, isAsianCutoffs = false): { minKg: number; maxKg: number } {
  if (heightCm <= 0) return { minKg: 0, maxKg: 0 };
  const heightM = heightCm / 100;
  const hSq = heightM * heightM;
  const maxBmi = isAsianCutoffs ? 22.9 : 24.9;
  return {
    minKg: roundHalfAwayFromZero(18.5 * hSq, 1),
    maxKg: roundHalfAwayFromZero(maxBmi * hSq, 1)
  };
}

export function kgToLb(kg: number): number {
  return roundHalfAwayFromZero(kg * 2.20462262, 1);
}

export function lbToKg(lb: number): number {
  return roundHalfAwayFromZero(lb / 2.20462262, 1);
}

export function cmToInches(cm: number): number {
  return roundHalfAwayFromZero(cm / 2.54, 1);
}

export function inchesToCm(inches: number): number {
  return roundHalfAwayFromZero(inches * 2.54, 1);
}
