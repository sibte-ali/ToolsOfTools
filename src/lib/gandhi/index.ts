/**
 * 4C Gandhi <-> Unicode Gujarati conversion engine
 *
 * 4C Gandhi is a legacy ASCII-encoded Gujarati font used extensively in
 * Gujarat government offices, courts, and regional newspapers.  Like Kruti Dev
 * for Hindi, it stores ASCII characters that the font paints as Gujarati glyphs.
 *
 * Unicode Gujarati uses the U+0A80–U+0AFF block.
 *
 * Reference: The Gandhi font family (Gandhi, Gandhi_D, 4C_Gandhi) by
 * 4C Software, Ahmedabad uses a Gujarati Remington typewriter layout.
 */

// =============================================================================
// MAPPING TABLE — 4C Gandhi ASCII → Unicode Gujarati
// Ordered longest-match first.
// =============================================================================

export const GANDHI_TO_UNICODE_MAP: [string, string][] = [
  // Typographic quotes
  ['\u201c', '\u201c'], ['\u201d', '\u201d'], ['\u2018', '\u2018'], ['\u2019', '\u2019'],

  // Gujarati digits
  ['0', '\u0ae6'], ['1', '\u0ae7'], ['2', '\u0ae8'], ['3', '\u0ae9'], ['4', '\u0aea'],
  ['5', '\u0aeb'], ['6', '\u0aec'], ['7', '\u0aed'], ['8', '\u0aee'], ['9', '\u0aef'],

  // ── INDEPENDENT VOWELS ────────────────────────────────────────────────────
  ['v',  '\u0a85'], // અ
  ['vk', '\u0a86'], // આ
  ['b',  '\u0a87'], // ઇ
  ['bZ', '\u0a88'], // ઈ
  ['u',  '\u0a89'], // ઉ
  ['\u00c5', '\u0a8a'], // ઊ
  [',',  '\u0a8f'], // એ
  ['\u00e6', '\u0a90'], // ઐ
  ['vks', '\u0a93'], // ઓ
  ['vkS', '\u0a94'], // ઔ

  // ── MULTI-CHAR CONSONANT SEQUENCES (longer first) ─────────────────────────
  ['[k', '\u0a96'],  // ખ (longer form)
  ['?k', '\u0a98'],  // ઘ
  ['.k', '\u0aa3'],  // ણ
  ['Fk', '\u0aa5'],  // થ
  ['/k', '\u0aa7'],  // ધ
  ['Hk', '\u0aad'],  // ભ
  ["'k", '\u0ab6'],  // શ
  ['"k', '\u0ab7'],  // ષ

  // ── SINGLE-CHAR CONSONANTS ─────────────────────────────────────────────────
  ['d', '\u0a95'],   // ક
  ['[', '\u0a96'],   // ખ
  ['x', '\u0a97'],   // ગ
  ['p', '\u0a9a'],   // ચ
  ['N', '\u0a9b'],   // છ
  ['t', '\u0a9c'],   // જ
  ['P', '\u0a9d'],   // ઝ
  ['V', '\u0a9f'],   // ટ
  ['B', '\u0aa0'],   // ઠ
  ['M', '\u0aa1'],   // ડ
  ['<', '\u0aa2'],   // ઢ
  ['r', '\u0aa4'],   // ત
  ['n', '\u0aa8'],   // ન
  ['i', '\u0aaa'],   // પ
  ['Q', '\u0aab'],   // ફ
  ['c', '\u0aac'],   // બ
  ['e', '\u0aae'],   // મ
  [';', '\u0aaf'],   // ય
  ['j', '\u0ab0'],   // ર
  ['y', '\u0ab2'],   // લ
  ['o', '\u0ab5'],   // વ
  ['l', '\u0ab8'],   // સ
  ['g', '\u0ab9'],   // હ
  ['\u00a5', '\u0a9e'], // ઞ
  ['\u00b3', '\u0a99'], // ઙ

  // ── HALF-CONSONANTS / HALANT FORMS ─────────────────────────────────────────
  ['D', '\u0a95\u0acd'],  // ક્
  ['X', '\u0a97\u0acd'],  // ગ્
  ['?', '\u0a98\u0acd'],  // ઘ્
  ['T', '\u0a9c\u0acd'],  // જ્
  ['R', '\u0aa4\u0acd'],  // ત્
  ['F', '\u0aa5\u0acd'],  // થ્
  ['/', '\u0aa7\u0acd'],  // ધ્
  ['U', '\u0aa8\u0acd'],  // ન્
  ['I', '\u0aaa\u0acd'],  // પ્
  ['C', '\u0aac\u0acd'],  // બ્
  ['H', '\u0aad\u0acd'],  // ભ્
  ['E', '\u0aae\u0acd'],  // મ્
  ['Y', '\u0ab2\u0acd'],  // લ્
  ['O', '\u0ab5\u0acd'],  // વ્
  ["'", '\u0ab6\u0acd'],  // શ્
  ['"', '\u0ab7\u0acd'],  // ષ્
  ['L', '\u0ab8\u0acd'],  // સ્

  // ── MULTI-CHAR MATRAS ─────────────────────────────────────────────────────
  ['kS', '\u0acc'], // ૌ
  ['ks', '\u0acb'], // ો

  // ── SINGLE-CHAR MATRAS ───────────────────────────────────────────────────
  ['k', '\u0abe'],  // ા
  ['h', '\u0ac0'],  // ી
  ['q', '\u0ac1'],  // ુ
  ['w', '\u0ac2'],  // ૂ
  ['`', '\u0ac3'],  // ૃ
  ['s', '\u0ac7'],  // ે
  ['S', '\u0ac8'],  // ૈ
  ['a', '\u0a82'],  // ં (anusvara)
  ['%', '\u0a83'],  // ઃ (visarga)
  ['~', '\u0acd'],  // ્ (virama)
  ['\u00a1', '\u0a81'], // ૅ (candrabindu)

  // ── SYMBOLS ───────────────────────────────────────────────────────────────
  ['A', '\u0964'],  // ।
  ['\u0965', '\u0965'], // ॥

  // ── CONJUNCT SHORTCUTS ───────────────────────────────────────────────────
  ['{', '\u0a95\u0acd\u0ab7'], // ક્ષ
  ['K', '\u0a9c\u0acd\u0a9e'], // જ્ઞ
  ['=', '\u0aa4\u0acd\u0ab0'], // ત્ર
];

