import { roundHalfAwayFromZero } from '../engine/math';

export interface RacePresetResult {
  race: string;
  distanceKm: number;
  distanceMiles: number;
  timeFormatted: string;
  timeSeconds: number;
}

export interface SplitInterval {
  splitNumber: number;
  distanceFormatted: string;
  splitTimeFormatted: string;
  cumulativeTimeFormatted: string;
}

export const KM_TO_MILES = 0.621371192;
export const MILES_TO_KM = 1.609344;

export const STANDARD_RACES = [
  { name: '5K', km: 5.0, miles: 3.10686 },
  { name: '10K', km: 10.0, miles: 6.21371 },
  { name: 'Half Marathon (21.1 km)', km: 21.0975, miles: 13.1094 },
  { name: 'Marathon (42.2 km)', km: 42.195, miles: 26.2188 }
];

export function formatTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.round(totalSeconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatPace(secondsPerUnit: number): string {
  if (isNaN(secondsPerUnit) || secondsPerUnit <= 0) return '0:00';
  const mins = Math.floor(secondsPerUnit / 60);
  const secs = Math.round(secondsPerUnit % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculatePace(totalSeconds: number, distanceKm: number) {
  if (totalSeconds <= 0 || distanceKm <= 0) {
    return {
      paceMinPerKm: 0,
      paceMinPerMile: 0,
      paceKmFormatted: '0:00',
      paceMileFormatted: '0:00',
      speedKmh: 0,
      speedMph: 0
    };
  }

  const secondsPerKm = totalSeconds / distanceKm;
  const distanceMiles = distanceKm * KM_TO_MILES;
  const secondsPerMile = totalSeconds / distanceMiles;

  const speedKmh = roundHalfAwayFromZero((distanceKm / totalSeconds) * 3600, 2);
  const speedMph = roundHalfAwayFromZero((distanceMiles / totalSeconds) * 3600, 2);

  return {
    paceMinPerKm: secondsPerKm,
    paceMinPerMile: secondsPerMile,
    paceKmFormatted: formatPace(secondsPerKm),
    paceMileFormatted: formatPace(secondsPerMile),
    speedKmh,
    speedMph
  };
}

export function predictRaceTimes(secondsPerKm: number): RacePresetResult[] {
  if (secondsPerKm <= 0) return [];
  return STANDARD_RACES.map(race => {
    const timeSec = Math.round(race.km * secondsPerKm);
    return {
      race: race.name,
      distanceKm: race.km,
      distanceMiles: roundHalfAwayFromZero(race.miles, 2),
      timeFormatted: formatTime(timeSec),
      timeSeconds: timeSec
    };
  });
}

export function generateSplits(distanceKm: number, secondsPerKm: number, stepKm = 1): SplitInterval[] {
  if (distanceKm <= 0 || secondsPerKm <= 0 || stepKm <= 0) return [];
  const splits: SplitInterval[] = [];
  const totalSplits = Math.min(50, Math.ceil(distanceKm / stepKm));

  for (let i = 1; i <= totalSplits; i++) {
    const currentDist = Math.min(distanceKm, i * stepKm);
    const splitSec = secondsPerKm * (currentDist - (i - 1) * stepKm);
    const cumSec = secondsPerKm * currentDist;

    splits.push({
      splitNumber: i,
      distanceFormatted: `${roundHalfAwayFromZero(currentDist, 1)} km`,
      splitTimeFormatted: formatTime(splitSec),
      cumulativeTimeFormatted: formatTime(cumSec)
    });
  }
  return splits;
}
