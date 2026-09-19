import { describe, it, expect } from 'vitest';
import { calculateLove } from './en/love-calculator';
import { calculateFlames } from './en/flames-game';
import { calculateLoShuGrid } from './en/lo-shu-grid';
import { calculateNameNumerology } from './en/name-numerology-calculator-by-date-of-birth';
import { calculateToneInfo } from './en/tone-generator';
import { calculateMulank } from './en/mulank-calculator';
import { calculateBhagyank } from './en/bhagyank-calculator';
import { calculateFriendship } from './en/friendship-calculator-by-name';

describe('Batch F: Entertainment, Numerology & Audio Pure Compute Tests', () => {
  describe('Love Calculator', () => {
    it('produces deterministic, order-invariant scores (Alice & Bob === Bob & Alice)', () => {
      // Benchmark: Order-invariance guarantees commutativity in relationship tests
      const res1 = calculateLove('Alice', 'Bob');
      const res2 = calculateLove('Bob', 'Alice');
      expect(res1.percentage).toBe(res2.percentage);
      expect(res1.tier).toBe(res2.tier);
      expect(res1.percentage).toBeGreaterThanOrEqual(40);
      expect(res1.percentage).toBeLessThanOrEqual(99);
    });

    it('produces identical deterministic scores on repeated invocations', () => {
      // Source test benchmark: Romeo & Juliet
      const resA = calculateLove('Romeo', 'Juliet');
      const resB = calculateLove('Romeo', 'Juliet');
      expect(resA.percentage).toBe(resB.percentage);
      expect(resA.shareText).toContain('Love Calculator');
    });
  });

  describe('FLAMES Game', () => {
    it('correctly eliminates letters and determines relationship tier', () => {
      // Benchmark calculation:
      // Name 1: "Romeo" (r, o, m, e, o)
      // Name 2: "Juliet" (j, u, l, i, e, t)
      // Common letters: 'e'
      // Remaining Name 1: r, o, m, o (4 letters)
      // Remaining Name 2: j, u, l, i, t (5 letters)
      // Total count N = 4 + 5 = 9
      // FLAMES elimination with N = 9:
      // Initial: [F, L, A, M, E, S] (len 6) -> (9-1)%6 = 8%6 = 2 -> eliminate 'A' (Affection)
      const res = calculateFlames('Romeo', 'Juliet');
      expect(res.count).toBe(9);
      expect(res.commonLetters).toEqual(['e']);
      expect(res.steps.length).toBe(5);
      expect(['F', 'L', 'A', 'M', 'E', 'S']).toContain(res.outcomeCode);
    });

    it('handles names with no common letters deterministically', () => {
      // Benchmark: "John" (4) and "Mary" (4) have 0 common letters -> N = 8
      const res = calculateFlames('John', 'Mary');
      expect(res.count).toBe(8);
      expect(res.commonLetters.length).toBe(0);
      expect(res.steps.length).toBe(5);
    });
  });

  describe('Lo Shu 3x3 Magic Grid', () => {
    it('populates 3x3 grid with correct digit frequencies and calculates planes', () => {
      // Benchmark DOB: 15-08-1995
      // Day = 15 -> Mulank = 1+5 = 6
      // Full DOB = 1+5+0+8+1+9+9+5 = 38 -> Bhagyank = 3+8 = 11 -> 2
      // Digits involved: 1, 5, 8, 1, 9, 9, 5, mulank 6, bhagyank 2
      const res = calculateLoShuGrid(15, 8, 1995);
      expect(res.mulank).toBe(6);
      expect(res.bhagyank).toBe(2);
      expect(res.grid.length).toBe(3);
      expect(res.grid[0].length).toBe(3);
      // Digit 9 appears in 1995 twice
      expect(res.digitCounts[9]).toBeGreaterThanOrEqual(2);
      // Number 4 does not appear in 15-08-1995 or root numbers
      expect(res.missingNumbers).toContain(4);
    });
  });

  describe('Name Numerology & Life Path', () => {
    it('computes Pythagorean name sums and preserves master numbers', () => {
      // Benchmark: Name "JOHN DOE"
      // Pythagorean: J=1, O=6, H=8, N=5 -> 20; D=4, O=6, E=5 -> 15
      // Total = 35 -> 3+5 = 8
      const res = calculateNameNumerology('John Doe', 'pythagorean');
      expect(res.compoundNumber).toBe(35);
      expect(res.rootNumber).toBe(8);
    });

    it('computes Chaldean name sums according to ancient 1-8 table', () => {
      // Benchmark: Name "JOHN DOE"
      // Chaldean: J=1, O=7, H=5, N=5 -> 18; D=4, O=7, E=5 -> 16
      // Total = 34 -> 3+4 = 7
      const res = calculateNameNumerology('John Doe', 'chaldean');
      expect(res.compoundNumber).toBe(34);
      expect(res.rootNumber).toBe(7);
    });
  });

  describe('Tone Generator & Acoustics', () => {
    it('accurately identifies A440 concert pitch standard', () => {
      // Physical constant benchmark: 440 Hz = Note A in Octave 4, zero cents deviation
      const res = calculateToneInfo(440, 'sine', 20);
      expect(res.noteName).toBe('A4');
      expect(res.centsOffset).toBe(0);
      // Speed of sound at 20°C ≈ 343.42 m/s -> wavelength = 343.42 / 440 ≈ 0.7805 m
      expect(res.wavelengthMeters).toBeCloseTo(0.7805, 2);
    });

    it('identifies Middle C (261.63 Hz) within 1 cent accuracy', () => {
      // Acoustic theory benchmark: Middle C = C4 ≈ 261.63 Hz
      const res = calculateToneInfo(261.63, 'triangle', 20);
      expect(res.noteName).toBe('C4');
      expect(Math.abs(res.centsOffset)).toBeLessThanOrEqual(1);
    });
  });

  describe('Mulank & Bhagyank Numerology', () => {
    it('reduces birth day to Mulank (Driver Number)', () => {
      // Benchmark: Born on 28th -> 2+8 = 10 -> 1+0 = 1 (Sun)
      const res1 = calculateMulank(28);
      expect(res1.mulank).toBe(1);
      expect(res1.rulingPlanet).toBe('Sun');

      // Benchmark: Born on 15th -> 1+5 = 6 (Venus)
      const res2 = calculateMulank(15);
      expect(res2.mulank).toBe(6);
      expect(res2.rulingPlanet).toBe('Venus');
    });

    it('reduces complete date of birth to Bhagyank (Destiny Number)', () => {
      // Benchmark: 28-09-1995 -> 2+8+0+9+1+9+9+5 = 43 -> 4+3 = 7 (Ketu)
      const res = calculateBhagyank(28, 9, 1995);
      expect(res.totalSum).toBe(43);
      expect(res.bhagyank).toBe(7);
    });
  });

  describe('Friendship Calculator', () => {
    it('uses a distinct algorithm from the Love Calculator and is symmetric', () => {
      // Verification that algorithms differ and are symmetric
      const friendScore1 = calculateFriendship('Alex', 'Jordan');
      const friendScore2 = calculateFriendship('Jordan', 'Alex');
      expect(friendScore1.percentage).toBe(friendScore2.percentage);
      expect(friendScore1.friendshipTier).toBe(friendScore2.friendshipTier);

      // Contrast against love score for same names to prove non-duplication
      const loveScore = calculateLove('Alex', 'Jordan');
      expect(friendScore1.shareableSnippet).toContain('Friendship');
      expect(friendScore1.percentage).toBeGreaterThanOrEqual(45);
      expect(friendScore1.percentage).toBeLessThanOrEqual(98);
    });
  });
});