// =============================================================================
// 4C GANDHI → UNICODE GUJARATI
// =============================================================================

/**
 * Convert a 4C Gandhi-encoded string to Unicode Gujarati.
 *
 * Algorithm identical to the Devlys/Kruti Dev pattern:
 * 1. Pre-process reph 'Z' (typed AFTER the consonant in Gandhi).
 * 2. Run map replacements.
 * 3. Reorder chhoti ee ki matra 'f' → િ (Gujarati short i, U+0ABF).
 * 4. Replace reph placeholder 'Z' with Unicode ર્.
 * 5. Fix virama + િ ordering artifacts.
 */
export function gandhiToUnicode(gandhiText: string): string {
  if (!gandhiText) return '';
  let text = gandhiText;

  // Step 1: Move reph 'Z' before the consonant cluster.
  const rephRegex = /([a-zA-Z[\]?'"`~=%]+)Z/g;
  text = text.replace(rephRegex, 'Z$1');

  // Step 2: Map replacements.
  for (const [gh, uni] of GANDHI_TO_UNICODE_MAP) {
    if (text.includes(gh)) {
      text = text.replaceAll(gh, uni);
    }
  }

  // Step 3: Reorder chhoti ee ki matra 'f' → િ.
  // Gujarati short i (U+0ABF) is pre-base in Gandhi, post-base in Unicode.
  const chotiEeRegex = /f((?:[\u0a95-\u0ab9]\u0acd)*[\u0a95-\u0ab9])/g;
  text = text.replace(chotiEeRegex, '$1\u0abf');

  // Step 4: Replace reph placeholder 'Z' with Gujarati ર્.
  text = text.replaceAll('Z', '\u0ab0\u0acd');

  // Step 5: Fix virama + િ ordering artifacts.
  text = text.replace(/\u0abf\u0acd/g, '\u0acd\u0abf');

  return text;
}

// =============================================================================
// UNICODE GUJARATI → 4C GANDHI (reverse direction)
// =============================================================================

/**
 * Convert Unicode Gujarati to 4C Gandhi font encoding.
 */
export function unicodeToGandhi(uniText: string): string {
  if (!uniText) return '';
  let text = uniText;

  // Step 1: Move િ before the consonant cluster.
  const chotiEeRegex = /((?:[\u0a80-\u0aff]\u0acd)*[\u0a80-\u0aff])\u0abf/g;
  text = text.replace(chotiEeRegex, 'f$1');

  // Step 2: Reorder reph (Gujarati ર + virama).
  const rephRegex = /\u0ab0\u0acd((?:[\u0a80-\u0aff]\u0acd)*[\u0a80-\u0aff])([\u0abe\u0ac0\u0ac1\u0ac2\u0ac7\u0ac8\u0acb\u0acc\u0ac3]*)/g;
  text = text.replace(rephRegex, '$1Z$2');

  // Step 3: Reverse-map sorted by Unicode length descending.
  const reverseMap = [...GANDHI_TO_UNICODE_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [gh, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, gh);
    }
  }

  return text;
}
