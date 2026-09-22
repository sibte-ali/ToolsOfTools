/**
 * Kruti Dev 010 <-> Unicode Devanagari conversion engine
 *
 * Kruti Dev 010 is a legacy ASCII-encoded Hindi font where ASCII characters
 * map to Devanagari visual glyphs. Standard Devanagari uses Unicode U+0900–U+097F.
 *
 * Mangal is Windows' default standard Unicode Devanagari font; its codepoints
 * are identical to Unicode Devanagari.
 */

import type { KrutiDevVariant, KrutiDevOptions } from './types.js';

// =============================================================================
// MAPPING TABLE
// Ordered longest-match first within each group so replaceAll is greedy-safe.
// =============================================================================

export const KRUTI_TO_UNICODE_MAP: [string, string][] = [
  // Typographic quotes – replace before any other pass
  ['\u201c', '\u201c'], ['\u201d', '\u201d'], ['\u2018', '\u2018'], ['\u2019', '\u2019'],

  // Special conjuncts & compound glyphs (multi-char Kruti Dev sequences)
  ['\u0915\u094d\u0926\u094d', '\u0915\u094d\u0926'], // क्द्
  ['\u0926\u094d\u0917', '\u0926\u094d\u0917'],        // द्ग
  ['\u0926\u094d\u0918', '\u0926\u094d\u0918'],        // द्घ
  ['\u0926\u094d\u0926', '\u0926\u094d\u0926'],        // द्द
  ['\u0926\u094d\u0927', '\u0926\u094d\u0927'],        // द्ध
  ['\u0926\u094d\u092c', '\u0926\u094d\u092c'],        // द्ब
  ['\u0926\u094d\u092d', '\u0926\u094d\u092d'],        // द्भ
  ['\u0926\u094d\u092e', '\u0926\u094d\u092e'],        // द्म
  ['\u0926\u094d\u092f', '\u0926\u094d\u092f'],        // द्य
  ['\u0926\u094d\u0935', '\u0926\u094d\u0935'],        // द्व
  ['\u0915\u094d\u0924', '\u0915\u094d\u0924'],        // क्त
  ['\u091c\u094d\u091e', '\u091c\u094d\u091e'],        // ज्ञ
  ['\u0924\u094d\u0930', '\u0924\u094d\u0930'],        // त्र
  ['\u0915\u094d\u0937', '\u0915\u094d\u0937'],        // क्ष
  ['\u0936\u094d\u0930', '\u0936\u094d\u0930'],        // श्र

  // Devanagari digits -> Unicode Devanagari digits
  ['0', '\u0966'], ['1', '\u0967'], ['2', '\u0968'], ['3', '\u0969'], ['4', '\u096a'],
  ['5', '\u096b'], ['6', '\u096c'], ['7', '\u096d'], ['8', '\u096e'], ['9', '\u096f'],

  // Multi-character independent vowel ligatures in Kruti Dev
  ['vks', '\u0913'], ['vkS', '\u0914'], ['vk', '\u0906'], ['v', '\u0905'],
  ['bZ', '\u0908'], ['b', '\u0907'], ['m', '\u0909'], ['\u00c5', '\u090a'],
  [',', '\u090f'],
  ['\u0943', '\u0943'], // ऋ pass-through

  // Consonants with multi-char Kruti Dev representations (order: longer first)
  ['d', '\u0915'],   // क
  ['[k', '\u0916'],  // ख
  ['x', '\u0917'],   // ग
  ['?k', '\u0918'],  // घ
  ['\u00b3', '\u0919'], // ङ
  ['p', '\u091a'],   // च
  ['N', '\u091b'],   // छ
  ['t', '\u091c'],   // ज
  ['P', '\u091d'],   // झ
  ['\u00a5', '\u091e'], // ञ
  ['V', '\u091f'],   // ट
  ['B', '\u0920'],   // ठ
  ['M', '\u0921'],   // ड
  ['<', '\u0922'],   // ढ
  ['.k', '\u0923'],  // ण
  ['r', '\u0924'],   // त
  ['Fk', '\u0925'],  // थ
  ['n', '\u0926'],   // द
  ['/k', '\u0927'],  // ध
  ['u', '\u0928'],   // न
  ['i', '\u092a'],   // प
  ['Q', '\u092b'],   // फ
  ['c', '\u092c'],   // ब
  ['Hk', '\u092d'],  // भ
  ['e', '\u092e'],   // म
  [';', '\u092f'],   // य
  ['j', '\u0930'],   // र
  ['y', '\u0932'],   // ल
  ['o', '\u0935'],   // व
  ["'k", '\u0936'],  // श
  ['"k', '\u0937'],  // ष
  ['l', '\u0938'],   // स
  ['g', '\u0939'],   // ह

  // Half-consonants / Halant forms (Kruti Dev single-char → Unicode consonant + virama)
  ['D', '\u0915\u094d'],  // क्
  ['[', '\u0916\u094d'],  // ख्
  ['X', '\u0917\u094d'],  // ग्
  ['?', '\u0918\u094d'],  // घ्
  ['T', '\u091c\u094d'],  // ज्
  ['R', '\u0924\u094d'],  // त्
  ['F', '\u0925\u094d'],  // थ्
  ['/', '\u0927\u094d'],  // ध्
  ['U', '\u0928\u094d'],  // न्
  ['I', '\u092a\u094d'],  // प्
  ['C', '\u092c\u094d'],  // ब्
  ['H', '\u092d\u094d'],  // भ्
  ['E', '\u092e\u094d'],  // म्
  ['Y', '\u0932\u094d'],  // ल्
  ['O', '\u0935\u094d'],  // व्
  ["'", '\u0936\u094d'],  // श्
  ['"', '\u0937\u094d'],  // ष्
  ['L', '\u0938\u094d'],  // स्

  // Matras (vowel signs) — multi-char matras before single-char
  ['kS', '\u094c'], // ौ
  ['ks', '\u094b'], // ो
  ['k', '\u093e'],  // ा
  ['h', '\u0940'],  // ी
  ['q', '\u0941'],  // ु
  ['w', '\u0942'],  // ू
  ['`', '\u0943'],  // ृ
  ['s', '\u0947'],  // े
  ['S', '\u0948'],  // ै
  ['a', '\u0902'],  // ं
  ['\u00a1', '\u0901'], // ँ (chandrabindu)
  ['%', '\u0903'],  // ः
  ['~', '\u094d'],  // ् (virama/halant)

  // Symbols & special punctuation
  ['A', '\u0964'],  // । (danda)
  ['\u0965', '\u0965'], // ॥ pass-through
  // Named conjunct shortcuts
  ['K', '\u091c\u094d\u091e'], // ज्ञ
  ['=', '\u0924\u094d\u0930'], // त्र
  ['{', '\u0915\u094d\u0937'], // क्ष
];

