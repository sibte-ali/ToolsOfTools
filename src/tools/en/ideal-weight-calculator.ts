import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import { cmToInches, inchesToCm, kgToLb } from '../../lib/health/bmi';

export interface IdealWeightInput {
  unitSystem?: 'metric' | 'imperial';
  gender: 'male' | 'female';
  height: number; // cm in metric, inches in imperial
}

export function calculateIdealWeight(input: IdealWeightInput) {
  const isImperial = input.unitSystem === 'imperial';
  const heightInches = isImperial ? input.height : cmToInches(input.height);
  const heightCm = isImperial ? inchesToCm(input.height) : input.height;

  const inchesOver60 = Math.max(0, heightInches - 60);

  let devineKg = 0;
  let robinsonKg = 0;
  let millerKg = 0;
  let hamwiKg = 0;

  if (input.gender === 'male') {
    devineKg = 50.0 + 2.3 * inchesOver60;
    robinsonKg = 52.0 + 1.9 * inchesOver60;
    millerKg = 56.2 + 1.41 * inchesOver60;
    hamwiKg = 48.0 + 2.7 * inchesOver60;
  } else {
    devineKg = 45.5 + 2.3 * inchesOver60;
    robinsonKg = 49.0 + 1.7 * inchesOver60;
    millerKg = 53.1 + 1.36 * inchesOver60;
    hamwiKg = 45.5 + 2.2 * inchesOver60;
  }

  const averageKg = (devineKg + robinsonKg + millerKg + hamwiKg) / 4;

  const heightM = heightCm / 100;
  const bmiMinKg = 18.5 * (heightM * heightM);
  const bmiMaxKg = 24.9 * (heightM * heightM);

  if (isImperial) {
    return {
      averageWeight: roundHalfAwayFromZero(kgToLb(averageKg), 1),
      devineWeight: roundHalfAwayFromZero(kgToLb(devineKg), 1),
      robinsonWeight: roundHalfAwayFromZero(kgToLb(robinsonKg), 1),
      millerWeight: roundHalfAwayFromZero(kgToLb(millerKg), 1),
      hamwiWeight: roundHalfAwayFromZero(kgToLb(hamwiKg), 1),
      bmiRange: `${roundHalfAwayFromZero(kgToLb(bmiMinKg), 1)} - ${roundHalfAwayFromZero(kgToLb(bmiMaxKg), 1)} lbs`,
      unitLabel: 'lbs'
    };
  }

  return {
    averageWeight: roundHalfAwayFromZero(averageKg, 1),
    devineWeight: roundHalfAwayFromZero(devineKg, 1),
    robinsonWeight: roundHalfAwayFromZero(robinsonKg, 1),
    millerWeight: roundHalfAwayFromZero(millerKg, 1),
    hamwiWeight: roundHalfAwayFromZero(hamwiKg, 1),
    bmiRange: `${roundHalfAwayFromZero(bmiMinKg, 1)} - ${roundHalfAwayFromZero(bmiMaxKg, 1)} kg`,
    unitLabel: 'kg'
  };
}

const config: ToolConfig = {
  id: 'ideal-weight-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'unitSystem',
      label: 'Unit System',
      type: 'select',
      default: 'metric',
      options: [
        { label: 'Metric (cm, kg)', value: 'metric' },
        { label: 'Imperial (inches, lbs)', value: 'imperial' }
      ]
    },
    {
      key: 'gender',
      label: 'Biological Sex',
      type: 'select',
      default: 'female',
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' }
      ]
    },
    {
      key: 'height',
      label: 'Height',
      type: 'number',
      min: 120,
      max: 230,
      step: 0.5,
      default: 165,
      unit: 'cm or inches'
    }
  ],
  compute(values) {
    const unitSystem = (values.unitSystem as any) || 'metric';
    const gender = (values.gender as any) || 'female';
    const height = Number(values.height) || (unitSystem === 'imperial' ? 65 : 165);

    return calculateIdealWeight({ unitSystem, gender, height });
  },
  outputs: [
    { key: 'averageWeight', label: 'Consensus Ideal Weight', format: 'number', highlight: true },
    { key: 'bmiRange', label: 'Healthy BMI Weight Range (18.5–24.9)', format: 'text', highlight: true },
    { key: 'devineWeight', label: 'Devine Formula (1974)', format: 'number' },
    { key: 'robinsonWeight', label: 'Robinson Formula (1983)', format: 'number' },
    { key: 'millerWeight', label: 'Miller Formula (1983)', format: 'number' },
    { key: 'hamwiWeight', label: 'Hamwi Formula (1964)', format: 'number' }
  ],
  chart: 'none'
};

export default config;
