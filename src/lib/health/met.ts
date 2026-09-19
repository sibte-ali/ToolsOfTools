import { roundHalfAwayFromZero } from '../engine/math';
import metsData from '../../data/mets.json';

export interface MetActivity {
  id: string;
  name: string;
  category: string;
  met: number;
  source_url: string;
  last_verified: string;
}

export const ACTIVITIES: MetActivity[] = metsData;

export function getActivityById(id: string): MetActivity | undefined {
  return ACTIVITIES.find(a => a.id === id);
}

export function calculateCaloriesBurned(met: number, weightKg: number, durationMinutes: number): number {
  if (met <= 0 || weightKg <= 0 || durationMinutes <= 0) return 0;
  const hours = durationMinutes / 60;
  const kcal = met * weightKg * hours;
  return roundHalfAwayFromZero(kcal, 0);
}

export interface BurnEquivalents {
  pizzaSlices: number;
  sodaCans: number;
  bananas: number;
  walkingMinutes: number;
}

export function calculateBurnEquivalents(calories: number, weightKg = 70): BurnEquivalents {
  if (calories <= 0) {
    return { pizzaSlices: 0, sodaCans: 0, bananas: 0, walkingMinutes: 0 };
  }

  // 1 slice pepperoni pizza ≈ 280 kcal
  // 1 standard can of cola ≈ 140 kcal
  // 1 medium banana ≈ 105 kcal
  // Walking at 3.5 MET for a person of weightKg: kcal/min = (3.5 * weightKg) / 60
  const walkingKcalPerMin = (3.5 * weightKg) / 60;

  return {
    pizzaSlices: roundHalfAwayFromZero(calories / 280, 1),
    sodaCans: roundHalfAwayFromZero(calories / 140, 1),
    bananas: roundHalfAwayFromZero(calories / 105, 1),
    walkingMinutes: roundHalfAwayFromZero(calories / (walkingKcalPerMin > 0 ? walkingKcalPerMin : 4.0), 0)
  };
}
