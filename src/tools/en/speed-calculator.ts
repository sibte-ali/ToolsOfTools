import type { ToolConfig } from '../../lib/engine/types';
import { solveSpeedDistanceTime } from '../../lib/math/speed';

const config: ToolConfig = {
  id: 'speed-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'solveFor',
      label: 'Solve For',
      type: 'select',
      default: 'speed',
      options: [
        { label: 'Speed (given distance & time)', value: 'speed' },
        { label: 'Distance (given speed & time)', value: 'distance' },
        { label: 'Time (given speed & distance)', value: 'time' },
      ],
    },
    {
      key: 'distance',
      label: 'Distance',
      type: 'number',
      min: 0,
      step: 0.1,
      default: 100,
      unit: 'value',
    },
    {
      key: 'distanceUnit',
      label: 'Distance Unit',
      type: 'select',
      default: 'km',
      options: [
        { label: 'Kilometres (km)', value: 'km' },
        { label: 'Metres (m)', value: 'm' },
        { label: 'Miles (mi)', value: 'mi' },
        { label: 'Feet (ft)', value: 'ft' },
      ],
    },
    {
      key: 'time',
      label: 'Time',
      type: 'number',
      min: 0,
      step: 0.01,
      default: 1,
      unit: 'value',
    },
    {
      key: 'timeUnit',
      label: 'Time Unit',
      type: 'select',
      default: 'hours',
      options: [
        { label: 'Hours (h)', value: 'hours' },
        { label: 'Minutes (min)', value: 'minutes' },
        { label: 'Seconds (s)', value: 'seconds' },
      ],
    },
    {
      key: 'speed',
      label: 'Speed',
      type: 'number',
      min: 0,
      step: 0.1,
      default: 60,
      unit: 'value',
    },
    {
      key: 'speedUnit',
      label: 'Speed Unit',
      type: 'select',
      default: 'kmh',
      options: [
        { label: 'km/h', value: 'kmh' },
        { label: 'm/s', value: 'ms' },
        { label: 'mph', value: 'mph' },
        { label: 'Knots', value: 'knots' },
      ],
    },
  ],
  compute(values) {
    const solveFor = String(values.solveFor || 'speed') as 'speed' | 'distance' | 'time';
    try {
      const res = solveSpeedDistanceTime(solveFor, {
        distance: Number(values.distance) || 100,
        distanceUnit: (values.distanceUnit || 'km') as any,
        time: Number(values.time) || 1,
        timeUnit: (values.timeUnit || 'hours') as any,
        speed: Number(values.speed) || 60,
        speedUnit: (values.speedUnit || 'kmh') as any,
      });
      return {
        speedKmh: +res.speedKmh.toFixed(4),
        speedMph: +res.speedMph.toFixed(4),
        speedMs: +res.speedMs.toFixed(4),
        speedKnots: +res.speedKnots.toFixed(4),
        distanceKm: +res.distanceKm.toFixed(4),
        distanceMi: +res.distanceMi.toFixed(4),
        timeHours: +res.timeHours.toFixed(4),
        timeMinutes: +res.timeMinutes.toFixed(2),
        timeSeconds: +res.timeSeconds.toFixed(0),
        paceMinPerKm: res.paceMinPerKm,
        paceMinPerMile: res.paceMinPerMile,
        solvedFor: res.solvedFor,
      };
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Calculation error');
    }
  },
  outputs: [
    { key: 'speedKmh', label: 'Speed (km/h)', format: 'number', highlight: true },
    { key: 'speedMph', label: 'Speed (mph)', format: 'number', highlight: true },
    { key: 'distanceKm', label: 'Distance (km)', format: 'number' },
    { key: 'distanceMi', label: 'Distance (mi)', format: 'number' },
    { key: 'timeHours', label: 'Time (hours)', format: 'number' },
    { key: 'timeMinutes', label: 'Time (minutes)', format: 'number' },
    { key: 'speedMs', label: 'Speed (m/s)', format: 'number' },
    { key: 'speedKnots', label: 'Speed (knots)', format: 'number' },
    { key: 'paceMinPerKm', label: 'Pace (min/km)', format: 'text' },
    { key: 'paceMinPerMile', label: 'Pace (min/mile)', format: 'text' },
  ],
};

export default config;
