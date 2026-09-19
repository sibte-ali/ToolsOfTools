/**
 * Descriptive statistics: mean, variance, standard deviation (sample & population),
 * sum, min, max, median, with step-by-step tables.
 */

export interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  min: number;
  max: number;
  range: number;
  /** Population variance (divide by N) */
  variancePop: number;
  /** Sample variance (divide by N-1) */
  varianceSam: number;
  /** Population standard deviation */
  stdDevPop: number;
  /** Sample standard deviation */
  stdDevSam: number;
  median: number;
  /** Step table: each value, deviation from mean, squared deviation */
  steps: Array<{ value: number; deviation: number; deviationSq: number }>;
}

/**
 * Compute descriptive statistics for a dataset.
 */
export function calculateStats(data: number[]): StatsResult {
  if (data.length === 0) {
    throw new Error('Dataset must contain at least one number');
  }

  const n = data.length;
  const sum = data.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const steps = data.map((value) => {
    const deviation = value - mean;
    return { value, deviation, deviationSq: deviation * deviation };
  });

  const sumSq = steps.reduce((acc, s) => acc + s.deviationSq, 0);
  const variancePop = sumSq / n;
  const varianceSam = n > 1 ? sumSq / (n - 1) : 0;
  const stdDevPop = Math.sqrt(variancePop);
  const stdDevSam = Math.sqrt(varianceSam);

  // Median
  const sorted = [...data].sort((a, b) => a - b);
  let median: number;
  if (n % 2 === 0) {
    median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  } else {
    median = sorted[Math.floor(n / 2)];
  }

  return { count: n, sum, mean, min, max, range, variancePop, varianceSam, stdDevPop, stdDevSam, median, steps };
}

/**
 * Parse a comma/newline/space-separated string into an array of numbers.
 */
export function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      const n = parseFloat(s);
      if (isNaN(n)) throw new Error(`Invalid number: "${s}"`);
      return n;
    });
}
