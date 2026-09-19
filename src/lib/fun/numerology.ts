/**
 * Numerology engine: Pythagorean & Chaldean systems,
 * Mulank (driver number), Bhagyank (destiny number),
 * Name analysis, and Lo Shu 3x3 Magic Grid.
 *
 * All interpretations are original creative text for entertainment purposes.
 */

// ─── Number Tables ─────────────────────────────────────────────────────────

export const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

// Chaldean does not assign 9 to base letters (9 was revered as sacred/divine)
export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// ─── Helper Functions ──────────────────────────────────────────────────────

/**
 * Reduce a number to a single digit (1-9) by summing digits iteratively.
 * If preserveMaster is true, stops at 11, 22, or 33.
 */
export function reduceNumber(num: number, preserveMaster = false): number {
  num = Math.abs(Math.round(num));
  while (num > 9) {
    if (preserveMaster && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = String(num)
      .split('')
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num;
}

/**
 * Sum digits of a string (e.g. date "28-09-1995" or numbers).
 */
export function sumDigits(str: string): number {
  return str
    .replace(/\D/g, '')
    .split('')
    .reduce((acc, ch) => acc + parseInt(ch, 10), 0);
}

// ─── Core Calculations ────────────────────────────────────────────────────

/**
 * Mulank (Driver Number / Birth Day Number):
 * The day of birth (1-31) reduced to a single digit (1-9).
 * E.g., born on the 28th -> 2 + 8 = 10 -> 1 + 0 = 1.
 */
export function calculateMulank(day: number): {
  day: number;
  mulank: number;
  rulingPlanet: string;
  traits: string;
  luckyColor: string;
  luckyDay: string;
} {
  if (day < 1 || day > 31) throw new Error('Day must be between 1 and 31');
  const mulank = reduceNumber(day, false);
  const info = MULANK_ATTRIBUTES[mulank] ?? {
    rulingPlanet: 'Unknown',
    traits: 'Dynamic potential',
    luckyColor: 'Gold',
    luckyDay: 'Sunday',
  };
  return { day, mulank, ...info };
}

/**
 * Bhagyank (Destiny Number / Life Path Number):
 * Sum of all digits in the complete date of birth (DD-MM-YYYY) reduced to 1-9.
 * E.g., 28-09-1995 -> 2+8+0+9+1+9+9+5 = 43 -> 4+3 = 7.
 */
export function calculateBhagyank(day: number, month: number, year: number): {
  dobFormatted: string;
  totalSum: number;
  bhagyank: number;
  destinyTheme: string;
  careerFields: string[];
  lifeLesson: string;
} {
  if (day < 1 || day > 31) throw new Error('Invalid day');
  if (month < 1 || month > 12) throw new Error('Invalid month');
  if (year < 1000 || year > 3000) throw new Error('Invalid year');

  const dobStr = `${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${year}`;
  const totalSum = sumDigits(dobStr);
  const bhagyank = reduceNumber(totalSum, false);
  const info = BHAGYANK_ATTRIBUTES[bhagyank] ?? {
    destinyTheme: 'Self-discovery',
    careerFields: ['General'],
    lifeLesson: 'Embrace steady progress',
  };

  return {
    dobFormatted: `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`,
    totalSum,
    bhagyank,
    ...info,
  };
}

/**
 * Calculate Name Numerology using Pythagorean or Chaldean system.
 * Computes:
 * - Root Name Number (Destiny/Expression)
 * - Compound Total
 * - Soul Urge Number (Vowels)
 * - Personality Number (Consonants)
 */
export function calculateNameNumerology(
  fullName: string,
  system: 'pythagorean' | 'chaldean' = 'pythagorean'
): {
  fullName: string;
  system: 'pythagorean' | 'chaldean';
  compoundNumber: number;
  rootNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  letterBreakdown: Array<{ letter: string; value: number; isVowel: boolean }>;
  meaning: string;
} {
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  const clean = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  if (!clean) throw new Error('Name must contain at least one alphabetic character');

  let compoundNumber = 0;
  let vowelSum = 0;
  let consonantSum = 0;
  const letterBreakdown: Array<{ letter: string; value: number; isVowel: boolean }> = [];

  for (const ch of clean) {
    const val = map[ch] ?? 0;
    const isVowel = VOWELS.has(ch);
    compoundNumber += val;
    if (isVowel) vowelSum += val;
    else consonantSum += val;
    letterBreakdown.push({ letter: ch, value: val, isVowel });
  }

  const rootNumber = reduceNumber(compoundNumber, true);
  const soulUrgeNumber = reduceNumber(vowelSum, true);
  const personalityNumber = reduceNumber(consonantSum, true);
  const meaning = NUMBER_MEANINGS[rootNumber] ?? 'A unique blend of vibrations and creative potential.';

  return {
    fullName,
    system,
    compoundNumber,
    rootNumber,
    soulUrgeNumber,
    personalityNumber,
    letterBreakdown,
    meaning,
  };
}

/**
 * Lo Shu Grid (Chinese 3x3 Magic Square):
 * Standard layout:
 * [4, 9, 2] -> Mental Plane (Top row)
 * [3, 5, 7] -> Emotional / Thought Plane (Middle row)
 * [8, 1, 6] -> Practical / Action Plane (Bottom row)
 * Columns:
 * [4, 3, 8] -> Thought Plane
 * [9, 5, 1] -> Will Plane
 * [2, 7, 6] -> Action Plane
 * Diagonals:
 * [4, 5, 6] -> Golden / Success (Raja Yoga)
 * [2, 5, 8] -> Silver / Earth (Property/Stability)
 */
export interface LoShuResult {
  grid: number[][]; // 3x3 grid with counts of each number
  digitCounts: Record<number, number>; // 1..9 -> count
  presentNumbers: number[];
  missingNumbers: number[];
  repeatingNumbers: Array<{ number: number; count: number }>;
  mulank: number;
  bhagyank: number;
  planes: {
    // Horizontal
    mental: { numbers: number[]; present: number[]; status: string };
    emotional: { numbers: number[]; present: number[]; status: string };
    practical: { numbers: number[]; present: number[]; status: string };
    // Vertical
    thought: { numbers: number[]; present: number[]; status: string };
    will: { numbers: number[]; present: number[]; status: string };
    action: { numbers: number[]; present: number[]; status: string };
    // Diagonal
    goldenSuccess: { numbers: number[]; present: number[]; status: string };
    silverEarth: { numbers: number[]; present: number[]; status: string };
  };
  originalInterpretations: Record<number, string>;
}

export function calculateLoShuGrid(day: number, month: number, year: number): LoShuResult {
  const mulankRes = calculateMulank(day);
  const bhagyankRes = calculateBhagyank(day, month, year);

  // Digits to populate: all digits of day, month, year, plus Mulank and Bhagyank
  const rawDigits = `${day}${month}${year}${mulankRes.mulank}${bhagyankRes.bhagyank}`
    .split('')
    .map(Number)
    .filter((d) => d >= 1 && d <= 9);

  const digitCounts: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };

  for (const d of rawDigits) {
    digitCounts[d] = (digitCounts[d] || 0) + 1;
  }

  // 3x3 grid representation: standard Lo Shu layout
  // Row 0: [4, 9, 2]
  // Row 1: [3, 5, 7]
  // Row 2: [8, 1, 6]
  const grid: number[][] = [
    [digitCounts[4], digitCounts[9], digitCounts[2]],
    [digitCounts[3], digitCounts[5], digitCounts[7]],
    [digitCounts[8], digitCounts[1], digitCounts[6]],
  ];

  const presentNumbers = Object.keys(digitCounts)
    .map(Number)
    .filter((n) => digitCounts[n] > 0);

  const missingNumbers = Object.keys(digitCounts)
    .map(Number)
    .filter((n) => digitCounts[n] === 0);

  const repeatingNumbers = Object.keys(digitCounts)
    .map(Number)
    .filter((n) => digitCounts[n] > 1)
    .map((n) => ({ number: n, count: digitCounts[n] }));

  function planeStatus(nums: number[]): { numbers: number[]; present: number[]; status: string } {
    const present = nums.filter((n) => digitCounts[n] > 0);
    let status = 'Incomplete';
    if (present.length === 3) status = 'Complete (Strong)';
    else if (present.length === 0) status = 'Empty (Challenging)';
    else status = `Partial (${present.length}/3)`;
    return { numbers: nums, present, status };
  }

  const planes = {
    mental: planeStatus([4, 9, 2]),
    emotional: planeStatus([3, 5, 7]),
    practical: planeStatus([8, 1, 6]),
    thought: planeStatus([4, 3, 8]),
    will: planeStatus([9, 5, 1]),
    action: planeStatus([2, 7, 6]),
    goldenSuccess: planeStatus([4, 5, 6]),
    silverEarth: planeStatus([2, 5, 8]),
  };

  return {
    grid,
    digitCounts,
    presentNumbers,
    missingNumbers,
    repeatingNumbers,
    mulank: mulankRes.mulank,
    bhagyank: bhagyankRes.bhagyank,
    planes,
    originalInterpretations: LO_SHU_MEANINGS,
  };
}

// ─── Original Interpretive Copy (100% Unique) ─────────────────────────────

export const MULANK_ATTRIBUTES: Record<
  number,
  { rulingPlanet: string; traits: string; luckyColor: string; luckyDay: string }
> = {
  1: {
    rulingPlanet: 'Sun',
    traits: 'Independent pioneer with natural leadership, keen vision, and an assertive drive.',
    luckyColor: 'Gold / Orange',
    luckyDay: 'Sunday',
  },
  2: {
    rulingPlanet: 'Moon',
    traits: 'Empathetic peacemaker, highly intuitive, artistic, and cooperative in team settings.',
    luckyColor: 'Silver / White',
    luckyDay: 'Monday',
  },
  3: {
    rulingPlanet: 'Jupiter',
    traits: 'Optimistic mentor, expressive orator, intellectually curious, and naturally charismatic.',
    luckyColor: 'Yellow',
    luckyDay: 'Thursday',
  },
  4: {
    rulingPlanet: 'Rahu',
    traits: 'Methodical architect of systems, analytical, unconventional thinker, and resilient.',
    luckyColor: 'Electric Blue / Grey',
    luckyDay: 'Saturday',
  },
  5: {
    rulingPlanet: 'Mercury',
    traits: 'Adaptable explorer, swift communicator, commercially minded, and fond of freedom.',
    luckyColor: 'Emerald Green',
    luckyDay: 'Wednesday',
  },
  6: {
    rulingPlanet: 'Venus',
    traits: 'Harmonious caregiver, connoisseur of elegance, socially magnetic, and responsible.',
    luckyColor: 'Pastel Blue / Rose',
    luckyDay: 'Friday',
  },
  7: {
    rulingPlanet: 'Ketu',
    traits: 'Introspective philosopher, research-oriented, spiritually inquisitive, and deep-thinking.',
    luckyColor: 'Smoky Grey / Olive',
    luckyDay: 'Tuesday',
  },
  8: {
    rulingPlanet: 'Saturn',
    traits: 'Disciplined executive, patient strategist, master of material resources, and persistent.',
    luckyColor: 'Navy Blue / Black',
    luckyDay: 'Saturday',
  },
  9: {
    rulingPlanet: 'Mars',
    traits: 'Courageous humanitarian, dynamic catalyst, passionate advocate, and energetically bold.',
    luckyColor: 'Crimson / Red',
    luckyDay: 'Tuesday',
  },
};

export const BHAGYANK_ATTRIBUTES: Record<
  number,
  { destinyTheme: string; careerFields: string[]; lifeLesson: string }
> = {
  1: {
    destinyTheme: 'Pioneering Leadership & Self-Reliance',
    careerFields: ['Entrepreneurship', 'Executive Management', 'Innovation', 'Public Governance'],
    lifeLesson: 'Balancing confident initiative with humility and listening to others.',
  },
  2: {
    destinyTheme: 'Diplomacy, Partnership & Emotional Resonance',
    careerFields: ['Counseling', 'Mediation', 'Design', 'Human Resources', 'Diplomacy'],
    lifeLesson: 'Trusting internal intuition without surrendering personal boundaries.',
  },
  3: {
    destinyTheme: 'Creative Expression & Knowledge Sharing',
    careerFields: ['Publishing', 'Education', 'Media & Arts', 'Public Speaking', 'Marketing'],
    lifeLesson: 'Focusing multifaceted talents toward consistent, long-term mastery.',
  },
  4: {
    destinyTheme: 'Structural Building, Order & Innovation',
    careerFields: ['Engineering', 'Software Architecture', 'Operations', 'Finance', 'Law'],
    lifeLesson: 'Staying flexible when life demands sudden revisions to careful plans.',
  },
  5: {
    destinyTheme: 'Dynamic Freedom, Commerce & Global Adaptability',
    careerFields: ['Global Trade', 'Journalism', 'Tech Ventures', 'Hospitality', 'Sales'],
    lifeLesson: 'Channeling boundless restlessness into deep, meaningful ventures.',
  },
  6: {
    destinyTheme: 'Community Care, Harmonious Stewardship & Aesthetics',
    careerFields: ['Healthcare', 'Interior Architecture', 'Social Enterprise', 'Culinary Arts'],
    lifeLesson: 'Allowing loved ones the dignity of solving their own life challenges.',
  },
  7: {
    destinyTheme: 'Analytical Inquiry, Truth-Seeking & Wisdom',
    careerFields: ['Scientific Research', 'Philosophy', 'Data Forensics', 'Specialized Academics'],
    lifeLesson: 'Bridging sharp intellectual skepticism with warm interpersonal warmth.',
  },
  8: {
    destinyTheme: 'Material Mastery, Executive Stewardship & Endurance',
    careerFields: ['Asset Management', 'Real Estate', 'Corporate Strategy', 'Civil Infrastructure'],
    lifeLesson: 'Wielding authority with compassion and ethical integrity.',
  },
  9: {
    destinyTheme: 'Universal Compassion, Social Impact & Higher Cause',
    careerFields: ['Non-Profit Leadership', 'Environmental Advocacy', 'Creative Directing', 'Medicine'],
    lifeLesson: 'Releasing past disappointments to champion present transformative work.',
  },
};

export const NUMBER_MEANINGS: Record<number, string> = {
  1: 'Number 1 embodies pure initiative, independence, original thought, and decisive focus. It favors solo leadership and groundbreaking beginnings.',
  2: 'Number 2 channels gentle diplomacy, emotional awareness, balanced collaboration, and keen observational sensitivity.',
  3: 'Number 3 vibrates with radiant enthusiasm, joyful expression, linguistic flair, and an expansive creative imagination.',
  4: 'Number 4 stands for solid bedrock, disciplined craftsmanship, methodical planning, and dependable endurance.',
  5: 'Number 5 signifies quick-witted flexibility, adventure, progressive curiosity, and a magnetic commercial instinct.',
  6: 'Number 6 emanates nurturing responsibility, domestic harmony, aesthetic grace, and trustworthy community guidance.',
  7: 'Number 7 represents contemplative depth, analytical discernment, philosophical curiosity, and spiritual exploration.',
  8: 'Number 8 reflects executive ambition, sound financial judgment, organizational scale, and karmic resilience.',
  9: 'Number 9 encompasses universal benevolence, visionary courage, compassionate broad-mindedness, and inspirational mentorship.',
  11: 'Master Number 11 (The Visionary Illuminator) combines the sensitivity of 2 with high intuitive lightning, inspiring others through elevated perception.',
  22: 'Master Number 22 (The Master Builder) bridges celestial vision with practical reality, capable of constructing vast enduring enterprises.',
  33: 'Master Number 33 (The Master Teacher) embodies dedicated selfless service, universal empathy, and compassionate upliftment for humanity.',
};

export const LO_SHU_MEANINGS: Record<number, string> = {
  1: 'Water element & Career flow: Reflects communication versatility, personal expression, and adaptability in professional currents.',
  2: 'Earth element & Partnerships: Governs emotional intuition, relationship harmony, patience, and empathetic receptivity.',
  3: 'Wood element & Family / Mental vitality: Influences creative insight, intellectual clarity, ancestral bonds, and optimistic growth.',
  4: 'Wood element & Wealth discipline: Guides pragmatic organization, financial order, spatial planning, and steady prosperity.',
  5: 'Central Earth & Balance: Represents the core spine of life equilibrium, personal freedom, versatility, and emotional stability.',
  6: 'Metal element & Supportive friends: Governs home elegance, family loyalty, benefactors, and community responsibilities.',
  7: 'Metal element & Children / Creativity: Reflects experiential wisdom, reflective curiosity, artistic expression, and resilience through change.',
  8: 'Earth element & Knowledge: Represents studious perseverance, structural memory, analytical discipline, and moral wisdom.',
  9: 'Fire element & Fame / Recognition: Radiates ambition, charismatic presence, social reputation, and energetic vitality.',
};
