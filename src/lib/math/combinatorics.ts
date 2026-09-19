/**
 * Combinatorics: nCr (combinations), nPr (permutations), with and without repetition.
 * Uses BigInt for large n to avoid overflow.
 */

/**
 * BigInt factorial.
 */
export function factorialBig(n: number): bigint {
  if (n < 0 || !Number.isInteger(n)) throw new Error('n must be a non-negative integer');
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

/**
 * nPr = n! / (n-r)!  — permutations without repetition
 */
export function nPr(n: number, r: number): bigint {
  if (r > n || r < 0) return 0n;
  let result = 1n;
  for (let i = BigInt(n); i > BigInt(n - r); i--) {
    result *= i;
  }
  return result;
}

export const combination = nCr;
export const permutation = nPr;

/**
 * nCr = n! / (r! * (n-r)!) — combinations without repetition
 */
export function nCr(n: number, r: number): bigint {
  if (r > n || r < 0) return 0n;
  if (r === 0 || r === n) return 1n;
  // Use symmetry: nCr(n, r) = nCr(n, n-r)
  r = Math.min(r, n - r);
  let result = 1n;
  for (let i = 0; i < r; i++) {
    result = (result * BigInt(n - i)) / BigInt(i + 1);
  }
  return result;
}

/**
 * nPr with repetition: n^r
 */
export function nPrRepeat(n: number, r: number): bigint {
  if (r < 0) return 0n;
  return BigInt(n) ** BigInt(r);
}

/**
 * nCr with repetition: (n+r-1)! / (r! * (n-1)!)
 */
export function nCrRepeat(n: number, r: number): bigint {
  if (r < 0 || n < 0) return 0n;
  return nCr(n + r - 1, r);
}

export interface CombinatoricsResult {
  n: number;
  r: number;
  nCr: bigint;
  nPr: bigint;
  nCrRepeat: bigint;
  nPrRepeat: bigint;
  factorialExpansion: {
    nCr: string;
    nPr: string;
  };
}

export function calculateCombinatorics(n: number, r: number): CombinatoricsResult {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) {
    throw new Error('n and r must be non-negative integers');
  }
  if (r > n) {
    throw new Error('r cannot be greater than n');
  }
  if (n > 1000) {
    throw new Error('n must be ≤ 1000 (result would be astronomically large)');
  }

  const combinations = nCr(n, r);
  const permutations = nPr(n, r);
  const combRepeat = nCrRepeat(n, r);
  const permRepeat = nPrRepeat(n, r);

  return {
    n,
    r,
    nCr: combinations,
    nPr: permutations,
    nCrRepeat: combRepeat,
    nPrRepeat: permRepeat,
    factorialExpansion: {
      nCr: `${n}! / (${r}! × ${n - r}!)`,
      nPr: `${n}! / ${n - r}!`,
    },
  };
}
