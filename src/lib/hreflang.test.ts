import { describe, it, expect } from 'vitest';
import { getHreflang, canonicalHreflangGroups } from './hreflang';

describe('hreflang reciprocity and invariants', () => {
  it('alternates are fully reciprocal across all hreflang groups', () => {
    for (const [groupName, targets] of canonicalHreflangGroups.entries()) {
      for (const targetA of targets) {
        const alternatesA = getHreflang(targetA.url);

        for (const targetB of targets) {
          // targetA must list targetB
          const bInA = alternatesA.find((l) => l.url === targetB.url && l.lang !== 'x-default');
          expect(
            bInA,
            `Group ${groupName}: Expected ${targetA.url} to include alternate ${targetB.url}`
          ).toBeDefined();

          // And targetB must list targetA (reciprocity)
          const alternatesB = getHreflang(targetB.url);
          const aInB = alternatesB.find((l) => l.url === targetA.url && l.lang !== 'x-default');
          expect(
            aInB,
            `Group ${groupName}: Reciprocity failed: ${targetB.url} did not link back to ${targetA.url}`
          ).toBeDefined();
        }
      }
    }
  });

  it('emits x-default pointing to English URL only when English page exists in group', () => {
    for (const [groupName, targets] of canonicalHreflangGroups.entries()) {
      const hasEnglish = targets.some((t) => t.lang === 'en');
      const englishTarget = targets.find((t) => t.lang === 'en');

      for (const target of targets) {
        const alternates = getHreflang(target.url);
        const xDefault = alternates.find((l) => l.lang === 'x-default');

        if (hasEnglish) {
          expect(
            xDefault,
            `Group ${groupName} has English, so ${target.url} must have x-default`
          ).toBeDefined();
          expect(xDefault?.url).toBe(englishTarget?.url);
        } else {
          expect(
            xDefault,
            `Group ${groupName} does NOT have English, so ${target.url} must NOT have x-default`
          ).toBeUndefined();
        }
      }
    }
  });

  it('pages without a group get a self-referencing hreflang', () => {
    const ungrouped = getHreflang('/random-standalone-page/');
    expect(ungrouped).toHaveLength(1);
    expect(ungrouped[0].url).toBe('/random-standalone-page/');
    expect(ungrouped[0].lang).toBe('en');

    const ungroupedPt = getHreflang('/pt-br/random-standalone-page/');
    expect(ungroupedPt).toHaveLength(1);
    expect(ungroupedPt[0].url).toBe('/pt-br/random-standalone-page/');
    expect(ungroupedPt[0].lang).toBe('pt-BR');
  });
});
