import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import {
  calculateBmi,
  calculateBmiImperial,
  getBmiCategory,
  getHealthyWeightRange,
  inchesToCm,
  kgToLb,
  lbToKg
} from '../../lib/health/bmi';

export interface BmiToolInput {
  unitSystem?: 'metric' | 'imperial';
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  populationStandard?: 'who' | 'asian';
}

export function computeBmiTool(input: BmiToolInput) {
  const isImperial = input.unitSystem === 'imperial';
  const isAsian = input.populationStandard === 'asian';

  let bmi = 0;
  let heightCm = 0;
  let weightKg = 0;

  if (isImperial) {
    bmi = calculateBmiImperial(input.weight, input.height);
    heightCm = inchesToCm(input.height);
    weightKg = lbToKg(input.weight);
  } else {
    bmi = calculateBmi(input.weight, input.height);
    heightCm = input.height;
    weightKg = input.weight;
  }

  const cat = getBmiCategory(bmi, isAsian);
  const healthyRangeKg = getHealthyWeightRange(heightCm, isAsian);

  // Prime index: ratio of actual BMI to the upper limit of normal BMI (25.0)
  const primeIndex = roundHalfAwayFromZero(bmi / (isAsian ? 23.0 : 25.0), 2);

  // Ponderal index: kg / m^3
  const heightM = heightCm / 100;
  const ponderalIndex = roundHalfAwayFromZero(weightKg / (heightM * heightM * heightM), 2);

  let healthyWeightString = '';
  if (isImperial) {
    const minLb = roundHalfAwayFromZero(kgToLb(healthyRangeKg.minKg), 1);
    const maxLb = roundHalfAwayFromZero(kgToLb(healthyRangeKg.maxKg), 1);
    healthyWeightString = `${minLb} - ${maxLb} lbs`;
  } else {
    healthyWeightString = `${healthyRangeKg.minKg} - ${healthyRangeKg.maxKg} kg`;
  }

  return {
    bmi,
    category: cat.category,
    healthyRange: healthyWeightString,
    primeIndex,
    ponderalIndex,
    clinicalNotes: cat.description
  };
}

const config: ToolConfig = {
  id: 'bmi-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'unitSystem',
      label: 'Unit System',
      type: 'select',
      default: 'metric',
      options: [
        { label: 'Metric (Centimeters, Kilograms)', value: 'metric' },
        { label: 'Imperial (Inches, Pounds)', value: 'imperial' }
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
      label: 'Age (Adults 18+)',
      type: 'number',
      min: 18,
      max: 120,
      step: 1,
      default: 28,
      unit: 'years'
    },
    {
      key: 'height',
      label: 'Height',
      type: 'number',
      min: 100,
      max: 250,
      step: 0.5,
      default: 175,
      unit: 'cm or in'
    },
    {
      key: 'weight',
      label: 'Weight',
      type: 'number',
      min: 30,
      max: 350,
      step: 0.5,
      default: 70,
      unit: 'kg or lb'
    },
    {
      key: 'populationStandard',
      label: 'Diagnostic Cut-Off Standard',
      type: 'select',
      default: 'who',
      options: [
        { label: 'WHO International Standard (Normal: 18.5–24.9)', value: 'who' },
        { label: 'Asian Population Cut-Off (Normal: 18.5–22.9, Overweight >= 23.0)', value: 'asian' }
      ]
    }
  ],
  compute(values) {
    const unitSystem = (values.unitSystem as any) || 'metric';
    const gender = (values.gender as any) || 'male';
    const age = Number(values.age) || 28;
    const height = Number(values.height) || (unitSystem === 'imperial' ? 69 : 175);
    const weight = Number(values.weight) || (unitSystem === 'imperial' ? 154 : 70);
    const populationStandard = (values.populationStandard as any) || 'who';

    return computeBmiTool({ unitSystem, gender, age, height, weight, populationStandard });
  },
  outputs: [
    { key: 'bmi', label: 'Body Mass Index (BMI)', format: 'number', highlight: true },
    { key: 'category', label: 'Weight Classification', format: 'text', highlight: true },
    { key: 'healthyRange', label: 'Healthy Weight Range for Height', format: 'text' },
    { key: 'primeIndex', label: 'BMI Prime Ratio', format: 'number' },
    { key: 'ponderalIndex', label: 'Ponderal Index (kg/m³)', format: 'number' },
    { key: 'clinicalNotes', label: 'Epidemiological Assessment', format: 'text' }
  ],
  chart: 'stacked'
};

export default config;