// =============================================================================
// VARIANT PATCHES
// Kruti Dev 011, 016, 055, and 060 share 95%+ of the 010 character set, but have
// specific differences in extended characters, brackets, and typographic signs.
// =============================================================================

export const KRUTI_VARIANT_PATCHES: Record<KrutiDevVariant, Array<[string, string]>> = {
  '010': [],
  '011': [
    ['^', '\u2018'], // Alternate single quote
    ['&', '\u0915\u0943'], // kṛ ligature
  ],
  '016': [
    ['^', '\u0950'], // Om symbol in some 016 print releases
    ['\u00A3', '\u0930\u0941'], // Ru currency / glyph alternate
  ],
  '055': [
    ['\u201c', '"'],
    ['\u201d', '"'],
    ['\u2018', "'"],
    ['\u2019', "'"],
  ],
  '060': [
    ['\u00A7', '\u0965'], // Double danda alternate
  ],
};

// =============================================================================
// KRUTI DEV → UNICODE DEVANAGARI
// =============================================================================

/**
 * Convert a Kruti Dev 010-encoded string to Unicode Devanagari.
 *
 * Algorithmic Steps:
 * 1. Pre-process Reph: In Kruti Dev, Reph 'Z' is typed AFTER the consonant it sits
 *    above (e.g. `doZ` = धर्म). We swap Z before the consonant cluster so it maps to र्.
 * 2. Run greedy longest-first mapping replacements.
 * 3. Reorder Chhoti Ee ('f' -> 'ि'): In Kruti Dev, 'f' is typed BEFORE the consonant,
 *    whereas in Unicode, 'ि' attaches AFTER the consonant cluster.
 * 4. Replace remaining Reph marker 'Z' with Unicode 'र्'.
 * 5. Resolve any virama + matra ordering conflicts (e.g. ्ि -> ि्).
 */
