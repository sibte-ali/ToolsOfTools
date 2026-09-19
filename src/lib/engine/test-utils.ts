import { expect } from 'vitest';

/**
 * Shared test helper to assert that two numbers are within a specified tolerance.
 */
export function expectClose(
  actual: number,
  expected: number,
  tolerance = 0.01
): void {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    expect(actual, `Expected ${actual} to be close to ${expected} (diff: ${diff} > tolerance: ${tolerance})`).toBe(expected);
  } else {
    expect(diff).toBeLessThanOrEqual(tolerance);
  }
}
