import { roundHalfAwayFromZero } from '../engine/math';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

export interface CaloricTargets {
  maintenance: number;
  mildLoss: number;
  weightLoss: number;
  extremeLoss: number;
  mildGain: number;
  weightGain: number;
}

export function calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return roundHalfAwayFromZero(bmr * multiplier, 0);
}

export function getCaloricTargets(tdee: number): CaloricTargets {
  return {
    maintenance: tdee,
    mildLoss: Math.max(1200, tdee - 250),
    weightLoss: Math.max(1200, tdee - 500),
    extremeLoss: Math.max(1000, tdee - 1000),
    mildGain: tdee + 250,
    weightGain: tdee + 500
  };
}
