import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import { lbToKg } from '../../lib/health/bmi';
import { ACTIVITIES, getActivityById, calculateCaloriesBurned, calculateBurnEquivalents } from '../../lib/health/met';

export interface CalorieBurnInput {
  unitSystem?: 'metric' | 'imperial';
  activityId: string;
  weight: number;
  durationMinutes: number;
}

export function computeCalorieBurn(input: CalorieBurnInput) {
  const isImperial = input.unitSystem === 'imperial';
  const weightKg = isImperial ? lbToKg(input.weight) : input.weight;

  const activity = getActivityById(input.activityId) || ACTIVITIES[0];
  const met = activity.met;

  const totalCalories = calculateCaloriesBurned(met, weightKg, input.durationMinutes);
  const burnRatePerHour = roundHalfAwayFromZero(calculateCaloriesBurned(met, weightKg, 60), 0);
  const equivalents = calculateBurnEquivalents(totalCalories, weightKg);

  return {
    totalCalories,
    burnRatePerHour,
    activityName: activity.name,
    metValue: met,
    pizzaSlices: equivalents.pizzaSlices,
    sodaCans: equivalents.sodaCans,
    bananas: equivalents.bananas,
    walkingMinutes: equivalents.walkingMinutes
  };
}

const config: ToolConfig = {
  id: 'calorie-burn-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'unitSystem',
      label: 'Unit System',
      type: 'select',
      default: 'metric',
      options: [
        { label: 'Metric (Kilograms - kg)', value: 'metric' },
        { label: 'Imperial (Pounds - lb)', value: 'imperial' }
      ]
    },
    {
      key: 'activityId',
      label: 'Physical Activity / Exercise',
      type: 'select',
      default: 'running_10kmh',
      options: ACTIVITIES.map(a => ({
        label: `${a.name} (MET: ${a.met})`,
        value: a.id
      }))
    },
    {
      key: 'weight',
      label: 'Your Body Weight',
      type: 'number',
      min: 30,
      max: 300,
      step: 0.5,
      default: 70,
      unit: 'kg or lb'
    },
    {
      key: 'durationMinutes',
      label: 'Exercise Duration',
      type: 'number',
      min: 1,
      max: 720,
      step: 1,
      default: 45,
      unit: 'minutes'
    }
  ],
  compute(values) {
    const unitSystem = (values.unitSystem as any) || 'metric';
    const activityId = String(values.activityId || 'running_10kmh');
    const weight = Number(values.weight) || (unitSystem === 'imperial' ? 154 : 70);
    const durationMinutes = Number(values.durationMinutes) || 45;

    return computeCalorieBurn({ unitSystem, activityId, weight, durationMinutes });
  },
  outputs: [
    { key: 'totalCalories', label: 'Total Calories Burned (kcal)', format: 'number', highlight: true },
    { key: 'burnRatePerHour', label: 'Hourly Caloric Burn Rate (kcal/h)', format: 'number' },
    { key: 'activityName', label: 'Selected Exercise Mode', format: 'text' },
    { key: 'metValue', label: 'Metabolic Equivalent (MET)', format: 'number' },
    { key: 'pizzaSlices', label: 'Equivalent Pepperoni Pizza Slices', format: 'number' },
    { key: 'sodaCans', label: 'Equivalent Standard Soda Cans', format: 'number' },
    { key: 'bananas', label: 'Equivalent Medium Bananas', format: 'number' }
  ],
  chart: 'none'
};

export default config;
