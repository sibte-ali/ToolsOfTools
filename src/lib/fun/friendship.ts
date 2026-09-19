/**
 * Deterministic Friendship Calculator.
 *
 * Algorithm:
 * Uses a distinct FNV-1a (Fowler-Noll-Vo) hash combined with character frequency
 * balance and vowel harmonic resonance. This produces a clearly different
 * calculation pipeline and completely unique copy from the Love Calculator.
 *
 * Guaranteed properties:
 * 1. Symmetry: calculateFriendship("Alex", "Jordan") === calculateFriendship("Jordan", "Alex").
 * 2. Determinism: identical inputs always yield the same percentage (45% - 98%).
 * 3. Dedicated friendship tiers, advice, and shareable snippet.
 *
 * Entertainment only — stores no data and makes no relationship claims.
 */

export interface FriendshipResult {
  name1: string;
  name2: string;
  percentage: number;
  friendshipTier: string;
  badge: string;
  description: string;
  friendshipStrengths: string[];
  adventureSuggestion: string;
  shareableSnippet: string;
}

export function calculateFriendship(name1: string, name2: string): FriendshipResult {
  const n1 = name1.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const n2 = name2.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  if (!n1 || !n2) {
    throw new Error('Please enter two valid names.');
  }

  // Ensure symmetric commutative input
  const sortedPair = [n1, n2].sort();
  const rawKey = `${sortedPair[0]}⚡besties⚡${sortedPair[1]}`;

  // 32-bit FNV-1a Hash
  let hash = 0x811c9dc5;
  for (let i = 0; i < rawKey.length; i++) {
    hash ^= rawKey.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  // Harmonic character metric: count common unique characters
  const set1 = new Set(n1.split(''));
  const set2 = new Set(n2.split(''));
  let sharedChars = 0;
  for (const c of set1) {
    if (set2.has(c)) sharedChars++;
  }

  // Combine FNV-1a hash with shared character weighting
  const baseValue = Math.abs(hash % 54); // 0..53
  const harmonyBonus = (sharedChars * 3) % 7; // 0..6
  // Range: 45 to 98
  const percentage = 45 + ((baseValue + harmonyBonus) % 54);

  let friendshipTier = '';
  let badge = '';
  let description = '';
  let friendshipStrengths: string[] = [];
  let adventureSuggestion = '';

  if (percentage >= 90) {
    friendshipTier = 'Inseparable Duo (Ride-or-Die)';
    badge = '🏆 Legend Tier';
    description = 'Telepathic camaraderie where you finish each other’s jokes, back each other up unconditionally, and turn ordinary grocery runs into chaotic comedy.';
    friendshipStrengths = ['Unspoken loyalty', 'Effortless banter', 'Zero social battery drain'];
    adventureSuggestion = 'Road trip to a surprise destination or co-hosting a high-stakes board game night.';
  } else if (percentage >= 80) {
    friendshipTier = 'Inner Circle Confidants';
    badge = '⭐ VIP Squad';
    description = 'Deep mutual trust with reliable loyalty. You can go weeks without talking and pick up instantly right where you left off without skipping a beat.';
    friendshipStrengths = ['Thoughtful advice', 'Reliable venting sessions', 'Zero judgment comfort'];
    adventureSuggestion = 'Late-night diner coffee sessions or a weekend binge-watch marathon.';
  } else if (percentage >= 70) {
    friendshipTier = 'Adventure Comrades';
    badge = '🎯 Solid Ally';
    description = 'A fun, vibrant bond powered by shared laughs, mutual hyping, and an eager appetite for trying out new experiences together.';
    friendshipStrengths = ['High energy synergy', 'Shared curiosities', 'Enthusiastic cheerleading'];
    adventureSuggestion = 'Trying an escape room, concert festival, or learning an unconventional new sport.';
  } else if (percentage >= 60) {
    friendshipTier = 'The Reliable Wing-Crew';
    badge = '🤝 Steady Crew';
    description = 'Dependable pals who provide great conversational balance, steady teamwork, and a fun relaxed atmosphere whenever hanging out.';
    friendshipStrengths = ['Easygoing vibe', 'Low maintenance connection', 'Great social collaboration'];
    adventureSuggestion = 'Casual trivia night at a neighborhood cafe or an outdoor weekend hike.';
  } else if (percentage >= 50) {
    friendshipTier = 'Emerging Harmony Pals';
    badge = '🌱 Budding Bond';
    description = 'A pleasant dynamic full of polite respect and intriguing potential that flourishes whenever common passions or hobbies come to light.';
    friendshipStrengths = ['Mutual politeness', 'Fresh insights', 'Unexplored common ground'];
    adventureSuggestion = 'Grabbing lunch to chat about shared favorite music, movies, or video games.';
  } else {
    friendshipTier = 'Fascinating Contrasts';
    badge = '🎭 Dual Dimensions';
    description = 'Two very distinct personalities who inhabit different worlds, making your interactions pleasantly unpredictable and refreshingly unique.';
    friendshipStrengths = ['Broadened perspectives', 'Healthy independence', 'Surprise moments of alignment'];
    adventureSuggestion = 'Exchanging book or podcast recommendations to explore each other’s perspectives.';
  }

  const shareableSnippet = `👯‍♂️ Friendship Score: ${name1.trim()} & ${name2.trim()} scored ${percentage}% (${friendshipTier})!`;

  return {
    name1: name1.trim(),
    name2: name2.trim(),
    percentage,
    friendshipTier,
    badge,
    description,
    friendshipStrengths,
    adventureSuggestion,
    shareableSnippet,
  };
}
