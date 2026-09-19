/**
 * Deterministic Love Calculator.
 *
 * Algorithm:
 * Uses a modified DJB2 hash over the alphabetically ordered, trimmed, and
 * normalized name pair. This guarantees:
 * 1. Order-invariance: calculateLove("Alice", "Bob") === calculateLove("Bob", "Alice").
 * 2. Determinism: same input always produces identical percentage and tier message.
 * 3. Range bounded to 40% - 99% (preventing extreme demoralizing 0% outcomes for fun).
 *
 * Strictly for entertainment purposes. No personal data is ever recorded or transmitted.
 */

export interface LoveResult {
  name1: string;
  name2: string;
  percentage: number;
  tier: string;
  headline: string;
  message: string;
  strengths: string[];
  tips: string;
  shareText: string;
}

export function calculateLove(name1: string, name2: string): LoveResult {
  const n1 = name1.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const n2 = name2.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  if (!n1 || !n2) {
    throw new Error('Please enter two valid names.');
  }

  // Ensure commutative symmetry: sort names alphabetically
  const [first, second] = [n1, n2].sort();
  const seed = `${first}♥${second}`;

  // Modified DJB2 hash
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash) + seed.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);

  // Map to 40% - 99% range (span of 60 values)
  const percentage = 40 + (positiveHash % 60);

  let tier = '';
  let headline = '';
  let message = '';
  let strengths: string[] = [];
  let tips = '';

  if (percentage >= 90) {
    tier = 'Stellar Resonance';
    headline = 'Cosmic Chemistry & Effortless Alignment';
    message = 'You share a remarkably fluid dynamic with natural conversational ease, playful chemistry, and intuitive understanding.';
    strengths = ['Unspoken communication', 'Shared sense of adventure', 'Mutual encouragement'];
    tips = 'Keep creating shared memories and celebrate the little daily quirks you both enjoy.';
  } else if (percentage >= 80) {
    tier = 'High Harmony';
    headline = 'Vibrant Connection & Warm Affection';
    message = 'A warm, uplifting balance of mutual respect and lively curiosity. You bring out positive energy and genuine smiles in each other.';
    strengths = ['Great listening skills', 'Comfortable banter', 'Strong emotional support'];
    tips = 'Plan fun spontaneous outings or collaborative projects to deepen your natural rhythm.';
  } else if (percentage >= 70) {
    tier = 'Dynamic Spark';
    headline = 'Engaging Chemistry & Mutual Curiosity';
    message = 'Plenty of spark, excitement, and room to discover fascinating common ground as you share stories and explore new interests.';
    strengths = ['Energizing discussions', 'Creative contrast', 'Exciting perspectives'];
    tips = 'Focus on quality one-on-one time without digital distractions to build deeper rapport.';
  } else if (percentage >= 60) {
    tier = 'Balanced Contrast';
    headline = 'Complementary Energy & Intriguing Variety';
    message = 'You approach life from pleasantly different angles, offering each other fresh viewpoints that keep conversations intriguing.';
    strengths = ['Different strengths', 'Broadened horizons', 'Mutual learning'];
    tips = 'Patience and curious questions turn differences into great collaborative strengths.';
  } else if (percentage >= 50) {
    tier = 'Curious Discovery';
    headline = 'Untapped Potential & Fresh Ground';
    message = 'An intriguing slate where shared interests are waiting to be uncovered through open conversations and lighthearted humor.';
    strengths = ['Fresh perspective', 'Element of surprise', 'Independence'];
    tips = 'Find one shared hobby, movie genre, or favorite dish to serve as your common comfort zone.';
  } else {
    tier = 'Unique Paths';
    headline = 'Fiercely Independent Spirits';
    message = 'Distinct personalities with unique individual wavelengths that create a delightfully unexpected and original encounter.';
    strengths = ['Clear boundaries', 'Individual authenticity', 'Zero pretense'];
    tips = 'Enjoy the contrast and celebrate what makes each person completely one-of-a-kind.';
  }

  const shareText = `${name1.trim()} & ${name2.trim()} scored ${percentage}% (${tier}) on the Love Calculator!`;

  return {
    name1: name1.trim(),
    name2: name2.trim(),
    percentage,
    tier,
    headline,
    message,
    strengths,
    tips,
    shareText,
  };
}
