/**
 * Chanakya <-> Unicode Devanagari conversion engine
 *
 * Chanakya (by Modular InfoTech, Pune) was one of the most popular Hindi fonts
 * in newspaper and magazine publishing during the 1990s–2000s.  Unlike Kruti Dev
 * (Remington layout), Chanakya uses its own key mapping designed for fast
 * typesetting rather than typewriter compatibility.
 *
 * This module provides bidirectional conversion between Chanakya-encoded ASCII
 * text and standard Unicode Devanagari (U+0900–U+097F).
 */

// =============================================================================
// MAPPING TABLE — Chanakya ASCII → Unicode Devanagari
// Longer sequences listed before shorter ones for greedy matching.
// =============================================================================

export const CHANAKYA_TO_UNICODE_MAP: [string, string][] = [
  // Typographic quotes — process first
  ['\u201c', '\u201c'], ['\u201d', '\u201d'], ['\u2018', '\u2018'], ['\u2019', '\u2019'],

  // ── COMPOUND / SPECIAL SEQUENCES ───────────────────────────────────────────
  // IMPORTANT: These single-key shortcut entries MUST appear before any
  // individual half-consonant entries so the reverse lookup map hits these
  // three-codepoint sequences first.
  // DO NOT add multi-char Chanakya key variants (e.g. k{) here — they confuse
  // the reverse map and produce 'k{' instead of '{' for क्ष.
  ['{',  '\u0915\u094d\u0937'],   // क्ष (shortcut: single key {)
  ['K',  '\u091c\u094d\u091e'],   // ज्ञ (shortcut: single key K)
  ['\\', '\u0924\u094d\u0930'],   // त्र (backslash = त्र in Chanakya)

  // Multi-char independent vowel representations
  ['vks', '\u0913'], // ओ
  ['vkS', '\u0914'], // औ
  ['vk',  '\u0906'], // आ
  ['v',   '\u0905'], // अ
  ['bZ',  '\u0908'], // ई
  ['b',   '\u0907'], // इ
  ['\u00dc', '\u090a'], // ऊ  (Ü in Chanakya encoding)
  ['u',   '\u0909'], // उ
  [',',   '\u090f'], // ए
  ['\u00e6', '\u0910'], // ऐ
  ['\u00f5', '\u0911'], // ऑ (ऑ candrabindu o)
  ['\u00f2', '\u0912'], // ऒ

  // Devanagari digits
  ['0', '\u0966'], ['1', '\u0967'], ['2', '\u0968'], ['3', '\u0969'], ['4', '\u096a'],
  ['5', '\u096b'], ['6', '\u096c'], ['7', '\u096d'], ['8', '\u096e'], ['9', '\u096f'],

  // ── MULTI-CHAR CONSONANTS (longer first) ───────────────────────────────────
  ['[k', '\u0916'],  // ख
  ['?k', '\u0918'],  // घ
  ['.k', '\u0923'],  // ण
  ['Fk', '\u0925'],  // थ
  ['/k', '\u0927'],  // ध
  ['Hk', '\u092d'],  // भ
  ["'k", '\u0936'],  // श
  ['"k', '\u0937'],  // ष

  // ── SINGLE-CHAR CONSONANTS ──────────────────────────────────────────────────
  ['d', '\u0915'],   // क
  ['x', '\u0917'],   // ग
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
  ['r', '\u0924'],   // त
  ['U', '\u0928'],   // न — NOTE: Chanakya differs from Kruti Dev here
  ['i', '\u092a'],   // प
  ['Q', '\u092b'],   // फ
  ['c', '\u092c'],   // ब
  ['e', '\u092e'],   // म
  [';', '\u092f'],   // य
  ['j', '\u0930'],   // र
  ['y', '\u0932'],   // ल
  ['o', '\u0935'],   // व
  ['l', '\u0938'],   // स
  ['g', '\u0939'],   // ह

  // ── HALF-CONSONANTS / HALANT FORMS ─────────────────────────────────────────
  ['D', '\u0915\u094d'],  // क्
  ['[', '\u0916\u094d'],  // ख्
  ['X', '\u0917\u094d'],  // ग्
  ['?', '\u0918\u094d'],  // घ्
  ['T', '\u091c\u094d'],  // ज्
  ['R', '\u0924\u094d'],  // त्
  ['F', '\u0925\u094d'],  // थ्
  ['/', '\u0927\u094d'],  // ध्
  ['n', '\u0928\u094d'],  // न् — Chanakya: 'n' = half-न
  ['I', '\u092a\u094d'],  // प्
  ['C', '\u092c\u094d'],  // ब्
  ['H', '\u092d\u094d'],  // भ्
  ['E', '\u092e\u094d'],  // म्
  ['Y', '\u0932\u094d'],  // ल्
  ['O', '\u0935\u094d'],  // व्
  ["'", '\u0936\u094d'],  // श्
  ['"', '\u0937\u094d'],  // ष्
  ['L', '\u0938\u094d'],  // स्

  // ── MULTI-CHAR MATRAS (longer first) ───────────────────────────────────────
  ['kS', '\u094c'], // ौ
  ['ks', '\u094b'], // ो

  // ── SINGLE-CHAR MATRAS ─────────────────────────────────────────────────────
  ['k',  '\u093e'], // ा
  ['h',  '\u0940'], // ी
  ['q',  '\u0941'], // ु
  ['w',  '\u0942'], // ू
  ['`',  '\u0943'], // ृ
  ['s',  '\u0947'], // े
  ['S',  '\u0948'], // ै
  ['a',  '\u0902'], // ं
  ['\u00a1', '\u0901'], // ँ
  ['%',  '\u0903'], // ः
  ['~',  '\u094d'], // ् (virama)
  ['^',  '\u093c'], // ़ (nukta)

  // ── SYMBOLS ────────────────────────────────────────────────────────────────
  ['A',  '\u0964'], // ।
  ['\u0965', '\u0965'], // ॥

  // Chanakya conjunct shortcuts (also defined at top for greedy reverse-map matching)
  // Keeping them here ensures the forward pass also has them in case text is in ASCII form
];

