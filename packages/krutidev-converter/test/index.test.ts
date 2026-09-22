import { describe, it, expect } from 'vitest';
import {
  krutiDevToUnicode,
  unicodeToKrutiDev,
  krutiDevToMangal,
  mangalToKrutiDev,
  devlysToUnicode,
  unicodeToDevlys,
  chanakyaToUnicode,
  unicodeToChanakya,
  gandhiToUnicode,
  unicodeToGandhi,
} from '../src/index.js';

describe('krutidev-converter: Kruti Dev ↔ Unicode Devanagari', () => {
  it('converts basic words correctly', () => {
    expect(krutiDevToUnicode('Hkkjr')).toBe('भारत');
    expect(krutiDevToUnicode('egku')).toBe('महान');
    expect(krutiDevToUnicode("ns'k")).toBe('देश');
    expect(krutiDevToUnicode('gSA')).toBe('है।');
  });

  it('handles reverse conversion (Unicode to Kruti Dev)', () => {
    expect(unicodeToKrutiDev('भारत')).toBe('Hkkjr');
    expect(unicodeToKrutiDev('महान')).toBe('egku');
    expect(unicodeToKrutiDev('देश')).toBe("ns'k");
  });

  it('correctly handles chhoti ee ki matra (ि) reordering', () => {
    // In Kruti Dev: 'fd' = क + ि = कि
    expect(krutiDevToUnicode('fd')).toBe('कि');
    expect(unicodeToKrutiDev('कि')).toBe('fd');

    // Word with chhoti ee: 'f' + 'd'(क) + 'r'(त) + 'k'(ा) + 'c'(ब) = किताब
    expect(krutiDevToUnicode('fdrkc')).toBe('किताब');
    expect(unicodeToKrutiDev('किताब')).toBe('fdrkc');
  });

  it('correctly handles reph (र्) reordering', () => {
    // In Kruti Dev: '/k' (ध) + 'e' (म) + 'Z' (र्) = धर्म
    expect(krutiDevToUnicode('/keZ')).toBe('धर्म');
    expect(unicodeToKrutiDev('धर्म')).toBe('/keZ');

    // In Kruti Dev: 'd' (क) + 'e' (म) + 'Z' (र्) = कर्म
    expect(krutiDevToUnicode('deZ')).toBe('कर्म');
    expect(unicodeToKrutiDev('कर्म')).toBe('deZ');
  });

  it('handles simultaneous reph and matra (e.g. र्मा in शर्मा)', () => {
    // Kruti Dev: 'eZk' = र्मा -> 'keZk' = शर्मा
    expect(krutiDevToUnicode("'keZk")).toBe('शर्मा');
    expect(unicodeToKrutiDev('शर्मा')).toBe("'keZk");
  });

  it('handles conjuncts with halants', () => {
    // क्त
    expect(krutiDevToUnicode('Dr')).toBe('क्त');
    // क्षेत्र: '{' (क्ष) + 's' (े) + '=' (त्र)
    expect(krutiDevToUnicode('{s=')).toBe('क्षेत्र');
    // ज्ञान
    expect(krutiDevToUnicode('Kku')).toBe('ज्ञान');
  });

  it('supports Mangal aliases identically', () => {
    expect(krutiDevToMangal('Hkkjr')).toBe('भारत');
    expect(mangalToKrutiDev('भारत')).toBe('Hkkjr');
  });

  it('supports variant options (e.g. 011, 016, 055, 060)', () => {
    const result010 = krutiDevToUnicode('Hkkjr', { variant: '010' });
    expect(result010).toBe('भारत');

    const result016 = krutiDevToUnicode('^ Hkkjr', { variant: '016' });
    expect(result016).toContain('भारत');
  });
});

describe('krutidev-converter: Devlys ↔ Unicode Devanagari', () => {
  it('converts Devlys sentences forward and back', () => {
    expect(devlysToUnicode("Hkkjr ,d egku ns'k gSA")).toBe('भारत एक महान देश है।');
    expect(unicodeToDevlys('भारत एक महान देश है।')).toBe("Hkkjr ,d egku ns'k gSA");
  });

  it('handles Devlys reph and chhoti ee', () => {
    expect(devlysToUnicode('/keZ')).toBe('धर्म');
    expect(devlysToUnicode('fdrkc')).toBe('किताब');
  });
});

describe('krutidev-converter: Chanakya ↔ Unicode Devanagari', () => {
  it('converts Chanakya sentences forward and back', () => {
    expect(chanakyaToUnicode('Hkkjr')).toBe('भारत');
    expect(unicodeToChanakya('भारत')).toBe('Hkkjr');
  });

  it('handles Chanakya conjuncts (क्ष, ज्ञ, त्र)', () => {
    expect(chanakyaToUnicode('{')).toBe('क्ष');
    expect(chanakyaToUnicode('K')).toBe('ज्ञ');
    expect(chanakyaToUnicode('\\')).toBe('त्र');
  });
});

describe('krutidev-converter: 4C Gandhi ↔ Unicode Gujarati', () => {
  it('converts 4C Gandhi to Gujarati Unicode', () => {
    expect(gandhiToUnicode('Hkkjr')).toBe('ભારત');
    expect(unicodeToGandhi('ભારત')).toBe('Hkkjr');
  });
});
