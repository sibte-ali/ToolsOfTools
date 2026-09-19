import type { ToolConfig } from '../../lib/engine/types';
import { calculatePace, predictRaceTimes, generateSplits } from '../../lib/health/pace';

export interface PaceInput {
  distanceUnit?: 'km' | 'miles';
  distancePreset?: 'custom' | '5k' | '10k' | 'half' | 'marathon';
  customDistance?: number;
  timeHours: number;
  timeMinutes: number;
  timeSeconds: number;
}

export function computePaceTool(input: PaceInput) {
  let distanceKm = 10;

  switch (input.distancePreset) {
    case '5k':
      distanceKm = 5.0;
      break;
    case '10k':
      distanceKm = 10.0;
      break;
    case 'half':
      distanceKm = 21.0975;
      break;
    case 'marathon':
      distanceKm = 42.195;
      break;
    default:
      const rawDist = Number(input.customDistance) || 10;
      distanceKm = input.distanceUnit === 'miles' ? rawDist * 1.609344 : rawDist;
      break;
  }

  const totalSeconds =
    (Number(input.timeHours) || 0) * 3600 +
    (Number(input.timeMinutes) || 0) * 60 +
    (Number(input.timeSeconds) || 0);

  const paceResult = calculatePace(totalSeconds, distanceKm);
  const racePredictions = predictRaceTimes(paceResult.paceMinPerKm);
  const splits = generateSplits(distanceKm, paceResult.paceMinPerKm, 1);

  return {
    paceKm: `${paceResult.paceKmFormatted} /km`,
    paceMile: `${paceResult.paceMileFormatted} /mile`,
    speedKmh: paceResult.speedKmh,
    speedMph: paceResult.speedMph,
    pred5k: racePredictions[0]?.timeFormatted || '00:00',
    pred10k: racePredictions[1]?.timeFormatted || '00:00',
    predHalf: racePredictions[2]?.timeFormatted || '00:00',
    predMarathon: racePredictions[3]?.timeFormatted || '00:00',
    splits
  };
}

const config: ToolConfig = {
  id: 'pace-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'distancePreset',
      label: 'Race Distance Preset',
      type: 'select',
      default: '10k',
      options: [
        { label: '5 Kilometers (5K)', value: '5k' },
        { label: '10 Kilometers (10K)', value: '10k' },
        { label: 'Half Marathon (21.1 km / 13.1 mi)', value: 'half' },
        { label: 'Full Marathon (42.2 km / 26.2 mi)', value: 'marathon' },
        { label: 'Custom Distance', value: 'custom' }
      ]
    },
    {
      key: 'customDistance',
      label: 'Custom Distance',
      type: 'number',
      min: 0.1,
      max: 500,
      step: 0.1,
      default: 10,
      unit: 'km or mi',
      help: 'Used only when "Custom Distance" is selected above.'
    },
    {
      key: 'distanceUnit',
      label: 'Distance Measurement Unit',
      type: 'select',
      default: 'km',
      options: [
        { label: 'Kilometers (km)', value: 'km' },
        { label: 'Miles (mi)', value: 'miles' }
      ]
    },
    {
      key: 'timeHours',
      label: 'Time: Hours',
      type: 'number',
      min: 0,
      max: 99,
      step: 1,
      default: 0,
      unit: 'hrs'
    },
    {
      key: 'timeMinutes',
      label: 'Time: Minutes',
      type: 'number',
      min: 0,
      max: 59,
      step: 1,
      default: 50,
      unit: 'mins'
    },
    {
      key: 'timeSeconds',
      label: 'Time: Seconds',
      type: 'number',
      min: 0,
      max: 59,
      step: 1,
      default: 0,
      unit: 'secs'
    }
  ],
  compute(values) {
    const distancePreset = (values.distancePreset as any) || '10k';
    const customDistance = Number(values.customDistance) || 10;
    const distanceUnit = (values.distanceUnit as any) || 'km';
    const timeHours = Number(values.timeHours) || 0;
    const timeMinutes = Number(values.timeMinutes) || 0;
    const timeSeconds = Number(values.timeSeconds) || 0;

    return computePaceTool({ distancePreset, customDistance, distanceUnit, timeHours, timeMinutes, timeSeconds });
  },
  table(values) {
    const result = computePaceTool(values as any);
    return result.splits.map(s => ({
      'Split #': s.splitNumber,
      'Distance': s.distanceFormatted,
      'Split Time': s.splitTimeFormatted,
      'Elapsed Time': s.cumulativeTimeFormatted
    }));
  },
  outputs: [
    { key: 'paceKm', label: 'Metric Pace (min/km)', format: 'text', highlight: true },
    { key: 'paceMile', label: 'Imperial Pace (min/mile)', format: 'text', highlight: true },
    { key: 'speedKmh', label: 'Speed (km/h)', format: 'number' },
    { key: 'speedMph', label: 'Speed (mph)', format: 'number' },
    { key: 'pred5k', label: 'Predicted 5K Finish', format: 'text' },
    { key: 'pred10k', label: 'Predicted 10K Finish', format: 'text' },
    { key: 'predHalf', label: 'Predicted Half Marathon', format: 'text' },
    { key: 'predMarathon', label: 'Predicted Full Marathon', format: 'text' }
  ],
  chart: 'none'
};

export default config;
