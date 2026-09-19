import { roundHalfAwayFromZero } from '../engine/math';

export interface MacroGrams {
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  proteinKcal: number;
  carbKcal: number;
  fatKcal: number;
}

export interface MealMacroSplit {
  mealNumber: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  calories: number;
}

export type MacroGoal = 'balanced' | 'low_carb' | 'high_protein' | 'keto';

export function calculateMacrosByPercentages(
  totalCalories: number,
  proteinPct = 30,
  carbPct = 40,
  fatPct = 30
): MacroGrams {
  if (totalCalories <= 0) {
    return { proteinGrams: 0, carbGrams: 0, fatGrams: 0, proteinKcal: 0, carbKcal: 0, fatKcal: 0 };
  }

  const proteinKcal = (totalCalories * proteinPct) / 100;
  const carbKcal = (totalCalories * carbPct) / 100;
  const fatKcal = (totalCalories * fatPct) / 100;

  return {
    proteinGrams: roundHalfAwayFromZero(proteinKcal / 4, 1),
    carbGrams: roundHalfAwayFromZero(carbKcal / 4, 1),
    fatGrams: roundHalfAwayFromZero(fatKcal / 9, 1),
    proteinKcal: roundHalfAwayFromZero(proteinKcal, 0),
    carbKcal: roundHalfAwayFromZero(carbKcal, 0),
    fatKcal: roundHalfAwayFromZero(fatKcal, 0)
  };
}

export function calculateBodyweightMacros(
  totalCalories: number,
  weightKg: number,
  proteinGramsPerKg = 2.0,
  fatPct = 25
): MacroGrams {
  if (totalCalories <= 0 || weightKg <= 0) {
    return { proteinGrams: 0, carbGrams: 0, fatGrams: 0, proteinKcal: 0, carbKcal: 0, fatKcal: 0 };
  }

  // Protein grams based on body weight
  const proteinGrams = roundHalfAwayFromZero(weightKg * proteinGramsPerKg, 1);
  const proteinKcal = proteinGrams * 4;

  // Fat based on percentage of total calories
  const fatKcal = (totalCalories * fatPct) / 100;
  const fatGrams = roundHalfAwayFromZero(fatKcal / 9, 1);

  // Carbohydrates fill the remainder
  const remainingKcal = Math.max(0, totalCalories - proteinKcal - fatKcal);
  const carbGrams = roundHalfAwayFromZero(remainingKcal / 4, 1);

  return {
    proteinGrams,
    carbGrams,
    fatGrams,
    proteinKcal: roundHalfAwayFromZero(proteinKcal, 0),
    carbKcal: roundHalfAwayFromZero(remainingKcal, 0),
    fatKcal: roundHalfAwayFromZero(fatKcal, 0)
  };
}

export function splitMacrosAcrossMeals(macros: MacroGrams, mealsCount = 3): MealMacroSplit[] {
  if (mealsCount <= 0) return [];
  const meals: MealMacroSplit[] = [];
  const pPerMeal = roundHalfAwayFromZero(macros.proteinGrams / mealsCount, 1);
  const cPerMeal = roundHalfAwayFromZero(macros.carbGrams / mealsCount, 1);
  const fPerMeal = roundHalfAwayFromZero(macros.fatGrams / mealsCount, 1);
  const calPerMeal = roundHalfAwayFromZero((macros.proteinKcal + macros.carbKcal + macros.fatKcal) / mealsCount, 0);

  for (let i = 1; i <= mealsCount; i++) {
    meals.push({
      mealNumber: i,
      proteinGrams: pPerMeal,
      carbGrams: cPerMeal,
      fatGrams: fPerMeal,
      calories: calPerMeal
    });
  }
  return meals;
}
