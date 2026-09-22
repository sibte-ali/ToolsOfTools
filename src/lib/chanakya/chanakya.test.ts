/**
 * Unit tests for the Chanakya <-> Unicode Devanagari converter
 *
 * Covers: basic consonants, matras, reph, chhoti ee, half-consonants,
 * named conjuncts क्ष त्र ज्ञ, digits, and round-trip fidelity.
 */

import { describe, it, expect } from 'vitest';
import { chanakyaToUnicode, unicodeToChanakya } from './index';

describe('chanakyaToUnicode — basic consonants', () => {
  it('converts क (d)', () => {
    expect(chanakyaToUnicode('d')).toBe('क');
  });

  it('converts ग (x)', () => {
    expect(chanakyaToUnicode('x')).toBe('ग');
  });

  it('converts ह (g)', () => {
    expect(chanakyaToUnicode('g')).toBe('ह');
  });

  it('converts ख ([k)', () => {
    expect(chanakyaToUnicode('[k')).toBe('ख');
  });

  it('converts घ (?k)', () => {
    expect(chanakyaToUnicode('?k')).toBe('घ');
  });

  it('converts भ (Hk)', () => {
    expect(chanakyaToUnicode('Hk')).toBe('भ');
  });

  it('converts श (' + "'k)", () => {
    expect(chanakyaToUnicode("'k")).toBe('श');
  });
});

describe('chanakyaToUnicode — matras', () => {
  it('converts ा (k)', () => {
    expect(chanakyaToUnicode('k')).toBe('ा');
  });

  it('converts ी (h)', () => {
    expect(chanakyaToUnicode('h')).toBe('ी');
  });

  it('converts ु (q)', () => {
    expect(chanakyaToUnicode('q')).toBe('ु');
  });

  it('converts ू (w)', () => {
    expect(chanakyaToUnicode('w')).toBe('ू');
  });

  it('converts ं (a)', () => {
    expect(chanakyaToUnicode('a')).toBe('ं');
  });

  it('converts ो (ks)', () => {
    expect(chanakyaToUnicode('ks')).toBe('ो');
  });

  it('converts ौ (kS)', () => {
    expect(chanakyaToUnicode('kS')).toBe('ौ');
  });
});

describe('chanakyaToUnicode — chhoti ee ki matra (f)', () => {
  it('converts fd → कि', () => {
    expect(chanakyaToUnicode('fd')).toBe('कि');
  });

  it('converts fg → हि', () => {
    expect(chanakyaToUnicode('fg')).toBe('हि');
  });

  it('handles multiple f matras', () => {
    expect(chanakyaToUnicode('fd fd')).toBe('कि कि');
  });

  it('handles f before consonant cluster', () => {
    const result = chanakyaToUnicode('fDd');
    expect(result).toBe('क्कि');
  });
});

describe('chanakyaToUnicode — reph (Z)', () => {
  it('converts eZ → र्म', () => {
    expect(chanakyaToUnicode('eZ')).toBe('र्म');
  });

  it('converts eZk → र्मा', () => {
    expect(chanakyaToUnicode('eZk')).toBe('र्मा');
  });

  it('converts dZk → र्का', () => {
    expect(chanakyaToUnicode('dZk')).toBe('र्का');
  });
});

describe('chanakyaToUnicode — half-consonants & conjuncts', () => {
  it('converts D → क् (half-क)', () => {
    expect(chanakyaToUnicode('D')).toBe('क्');
  });

  it('converts Dd → क्क', () => {
    expect(chanakyaToUnicode('Dd')).toBe('क्क');
  });

  it('converts Rd → त्क', () => {
    expect(chanakyaToUnicode('Rd')).toBe('त्क');
  });
});

describe('chanakyaToUnicode — named conjuncts', () => {
  it('converts { → क्ष', () => {
    expect(chanakyaToUnicode('{')).toBe('क्ष');
  });

  it('converts K → ज्ञ', () => {
    expect(chanakyaToUnicode('K')).toBe('ज्ञ');
  });

  it('converts \\\\ → त्र', () => {
    expect(chanakyaToUnicode('\\')).toBe('त्र');
  });
});

describe('chanakyaToUnicode — digits', () => {
  it('converts 1 → १', () => {
    expect(chanakyaToUnicode('1')).toBe('१');
  });

  it('converts 0 → ०', () => {
    expect(chanakyaToUnicode('0')).toBe('०');
  });
});

describe('chanakyaToUnicode — edge cases', () => {
  it('returns empty string for empty input', () => {
    expect(chanakyaToUnicode('')).toBe('');
  });

  it('preserves spaces', () => {
    expect(chanakyaToUnicode('d e')).toContain(' ');
  });
});

describe('unicodeToChanakya — round-trip', () => {
  const samples: [string, string][] = [
    ['क', 'd'],
    ['ह', 'g'],
    ['क्ष', '{'],
    ['ज्ञ', 'K'],
    ['कि', 'fd'],
    ['र्म', 'eZ'],
    ['र्मा', 'eZk'],
  ];

  for (const [unicode, chanakya] of samples) {
    it(`unicodeToChanakya(${unicode}) → ${chanakya}`, () => {
      expect(unicodeToChanakya(unicode)).toBe(chanakya);
    });
  }

  it('round-trip fidelity for known phrase', () => {
    const sample = "Hkkjr ,d egku ns'k gSA";
    const unicode = chanakyaToUnicode(sample);
    const backToChanakya = unicodeToChanakya(unicode);
    expect(backToChanakya).toBe(sample);
  });
});
