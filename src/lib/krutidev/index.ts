/**
 * Kruti Dev 010 <-> Unicode Devanagari conversion engine
 *
 * Kruti Dev 010 is a legacy ASCII-encoded Hindi font where each ASCII
 * character maps to a Devanagari glyph.  Unicode Devanagari uses the
 * standard U+0900–U+097F block.
 *
 * Mangal is a standard Unicode Devanagari font; it uses the same codepoints
 * as any other Unicode Devanagari font, so krutiDevToMangal / mangalToKrutiDev
 * are identical to krutiDevToUnicode / unicodeToKrutiDev respectively.
 */

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
  ['P', '\u091d'],   // झ — NOTE: also used as half-च्; longer matches above handle disambiguation
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
  ['Q', '\u092b'],   // फ — NOTE: also half-फ्; handled by ordering
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
  ['A', '\u0964'],  // ।  (danda)
  ['\u0965', '\u0965'], // ॥ pass-through
  // Named conjunct shortcuts
  ['K', '\u091c\u094d\u091e'], // ज्ञ
  ['=', '\u0924\u094d\u0930'], // त्र
  ['{', '\u0915\u094d\u0937'], // क्ष
];

// =============================================================================
// KRUTI DEV → UNICODE DEVANAGARI
// =============================================================================

/**
 * Convert a Kruti Dev 010-encoded string to Unicode Devanagari.
 *
 * Algorithm:
 * 1. Pre-process reph: Kruti Dev writes रeph as 'Z' AFTER the consonant it
 *    sits on top of (e.g. `eZ` = र्म). We move Z before the consonant cluster
 *    so that after mapping, it becomes र् in the correct Unicode position.
 * 2. Run all map replacements (longest-first ordering handles ambiguity).
 * 3. Reorder chhoti ee ki matra: Kruti Dev writes `f` BEFORE the consonant
 *    (e.g. `fd` = कि). After mapping, we move ि to follow the cluster.
 * 4. Replace the reph placeholder 'Z' with Unicode र्.
 * 5. Fix any virama + ि ordering artifacts.
 */
export function krutiDevToUnicode(krutiText: string): string {
  if (!krutiText) return '';
  let text = krutiText;

  // Step 1: Move reph 'Z' before the consonant cluster it belongs to.
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
  // After step 2, 'f' is still ASCII (not in the map).
  // Match `f` followed by a consonant cluster (optional half-consonants + base consonant)
  const chotiEeRegex = /f((?:[\u0915-\u0939\u0958-\u095F]\u093c?\u094d)*[\u0915-\u0939\u0958-\u095F]\u093c?)/g;
  text = text.replace(chotiEeRegex, '$1\u093f');

  // Step 4: Replace reph placeholder 'Z' with Unicode र्.
  text = text.replaceAll('Z', '\u0930\u094d');

  // Step 5: Fix virama + ि ordering (artifact of some edge cases).
  text = text.replace(/\u093f\u094d/g, '\u094d\u093f');

  return text;
}

// =============================================================================
// UNICODE DEVANAGARI → KRUTI DEV
// =============================================================================

/**
 * Convert a Unicode Devanagari string to Kruti Dev 010 encoding.
 *
 * Algorithm (reverse of krutiDevToUnicode):
 * 1. Reorder chhoti ee ki matra (ि): In Unicode it follows the cluster;
 *    in Kruti Dev, 'f' must precede the cluster.
 * 2. Reorder reph (र्): In Unicode it precedes the consonant; in Kruti Dev
 *    'Z' follows the consonant.
 * 3. Reverse-map using the same table sorted by Unicode string length descending
 *    (longest match first prevents partial replacements).
 */
export function unicodeToKrutiDev(uniText: string): string {
  if (!uniText) return '';
  let text = uniText;

  // Step 1: Move ि before the consonant cluster.
  // Match: optional half-consonant(s) (consonant + virama) + consonant + ि
  const chotiEeRegex = /((?:[\u0900-\u097F]\u094d)*[\u0900-\u097F])\u093f/g;
  text = text.replace(chotiEeRegex, 'f$1');

  // Step 2: Reorder रेफ (र्): In Kruti Dev, Z comes AFTER the consonant base but BEFORE the matra.
  // E.g. Unicode: र्मा → Kruti Dev: eZk (म + Z + ा, NOT म + ा + Z)
  // Regex: match र् + consonant-cluster (with half-consonants), capture: (cluster)(matras)
  const rephRegex = /\u0930\u094d((?:[\u0900-\u097f]\u094d)*[\u0900-\u097f])([\u093e\u0940\u0941\u0942\u0947\u0948\u094b\u094c\u0943]*)/g;
  text = text.replace(rephRegex, '$1Z$2');

  // Step 3: Reverse-map (sort by Unicode value length descending).
  const reverseMap = [...KRUTI_TO_UNICODE_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [kd, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, kd);
    }
  }

  return text;
}

// =============================================================================
// MANGAL ALIASES
// Mangal is a standard Unicode Devanagari font (Windows bundled).
// It uses identical codepoints to any other Unicode Devanagari font, so
// Kruti Dev ↔ Mangal conversion is the same as Kruti Dev ↔ Unicode.
// =============================================================================

/**
 * Convert Kruti Dev 010 text to Mangal-compatible Unicode Devanagari.
 * Functionally identical to krutiDevToUnicode.
 */
export const krutiDevToMangal = krutiDevToUnicode;

/**
 * Convert Mangal (Unicode Devanagari) text back to Kruti Dev 010 encoding.
 * Functionally identical to unicodeToKrutiDev.
 */
export const mangalToKrutiDev = unicodeToKrutiDev;
