/**
 * Unit tests for the Devlys 010 <-> Unicode Devanagari converter
 *
 * Covers:
 * - Basic consonant + matra round-trips
 * - Reph (Z) pre-processing and placement
 * - Chhoti ee ki matra (f) reordering
 * - Half-consonants / halant conjuncts
 * - Named conjuncts: क्ष, त्र, ज्ञ
 * - Digit mapping
 * - Empty / whitespace input
 * - Round-trip fidelity: unicodeToDevlys(devlysToUnicode(x)) ≈ x
 */

import { describe, it, expect } from 'vitest';
import { devlysToUnicode, unicodeToDevlys } from './index';

describe('devlysToUnicode — basic consonants', () => {
  it('converts क (d)', () => {
    expect(devlysToUnicode('d')).toBe('क');
  });

  it('converts ग (x)', () => {
    expect(devlysToUnicode('x')).toBe('ग');
  });

  it('converts ह (g)', () => {
    expect(devlysToUnicode('g')).toBe('ह');
  });

  it('converts multi-char ख ([k)', () => {
    expect(devlysToUnicode('[k')).toBe('ख');
  });

  it('converts multi-char घ (?k)', () => {
    expect(devlysToUnicode('?k')).toBe('घ');
  });

  it('converts multi-char भ (Hk)', () => {
    expect(devlysToUnicode('Hk')).toBe('भ');
  });
});

describe('devlysToUnicode — matras', () => {
  it('converts ा (k)', () => {
    expect(devlysToUnicode('k')).toBe('ा');
  });

  it('converts ी (h)', () => {
    expect(devlysToUnicode('h')).toBe('ी');
  });

  it('converts ु (q)', () => {
    expect(devlysToUnicode('q')).toBe('ु');
  });

  it('converts ू (w)', () => {
    expect(devlysToUnicode('w')).toBe('ू');
  });

  it('converts े (s)', () => {
    expect(devlysToUnicode('s')).toBe('े');
  });

  it('converts ै (S)', () => {
    expect(devlysToUnicode('S')).toBe('ै');
  });

  it('converts ो (ks)', () => {
    expect(devlysToUnicode('ks')).toBe('ो');
  });

  it('converts ौ (kS)', () => {
    expect(devlysToUnicode('kS')).toBe('ौ');
  });

  it('converts ं (a)', () => {
    expect(devlysToUnicode('a')).toBe('ं');
  });
});

describe('devlysToUnicode — chhoti ee ki matra (f)', () => {
  it('converts fd → कि (f before consonant → ि after consonant)', () => {
    expect(devlysToUnicode('fd')).toBe('कि');
  });

  it('converts fg → हि', () => {
    expect(devlysToUnicode('fg')).toBe('हि');
  });

  it('handles f with a consonant cluster (half + full): fDd → क्कि', () => {
    const result = devlysToUnicode('fDd');
    expect(result).toBe('क्कि');
  });

  it('handles multiple short-i matras in one word', () => {
    // fd fd → कि कि
    const result = devlysToUnicode('fd fd');
    expect(result).toBe('कि कि');
  });
});

describe('devlysToUnicode — reph (Z)', () => {
  it('converts eZ → र्म (reph on म)', () => {
    expect(devlysToUnicode('eZ')).toBe('र्म');
  });

  it('converts jZ → र्र (reph on र)', () => {
    expect(devlysToUnicode('jZ')).toBe('र्र');
  });

  it('converts eZk → र्मा (reph on म with ा matra)', () => {
    expect(devlysToUnicode('eZk')).toBe('र्मा');
  });

  it('converts dZk → र्का (reph on क with ा matra)', () => {
    expect(devlysToUnicode('dZk')).toBe('र्का');
  });
});

describe('devlysToUnicode — half-consonants & conjuncts', () => {
  it('converts D → क् (half-क)', () => {
    expect(devlysToUnicode('D')).toBe('क्');
  });

  it('converts Dd → क्क', () => {
    expect(devlysToUnicode('Dd')).toBe('क्क');
  });

  it('converts Rd → त्क', () => {
    expect(devlysToUnicode('Rd')).toBe('त्क');
  });

  it('converts virama ~ directly', () => {
    expect(devlysToUnicode('d~e')).toBe('क्म');
  });
});

describe('devlysToUnicode — named conjuncts', () => {
  it('converts { → क्ष', () => {
    expect(devlysToUnicode('{')).toBe('क्ष');
  });

  it('converts = → त्र', () => {
    expect(devlysToUnicode('=')).toBe('त्र');
  });

  it('converts K → ज्ञ', () => {
    expect(devlysToUnicode('K')).toBe('ज्ञ');
  });
});

describe('devlysToUnicode — digits', () => {
  it('converts 1 to Devanagari १', () => {
    expect(devlysToUnicode('1')).toBe('१');
  });

  it('converts 0 to Devanagari ०', () => {
    expect(devlysToUnicode('0')).toBe('०');
  });

  it('converts 9 to Devanagari ९', () => {
    expect(devlysToUnicode('9')).toBe('९');
  });
});

describe('devlysToUnicode — full word samples', () => {
  it('converts Hkkjr → भारत', () => {
    // H=भ् k=ा k=ा j=र r=त — Devlys: Hk=भ, k=ा, j=र, r=त
    // Hkkjr: Hk=भ k=ा j=र r=त... let's test the known sample
    const result = devlysToUnicode("Hkkjr");
    expect(result).toBe('भारत');
  });

  it('converts ,d → एक', () => {
    // , = ए, d = क
    expect(devlysToUnicode(',d')).toBe('एक');
  });
});

describe('devlysToUnicode — edge cases', () => {
  it('returns empty string for empty input', () => {
    expect(devlysToUnicode('')).toBe('');
  });

  it('returns empty string for falsy input', () => {
    expect(devlysToUnicode('')).toBe('');
  });

  it('passes through ASCII digits not in the map as-is would convert to Devanagari', () => {
    // All digits 0-9 map to Devanagari
    expect(devlysToUnicode('123')).toBe('१२३');
  });

  it('preserves spaces', () => {
    const result = devlysToUnicode('d e');
    expect(result).toContain(' ');
  });
});

describe('unicodeToDevlys — round-trip', () => {
  const samples = [
    ['क', 'd'],
    ['भारत', 'Hkkjr'],
    ['कि', 'fd'],
    ['क्ष', '{'],
    ['त्र', '='],
    ['ज्ञ', 'K'],
    ['र्म', 'eZ'],
    ['र्मा', 'eZk'],
  ];

  for (const [unicode, devlys] of samples) {
    it(`unicodeToDevlys(${unicode}) → ${devlys}`, () => {
      expect(unicodeToDevlys(unicode)).toBe(devlys);
    });
  }

  it('unicodeToDevlys(devlysToUnicode(x)) ≈ x for a known sample', () => {
    const sample = "Hkkjr ,d egku ns'k gSA";
    const unicode = devlysToUnicode(sample);
    const backToDevlys = unicodeToDevlys(unicode);
    expect(backToDevlys).toBe(sample);
  });
});
