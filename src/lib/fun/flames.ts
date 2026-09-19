/**
 * Classic FLAMES relationship game algorithm with complete step-by-step trace.
 *
 * Acronym:
 * F = Friends
 * L = Love
 * A = Affection
 * M = Marriage
 * E = Enemies
 * S = Siblings
 *
 * Deterministic: identical names always yield identical outcomes.
 * Purely for entertainment — no romantic, relationship, or psychological claims.
 */

export interface FlamesStep {
  round: number;
  remainingLetters: string[];
  eliminatedLetter: string;
  eliminatedIndex: number;
  explanation: string;
}

export interface FlamesResult {
  name1: string;
  name2: string;
  commonLetters: string[];
  remainingName1: string;
  remainingName2: string;
  count: number;
  steps: FlamesStep[];
  outcomeCode: 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
  outcomeLabel: string;
  interpretation: string;
}

export const FLAMES_MAP: Record<
  'F' | 'L' | 'A' | 'M' | 'E' | 'S',
  { label: string; interpretation: string }
> = {
  F: {
    label: 'Friends',
    interpretation: 'A joyful camaraderie built on effortless humor, shared interests, and relaxed mutual trust.',
  },
  L: {
    label: 'Love',
    interpretation: 'A tender magnetic attraction marked by deep curiosity, romantic spark, and heartfelt harmony.',
  },
  A: {
    label: 'Affection',
    interpretation: 'A gentle warmth and fond caring that fosters easy comfort and sweet mutual consideration.',
  },
  M: {
    label: 'Marriage',
    interpretation: 'A deeply grounded union embodying dependable teamwork, shared life visions, and lasting partnership.',
  },
  E: {
    label: 'Enemies',
    interpretation: 'A feisty dynamic with fiery debate, stubborn friction, and contrasting perspectives that challenge each other.',
  },
  S: {
    label: 'Siblings',
    interpretation: 'A playful protective bond featuring friendly teasing, unbreakable loyalty, and familiar camaraderie.',
  },
};

export function calculateFlames(rawName1: string, rawName2: string): FlamesResult {
  const n1 = rawName1.toLowerCase().replace(/[^a-z]/g, '');
  const n2 = rawName2.toLowerCase().replace(/[^a-z]/g, '');

  if (!n1 || !n2) {
    throw new Error('Both names must contain at least one letter.');
  }

  // Strike common letters one by one
  const arr1 = n1.split('');
  const arr2 = n2.split('');
  const common: string[] = [];

  for (let i = 0; i < arr1.length; i++) {
    const ch = arr1[i];
    const matchIdx = arr2.indexOf(ch);
    if (matchIdx !== -1) {
      common.push(ch);
      arr1.splice(i, 1);
      i--;
      arr2.splice(matchIdx, 1);
    }
  }

  const remainingCount = arr1.length + arr2.length;
  const count = remainingCount === 0 ? 1 : remainingCount; // Avoid zero-length elimination loop

  // Cyclic elimination over FLAMES
  let flames: Array<'F' | 'L' | 'A' | 'M' | 'E' | 'S'> = ['F', 'L', 'A', 'M', 'E', 'S'];
  const steps: FlamesStep[] = [];
  let currentIndex = 0;
  let round = 1;

  while (flames.length > 1) {
    // Zero-indexed target: (currentIndex + count - 1) % flames.length
    const targetIdx = (currentIndex + count - 1) % flames.length;
    const eliminated = flames[targetIdx];
    const beforeList = [...flames];

    flames.splice(targetIdx, 1);
    currentIndex = targetIdx % flames.length;

    steps.push({
      round,
      remainingLetters: beforeList,
      eliminatedLetter: eliminated,
      eliminatedIndex: targetIdx,
      explanation: `Round ${round}: Counting ${count} positions through [${beforeList.join(', ')}] eliminates "${eliminated}" (${FLAMES_MAP[eliminated].label}).`,
    });
    round++;
  }

  const finalCode = flames[0];
  const finalInfo = FLAMES_MAP[finalCode];

  return {
    name1: rawName1.trim(),
    name2: rawName2.trim(),
    commonLetters: common,
    remainingName1: arr1.join(''),
    remainingName2: arr2.join(''),
    count,
    steps,
    outcomeCode: finalCode,
    outcomeLabel: finalInfo.label,
    interpretation: finalInfo.interpretation,
  };
}
