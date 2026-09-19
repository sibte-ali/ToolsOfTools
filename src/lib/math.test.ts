import { describe, it, expect } from 'vitest';
import { clamp } from './math';

describe('clamp', () => {
  it('clamps values below minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps values above maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('preserves values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});
