/**
 * Speed / distance / time solver with unit conversion and pace calculation.
 */

export type SpeedUnit = 'kmh' | 'ms' | 'mph' | 'knots';
export type DistanceUnit = 'km' | 'm' | 'mi' | 'ft';
export type TimeUnit = 'seconds' | 'minutes' | 'hours';

/** Convert speed to m/s (base) */
export function toMetersPerSecond(value: number, unit: SpeedUnit): number {
  switch (unit) {
    case 'kmh': return value / 3.6;
    case 'ms': return value;
    case 'mph': return value * 0.44704;
    case 'knots': return value * 0.514444;
  }
}

/** Convert m/s to target speed unit */
export function fromMetersPerSecond(ms: number, unit: SpeedUnit): number {
  switch (unit) {
    case 'kmh': return ms * 3.6;
    case 'ms': return ms;
    case 'mph': return ms / 0.44704;
    case 'knots': return ms / 0.514444;
  }
}

/** Convert distance to meters (base) */
export function toMeters(value: number, unit: DistanceUnit): number {
  switch (unit) {
    case 'km': return value * 1000;
    case 'm': return value;
    case 'mi': return value * 1609.344;
    case 'ft': return value * 0.3048;
  }
}

/** Convert seconds to target time unit */
export function fromSeconds(secs: number, unit: TimeUnit): number {
  switch (unit) {
    case 'seconds': return secs;
    case 'minutes': return secs / 60;
    case 'hours': return secs / 3600;
  }
}

/** Convert time to seconds (base) */
export function toSeconds(value: number, unit: TimeUnit): number {
  switch (unit) {
    case 'seconds': return value;
    case 'minutes': return value * 60;
    case 'hours': return value * 3600;
  }
}

export type SolveFor = 'speed' | 'distance' | 'time';

export interface SpeedResult {
  solvedFor: SolveFor;
  speed: number; // m/s
  distance: number; // meters
  time: number; // seconds
  speedKmh: number;
  speedMph: number;
  speedMs: number;
  speedKnots: number;
  distanceKm: number;
  distanceMi: number;
  timeSeconds: number;
  timeMinutes: number;
  timeHours: number;
  paceMinPerKm: string;  // "MM:SS"
  paceMinPerMile: string; // "MM:SS"
}

function secondsToMmSs(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return '--:--';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Solve for speed, distance, or time given the other two.
 */
export const calculateSpeedDistanceTime = solveSpeedDistanceTime;
export function solveSpeedDistanceTime(
  solveFor: SolveFor,
  params: {
    speed?: number; speedUnit?: SpeedUnit;
    distance?: number; distanceUnit?: DistanceUnit;
    time?: number; timeUnit?: TimeUnit;
  }
): SpeedResult {
  let speedMs: number;
  let distM: number;
  let timeSec: number;

  switch (solveFor) {
    case 'speed': {
      distM = toMeters(params.distance!, params.distanceUnit ?? 'km');
      timeSec = toSeconds(params.time!, params.timeUnit ?? 'hours');
      if (timeSec === 0) throw new Error('Time cannot be zero');
      speedMs = distM / timeSec;
      break;
    }
    case 'distance': {
      speedMs = toMetersPerSecond(params.speed!, params.speedUnit ?? 'kmh');
      timeSec = toSeconds(params.time!, params.timeUnit ?? 'hours');
      distM = speedMs * timeSec;
      break;
    }
    case 'time': {
      speedMs = toMetersPerSecond(params.speed!, params.speedUnit ?? 'kmh');
      distM = toMeters(params.distance!, params.distanceUnit ?? 'km');
      if (speedMs === 0) throw new Error('Speed cannot be zero');
      timeSec = distM / speedMs;
      break;
    }
  }

  const kmh = fromMetersPerSecond(speedMs, 'kmh');
  const distKm = distM / 1000;
  const paceSecPerKm = distKm > 0 ? timeSec / distKm : 0;
  const distMi = distM / 1609.344;
  const paceSecPerMile = distMi > 0 ? timeSec / distMi : 0;

  return {
    solvedFor: solveFor,
    speed: speedMs,
    distance: distM,
    time: timeSec,
    speedKmh: kmh,
    speedMph: fromMetersPerSecond(speedMs, 'mph'),
    speedMs: speedMs,
    speedKnots: fromMetersPerSecond(speedMs, 'knots'),
    distanceKm: distKm,
    distanceMi: distMi,
    timeSeconds: timeSec,
    timeMinutes: timeSec / 60,
    timeHours: timeSec / 3600,
    paceMinPerKm: secondsToMmSs(paceSecPerKm),
    paceMinPerMile: secondsToMmSs(paceSecPerMile),
  };
}
