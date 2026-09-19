import { describe, it, expect } from 'vitest';
import { calculateBmi, calculateBmiImperial, getBmiCategory, getHealthyWeightRange } from './bmi';
import { calculateMifflinStJeor, calculateHarrisBenedict, calculateKatchMcArdle } from './bmr';
import { calculateTdee, getCaloricTargets } from './tdee';
import { calculateMacrosByPercentages, calculateBodyweightMacros, splitMacrosAcrossMeals } from './macros';
import { calculatePace, predictRaceTimes, generateSplits } from './pace';
import { calculateCaloriesBurned, calculateBurnEquivalents } from './met';

describe('Shared Health Calculations', () => {
  describe('BMI', () => {
    it('calculates standard metric BMI and categories', () => {
      // 70 kg, 175 cm -> 70 / (1.75^2) = 70 / 3.0625 = 22.857 -> 22.9
      const bmi = calculateBmi(70, 175);
      expect(bmi).toBe(22.9);
      const cat = getBmiCategory(bmi);
      expect(cat.category).toBe('Normal weight');

      // Asian cutoffs: 23.0 is overweight
      const asianCat = getBmiCategory(23.5, true);
      expect(asianCat.category).toBe('Overweight (Increased Risk)');
    });

    it('calculates imperial BMI', () => {
      // 154 lb, 69 in -> (703 * 154) / (69^2) = 108262 / 4761 = 22.739 -> 22.7
      const bmi = calculateBmiImperial(154, 69);
      expect(bmi).toBe(22.7);
    });

    it('determines healthy weight range for height', () => {
      // 180 cm -> 1.8m^2 = 3.24. 18.5 * 3.24 = 59.94 -> 59.9 kg. 24.9 * 3.24 = 80.676 -> 80.7 kg.
      const range = getHealthyWeightRange(180);
      expect(range.minKg).toBe(59.9);
      expect(range.maxKg).toBe(80.7);
    });
  });

  describe('BMR & TDEE', () => {
    it('calculates Mifflin-St Jeor accurately', () => {
      // Male, 80kg, 180cm, 30yo: 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780 kcal
      const maleBmr = calculateMifflinStJeor('male', 80, 180, 30);
      expect(maleBmr).toBe(1780);

      // Female, 60kg, 165cm, 28yo: 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25 -> 1330 kcal
      const femaleBmr = calculateMifflinStJeor('female', 60, 165, 28);
      expect(femaleBmr).toBe(1330);
    });

    it('calculates revised Harris-Benedict accurately', () => {
      // Male: 88.362 + (13.397*80) + (4.799*180) - (5.677*30) = 88.362 + 1071.76 + 863.82 - 170.31 = 1853.632 -> 1854 kcal
      const bmr = calculateHarrisBenedict('male', 80, 180, 30);
      expect(bmr).toBe(1854);
    });

    it('calculates Katch-McArdle from lean body mass', () => {
      // 80kg with 15% bodyfat -> LBM = 80 * 0.85 = 68 kg. BMR = 370 + 21.6 * 68 = 370 + 1468.8 = 1838.8 -> 1839 kcal
      const bmr = calculateKatchMcArdle(80, 15);
      expect(bmr).toBe(1839);
    });

    it('calculates TDEE and targets', () => {
      // BMR 1780 * moderate (1.55) = 2759 kcal
      const tdee = calculateTdee(1780, 'moderate');
      expect(tdee).toBe(2759);

      const targets = getCaloricTargets(tdee);
      expect(targets.maintenance).toBe(2759);
      expect(targets.weightLoss).toBe(2259);
      expect(targets.weightGain).toBe(3259);
    });
  });

  describe('Macros', () => {
    it('calculates macros by percentage', () => {
      // 2000 kcal: 30% P (600 kcal / 4 = 150g), 40% C (800 kcal / 4 = 200g), 30% F (600 kcal / 9 = 66.7g)
      const macros = calculateMacrosByPercentages(2000, 30, 40, 30);
      expect(macros.proteinGrams).toBe(150);
      expect(macros.carbGrams).toBe(200);
      expect(macros.fatGrams).toBe(66.7);
    });

    it('calculates athletic bodyweight macros', () => {
      // 2400 kcal, 75kg, 2.0g/kg protein -> 150g protein (600 kcal).
      // 25% fat = 600 kcal / 9 = 66.7g fat.
      // Carbs = (2400 - 600 - 600) / 4 = 1200 / 4 = 300g carbs.
      const macros = calculateBodyweightMacros(2400, 75, 2.0, 25);
      expect(macros.proteinGrams).toBe(150);
      expect(macros.fatGrams).toBe(66.7);
      expect(macros.carbGrams).toBe(300);
    });

    it('splits macros across meals', () => {
      const macros = calculateMacrosByPercentages(2000, 30, 40, 30);
      const meals = splitMacrosAcrossMeals(macros, 4);
      expect(meals.length).toBe(4);
      expect(meals[0].proteinGrams).toBe(37.5);
      expect(meals[0].carbGrams).toBe(50);
    });
  });

  describe('Pace & Running', () => {
    it('computes pace and speed correctly', () => {
      // 10 km in 50 minutes (3000 seconds) -> pace 300 sec/km (5:00/km)
      // speed = 10 / (50/60) = 12.0 km/h
      const p = calculatePace(3000, 10);
      expect(p.paceKmFormatted).toBe('5:00');
      expect(p.speedKmh).toBe(12);
    });

    it('predicts standard race times', () => {
      // 5:00/km pace (300 sec/km)
      // 5K -> 1500s -> 25:00
      // Marathon 42.195 km * 300 = 12658.5s -> 03:30:59
      const predictions = predictRaceTimes(300);
      expect(predictions[0].timeFormatted).toBe('25:00');
      expect(predictions[3].timeFormatted).toBe('03:30:59');
    });

    it('generates km splits', () => {
      const splits = generateSplits(5, 300, 1);
      expect(splits.length).toBe(5);
      expect(splits[0].cumulativeTimeFormatted).toBe('05:00');
      expect(splits[4].cumulativeTimeFormatted).toBe('25:00');
    });
  });

  describe('MET & Caloric Burn', () => {
    it('calculates calories burned from MET', () => {
      // Ainsworth: kcal = MET * weight_kg * hours
      // Running at 10 km/h (MET 9.8) for 70kg person for 45 minutes (0.75h)
      // 9.8 * 70 * 0.75 = 514.5 -> 515 kcal
      const kcal = calculateCaloriesBurned(9.8, 70, 45);
      expect(kcal).toBe(515);
    });

    it('computes food burning equivalents', () => {
      const eq = calculateBurnEquivalents(560, 70);
      // 560 / 280 = 2.0 pizza slices
      expect(eq.pizzaSlices).toBe(2);
      // 560 / 140 = 4.0 cans of soda
      expect(eq.sodaCans).toBe(4);
    });
  });
});
