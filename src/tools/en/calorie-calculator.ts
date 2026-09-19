import type { ToolConfig } from '../../lib/engine/types';
import { calculateMifflinStJeor, type Gender } from '../../lib/health/bmr';
import { calculateTdee, type ActivityLevel } from '../../lib/health/tdee';
import { calculateBodyweightMacros } from '../../lib/health/macros';
import { lbToKg, inchesToCm } from '../../lib/health/bmi';

export interface CalorieCalcInput {
  unitSystem?: 'metric' | 'imperial';
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: 'maintain' | 'mild_loss' | 'weight_loss' | 'extreme_loss' | 'mild_gain' | 'weight_gain';
}

export function calculateCalories(input: CalorieCalcInput) {
  const isImperial = input.unitSystem === 'imperial';
  const weightKg = isImperial ? lbToKg(input.weight) : input.weight;
  const heightCm = isImperial ? inchesToCm(input.height) : input.height;

  const bmr = calculateMifflinStJeor(input.gender, weightKg, heightCm, input.age);
  const tdee = calculateTdee(bmr, input.activityLevel);

  let targetCalories = tdee;
  let goalLabel = 'Weight Maintenance';

  switch (input.goal) {
    case 'mild_loss':
      targetCalories = Math.max(1200, tdee - 250);
      goalLabel = 'Mild Weight Loss (-0.25 kg / -0.5 lb per week)';
      break;
    case 'weight_loss':
      targetCalories = Math.max(1200, tdee - 500);
      goalLabel = 'Weight Loss (-0.5 kg / -1.0 lb per week)';
      break;
    case 'extreme_loss':
      targetCalories = Math.max(1000, tdee - 1000);
      goalLabel = 'Fast Weight Loss (-1.0 kg / -2.0 lb per week)';
      break;
    case 'mild_gain':
      targetCalories = tdee + 250;
      goalLabel = 'Mild Weight Gain (+0.25 kg / +0.5 lb per week)';
      break;
    case 'weight_gain':
      targetCalories = tdee + 500;
      goalLabel = 'Weight Gain (+0.5 kg / +1.0 lb per week)';
      break;
    default:
      targetCalories = tdee;
      goalLabel = 'Weight Maintenance';
      break;
  }

  // Calculate recommended macronutrient distribution (athletic 2.0g/kg protein, 25% fat, rest carbs)
  const macros = calculateBodyweightMacros(targetCalories, weightKg, 2.0, 25);

  return {
    bmr,
    tdee,
    targetCalories,
    goalLabel,
    proteinGrams: macros.proteinGrams,
    carbGrams: macros.carbGrams,
    fatGrams: macros.fatGrams,
    proteinKcal: macros.proteinKcal,
    carbKcal: macros.carbKcal,
    fatKcal: macros.fatKcal
  };
}

const config: ToolConfig = {
  id: 'calorie-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'unitSystem',
      label: 'Unit System',
      type: 'select',
      default: 'metric',
      options: [
        { label: 'Metric (kg, cm)', value: 'metric' },
        { label: 'Imperial (lb, inches)', value: 'imperial' }
      ]
    },
    {
      key: 'gender',
      label: 'Biological Sex',
      type: 'select',
      default: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number',
      min: 15,
      max: 100,
      step: 1,
      default: 30,
      unit: 'years'
    },
    {
      key: 'weight',
      label: 'Body Weight',
      type: 'number',
      min: 30,
      max: 300,
      step: 0.5,
      default: 75,
      unit: 'kg or lb'
    },
    {
      key: 'height',
      label: 'Height',
      type: 'number',
      min: 100,
      max: 250,
      step: 0.5,
      default: 178,
      unit: 'cm or in'
    },
    {
      key: 'activityLevel',
      label: 'Daily Activity Level',
      type: 'select',
      default: 'moderate',
      options: [
        { label: 'Sedentary (desk job, little or no exercise)', value: 'sedentary' },
        { label: 'Light (light exercise 1–3 days/week)', value: 'light' },
        { label: 'Moderate (moderate exercise 3–5 days/week)', value: 'moderate' },
        { label: 'Active (intense exercise 6–7 days/week)', value: 'active' },
        { label: 'Very Active (strenuous physical job or training 2x/day)', value: 'very_active' }
      ]
    },
    {
      key: 'goal',
      label: 'Fitness & Weight Goal',
      type: 'select',
      default: 'weight_loss',
      options: [
        { label: 'Maintain weight', value: 'maintain' },
        { label: 'Mild weight loss (-250 kcal/day)', value: 'mild_loss' },
        { label: 'Standard weight loss (-500 kcal/day)', value: 'weight_loss' },
        { label: 'Aggressive weight loss (-1000 kcal/day)', value: 'extreme_loss' },
        { label: 'Mild weight gain (+250 kcal/day)', value: 'mild_gain' },
        { label: 'Muscle / weight gain (+500 kcal/day)', value: 'weight_gain' }
      ]
    }
  ],
  compute(values) {
    const unitSystem = (values.unitSystem as any) || 'metric';
    const gender = (values.gender as Gender) || 'male';
    const age = Number(values.age) || 30;
    const weight = Number(values.weight) || 75;
    const height = Number(values.height) || 178;
    const activityLevel = (values.activityLevel as ActivityLevel) || 'moderate';
    const goal = (values.goal as any) || 'weight_loss';

    return calculateCalories({ unitSystem, gender, age, weight, height, activityLevel, goal });
  },
  outputs: [
    { key: 'targetCalories', label: 'Daily Calorie Target (kcal)', format: 'number', highlight: true },
    { key: 'tdee', label: 'Maintenance Calories (TDEE)', format: 'number' },
    { key: 'bmr', label: 'Basal Metabolic Rate (BMR)', format: 'number' },
    { key: 'goalLabel', label: 'Selected Calorie Strategy', format: 'text' },
    { key: 'proteinGrams', label: 'Protein Target (g/day)', format: 'number' },
    { key: 'carbGrams', label: 'Carbohydrates Target (g/day)', format: 'number' },
    { key: 'fatGrams', label: 'Fats Target (g/day)', format: 'number' }
  ],
  chart: 'stacked'
};

export default config;