// =============================================================================
// CHANAKYA → UNICODE DEVANAGARI
// =============================================================================

/**
 * Convert a Chanakya-encoded string to Unicode Devanagari.
 *
 * Algorithm:
 * 1. Pre-process reph 'Z' (typed AFTER the consonant in Chanakya).
 * 2. Run map replacements (longest-first ordering handles ambiguity).
 * 3. Reorder chhoti ee ki matra 'f' → ि (pre-base in Chanakya, post-base in Unicode).
 * 4. Replace reph placeholder 'Z' with Unicode र्.
 * 5. Fix virama + ि ordering artifacts.
 */
export function chanakyaToUnicode(chanakyaText: string): string {
  if (!chanakyaText) return '';
  let text = chanakyaText;

  // Step 1: Move reph 'Z' before the consonant cluster.
  const rephRegex = /([a-zA-Z[\]?'"`~=%^\\]+)Z/g;
  text = text.replace(rephRegex, 'Z$1');

  // Step 2: Map replacements.
  for (const [ch, uni] of CHANAKYA_TO_UNICODE_MAP) {
    if (text.includes(ch)) {
      text = text.replaceAll(ch, uni);
    }
  }

  // Step 3: Reorder chhoti ee ki matra 'f' → ि.
  const chotiEeRegex = /f((?:[\u0915-\u0939\u0958-\u095F]\u093c?\u094d)*[\u0915-\u0939\u0958-\u095F]\u093c?)/g;
  text = text.replace(chotiEeRegex, '$1\u093f');

  // Step 4: Replace reph placeholder 'Z' with Unicode र्.
  text = text.replaceAll('Z', '\u0930\u094d');

  // Step 5: Fix virama + ि ordering artifacts.
  text = text.replace(/\u093f\u094d/g, '\u094d\u093f');

  return text;
}

// =============================================================================
// UNICODE DEVANAGARI → CHANAKYA
// =============================================================================

/**
 * Convert Unicode Devanagari to Chanakya font encoding.
 *
 * Algorithm (reverse of chanakyaToUnicode):
 * 1. Reorder ि → pre-base 'f'.
 * 2. Reorder रेफ → post-consonant 'Z'.
 * 3. Reverse-map sorted by Unicode length descending.
 */
export function unicodeToChanakya(uniText: string): string {
  if (!uniText) return '';
  let text = uniText;

  // Step 1: Move ि before the consonant cluster.
  const chotiEeRegex = /((?:[\u0900-\u097F]\u094d)*[\u0900-\u097F])\u093f/g;
  text = text.replace(chotiEeRegex, 'f$1');

  // Step 2: Reorder reph.
  const rephRegex = /\u0930\u094d((?:[\u0900-\u097f]\u094d)*[\u0900-\u097f])([\u093e\u0940\u0941\u0942\u0947\u0948\u094b\u094c\u0943]*)/g;
  text = text.replace(rephRegex, '$1Z$2');

  // Step 3: Reverse-map.
  const reverseMap = [...CHANAKYA_TO_UNICODE_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [ch, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, ch);
    }
  }

  return text;
}