export function krutiDevToUnicode(krutiText: string, options?: KrutiDevOptions): string {
  if (!krutiText) return '';
  let text = krutiText;

  // Step 1: Move reph 'Z' before the consonant cluster it belongs to.
  // In Kruti Dev, 'Z' sits on top of the immediately preceding consonant cluster.
  const kdConsonants = '(?:(?:\\[k|\\?k|\\.k|Fk|\\/k|Hk|\'k|"k)|[dxptVBM<runeic;jyolgK={])';
  const kdHalfConsonants = '[D\\[X?TRF/UICE\'"LYO]';
  const rephRegex = new RegExp(`(${kdHalfConsonants}*${kdConsonants}[qw\`]?)Z`, 'g');
  text = text.replace(rephRegex, 'Z$1');

  // Step 2: Multi-character map replacements.
  for (const [kd, uni] of KRUTI_TO_UNICODE_MAP) {
    if (text.includes(kd)) {
      text = text.replaceAll(kd, uni);
    }
  }

  // Step 3: Reorder chhoti ee ki matra 'f' → ि.
  // Match `f` followed by a consonant cluster (optional half-consonants + base consonant)
  const chotiEeRegex = /f((?:[\u0915-\u0939\u0958-\u095F]\u093c?\u094d)*[\u0915-\u0939\u0958-\u095F]\u093c?)/g;
  text = text.replace(chotiEeRegex, '$1\u093f');

  // Step 4: Replace reph placeholder 'Z' with Unicode र्.
  text = text.replaceAll('Z', '\u0930\u094d');

  // Step 5: Fix virama + ि ordering artifacts.
  text = text.replace(/\u093f\u094d/g, '\u094d\u093f');

  // Step 6: Apply variant or custom patches if specified
  const variant = options?.variant || '010';
  const variantPatches = KRUTI_VARIANT_PATCHES[variant] || [];
  for (const [from, to] of variantPatches) {
    text = text.replaceAll(from, to);
  }

  if (options?.customPatches) {
    for (const [from, to] of options.customPatches) {
      text = text.replaceAll(from, to);
    }
  }

  return text;
}

// =============================================================================
// UNICODE DEVANAGARI → KRUTI DEV
// =============================================================================

/**
 * Convert a Unicode Devanagari string to Kruti Dev 010 encoding.
 *
 * Algorithmic Steps:
 * 1. Move Chhoti Ee ('ि') to preceding position ('f') before the consonant cluster.
 * 2. Move Reph ('र्') after the consonant cluster but before following matras as 'Z'.
 * 3. Reverse-map characters using longest-match first order to avoid prefix collisions.
 */
export function unicodeToKrutiDev(uniText: string, options?: KrutiDevOptions): string {
  if (!uniText) return '';
  let text = uniText;

  // Step 1: Move ि before the consonant cluster.
  const chotiEeRegex = /((?:[\u0900-\u097F]\u094d)*[\u0900-\u097F])\u093f/g;
  text = text.replace(chotiEeRegex, 'f$1');

  // Step 2: Reorder रेफ (र्): In Kruti Dev, Z comes AFTER the consonant base but BEFORE the matra.
  // E.g. Unicode: र्मा → Kruti Dev: eZk (म + Z + ा)
  const rephRegex = /\u0930\u094d((?:[\u0900-\u097f]\u094d)*[\u0900-\u097f])([\u093e\u0940\u0941\u0942\u0947\u0948\u094b\u094c\u0943]*)/g;
  text = text.replace(rephRegex, '$1Z$2');

  // Step 3: Reverse-map (sort by Unicode value length descending).
  const reverseMap = [...KRUTI_TO_UNICODE_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [kd, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, kd);
    }
  }

  // Step 4: Apply variant or custom reverse patches
  const variant = options?.variant || '010';
  const variantPatches = KRUTI_VARIANT_PATCHES[variant] || [];
  for (const [kd, uni] of variantPatches) {
    text = text.replaceAll(uni, kd);
  }

  if (options?.customPatches) {
    for (const [kd, uni] of options.customPatches) {
      text = text.replaceAll(uni, kd);
    }
  }

  return text;
}

// =============================================================================
// MANGAL ALIASES
// =============================================================================

export const krutiDevToMangal = krutiDevToUnicode;
export const mangalToKrutiDev = unicodeToKrutiDev;
