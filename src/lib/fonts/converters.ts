/**
 * Font Conversion Engines for Indian Regional & Fancy Unicode Scripts
 * Supports:
 * - Kruti Dev 010 <-> Unicode Devanagari (Hindi/Marathi)
 * - AMS India Font <-> Unicode Devanagari
 * - Shree Lipi (Shree-Dev) <-> Unicode Devanagari
 * - Bamini <-> Tamil Unicode
 * - Fancy Unicode Stylized Text Generator (20+ styles)
 */

// =============================================================================
// 1. KRUTI DEV 010 <-> UNICODE DEVANAGARI
// =============================================================================

// Mapping array ordered from multi-character to single character for accurate replacement
const KRUTI_TO_UNICODE_MAP: [string, string][] = [
  // Special conjuncts & compound glyphs
  ['“', '“'], ['”', '”'], ['‘', '‘'], ['’', '’'],
  ['क्द्', 'क्द'], ['द्ग', 'द्ग'], ['द्घ', 'द्घ'], ['द्द', 'द्द'], ['द्ध', 'द्ध'],
  ['द्ब', 'द्ब'], ['द्भ', 'द्भ'], ['द्म', 'द्म'], ['द्य', 'द्य'], ['द्व', 'द्व'],
  ['क्त', 'क्त'], ['ज्ञ', 'ज्ञ'], ['त्र', 'त्र'], ['क्ष', 'क्ष'], ['श्र', 'श्र'],

  // Numbers
  ['0', '०'], ['1', '१'], ['2', '२'], ['3', '३'], ['4', '४'],
  ['5', '५'], ['6', '६'], ['7', '७'], ['8', '८'], ['9', '९'],

  // Multi-character ligatures in Kruti Dev
  ['vks', 'ओ'], ['vkS', 'औ'], ['vk', 'आ'], ['v', 'अ'],
  ['bZ', 'ई'], ['b', 'इ'], ['m', 'उ'], ['Å', 'ऊ'], [',', 'ए'], ['S', 'ऐ'],
  ['ऋ', 'ऋ'],

  // Consonants with nukta & specials
  ['d', 'क'], ['[k', 'ख'], ['x', 'ग'], ['?k', 'घ'], ['³', 'ङ'],
  ['p', 'च'], ['N', 'छ'], ['t', 'ज'], ['P', 'झ'], ['¥', 'ञ'],
  ['V', 'ट'], ['B', 'ठ'], ['M', 'ड'], ['<', 'ढ'], ['.k', 'ण'],
  ['r', 'त'], ['Fk', 'थ'], ['n', 'द'], ['/k', 'ध'], ['u', 'न'],
  ['i', 'प'], ['Q', 'फ'], ['c', 'ब'], ['Hk', 'भ'], ['e', 'म'],
  [';', 'य'], ['j', 'र'], ['y', 'ल'], ['o', 'व'],
  ['\'k', 'श'], ['\"k', 'ष'], ['l', 'स'], ['g', 'ह'],

  // Half-consonants (Halant forms in Kruti Dev)
  ['D', 'क्'], ['[', 'ख्'], ['X', 'ग्'], ['?', 'घ्'],
  ['P', 'च्'], ['T', 'ज्'], ['R', 'त्'], ['F', 'थ्'],
  ['/', 'ध्'], ['U', 'न्'], ['I', 'प्'], ['Q', 'फ्'],
  ['C', 'ब्'], ['H', 'भ्'], ['E', 'म्'], ['Y', 'ल्'],
  ['O', 'व्'], ['\'', 'श्'], ['\"', 'ष्'], ['L', 'स्'],

  // Matras (Vowel signs)
  ['kS', 'ौ'], ['ks', 'ो'], ['k', 'ा'], ['h', 'ी'],
  ['q', 'ु'], ['w', 'ू'], ['`', 'ृ'], ['s', 'े'], ['S', 'ै'],
  ['a', 'ं'], ['¡', 'ँ'], ['%', 'ः'], ['~', '्'],

  // Symbols & Punctuations
  ['A', '।'], ['॥', '॥'],
  ['K', 'ज्ञ'], ['=', 'त्र'], ['{', 'क्ष']
];

export function krutiDevToUnicode(krutiText: string): string {
  if (!krutiText) return '';
  let text = krutiText;

  // Step 1: Handle reph 'Z' which appears after the consonant in Kruti Dev
  // E.g. 'eZ' -> 'र्म' (half ra before the consonant in Unicode)
  // Match consonant + optional matra + 'Z'
  const rephRegex = /([a-zA-Z\[\]\?'"`~=%]+)Z/g;
  text = text.replace(rephRegex, 'Z$1');

  // Step 2: Multi-character replacements
  for (const [kd, uni] of KRUTI_TO_UNICODE_MAP) {
    if (text.includes(kd)) {
      text = text.replaceAll(kd, uni);
    }
  }

  // Step 3: Handle chhoti 'ee' ki matra 'f' (precedes consonant in Kruti Dev)
  // E.g. 'fd' -> 'कि', 'fD' + cons -> 'क्...' + 'ि'
  // In Unicode, 'ि' comes AFTER the consonant or consonant cluster
  const chotiEeRegex = /f([\u0900-\u097F]+)/g;
  text = text.replace(chotiEeRegex, (_match, cluster) => {
    // If cluster starts with a half-letter (e.g. क् + य), attach ि at end of cluster
    return cluster + 'ि';
  });

  // Step 4: Handle moved 'Z' to Unicode reph 'र्'
  text = text.replaceAll('Z', 'र्');

  // Step 5: Fix any misplaced matras
  text = text.replace(/ि्/g, '्ि');

  return text;
}

export function unicodeToKrutiDev(uniText: string): string {
  if (!uniText) return '';
  let text = uniText;

  // Step 1: Reorder chhoti 'ee' ki matra: In Unicode it follows the consonant cluster,
  // in Kruti Dev 'f' must precede the consonant cluster
  // Match consonant (optionally preceded by half-consonant) + 'ि'
  const chotiEeRegex = /((?:[\u0900-\u097F]्)*[\u0900-\u097F])ि/g;
  text = text.replace(chotiEeRegex, 'f$1');

  // Step 2: Reorder reph 'र्': In Unicode it precedes the consonant, in Kruti Dev 'Z' follows
  const rephRegex = /र्((?:[\u0900-\u097F]्)*[\u0900-\u097F](?:[ाीुूेैोौृ]*))/g;
  text = text.replace(rephRegex, '$1Z');

  // Step 3: Reverse map Unicode to Kruti Dev (reverse table)
  // Sort reverse mapping by length of unicode string descending
  const reverseMap = [...KRUTI_TO_UNICODE_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [kd, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, kd);
    }
  }

  return text;
}


// =============================================================================
// 2. BAMINI <-> TAMIL UNICODE
// =============================================================================

const BAMINI_TO_TAMIL_MAP: [string, string][] = [
  // Compound vowels & special
  ['xs', 'ஔ'], ['m', 'அ'], ['M', 'ஆ'], [',', 'இ'], ['<', 'ஈ'],
  ['c', 'உ'], ['C', 'ஊ'], ['v', 'எ'], ['V', 'ஏ'], ['I', 'ஐ'],
  ['x', 'ஒ'], ['X', 'ஓ'], ['/', 'ஃ'],

  // Consonants with pulli (virama)
  ['க்', 'க்'], ['ங்', 'ங்'], ['ச்', 'ச்'], ['ஞ்', 'ஞ்'],
  ['ட்', 'ட்'], ['ண்', 'ண்'], ['த்', 'த்'], ['ந்', 'ந்'],
  ['ப்', 'ப்'], ['ம்', 'ம்'], ['ய்', 'ய்'], ['ர்', 'ர்'],
  ['ல்', 'ல்'], ['வ்', 'வ்'], ['ழ்', 'ழ்'], ['ள்', 'ள்'],
  ['ற்', 'ற்'], ['ன்', 'ன்'],

  // Base consonants
  ['f', 'க'], ['q', 'ங'], ['r', 'ச'], ['Q', 'ஞ'],
  ['l', 'ட'], ['z', 'ண'], ['j', 'த'], ['e', 'ந'],
  ['g', 'ப'], ['k', 'ம'], ['a', 'ய'], ['u', 'ர'],
  ['y', 'ல'], ['t', 'வ'], ['w', 'ழ'], ['s', 'ள'],
  ['W', 'ற'], ['d', 'ன'], ['[', 'ஜ'], [']', 'ஷ'],
  ['\\', 'ஸ'], ['h', 'ஹ'], ['x', 'க்ஷ'],

  // Vowel signs
  ['h', 'ா'], ['p', 'ி'], ['P', 'ீ'], ['F', 'ு'],
  ['G', 'ூ'], ['`', '்'], [';', '்']
];

export function baminiToUnicode(baminiText: string): string {
  if (!baminiText) return '';
  let text = baminiText;

  // Pre-base vowel signs in Bamini:
  // 'n' = ெ, 'N' = ே, 'i' = ை
  // In Bamini typing, 'n' + consonant = consonant + ெ
  // E.g. 'nf' -> 'கெ'
  text = text.replace(/n([a-zA-Z])/g, '$1ெ');
  text = text.replace(/N([a-zA-Z])/g, '$1ே');
  text = text.replace(/i([a-zA-Z])/g, '$1ை');

  // Replace mapping
  for (const [bam, uni] of BAMINI_TO_TAMIL_MAP) {
    if (text.includes(bam)) {
      text = text.replaceAll(bam, uni);
    }
  }

  // Handle compound vowel signs: ெ + ா = ொ, ே + ா = ோ, ெ + ள = ௌ
  text = text.replace(/ொ/g, 'ொ');
  text = text.replace(/ோ/g, 'ோ');
  text = text.replace(/ெள/g, 'ௌ');

  return text;
}

export function unicodeToBamini(tamilText: string): string {
  if (!tamilText) return '';
  let text = tamilText;

  // Expand compound vowel signs to component pre-base signs
  text = text.replace(/ொ/g, 'ொ');
  text = text.replace(/ோ/g, 'ோ');
  text = text.replace(/ௌ/g, 'ெள');

  // Move pre-base vowel signs before consonant
  text = text.replace(/([க-ஹ])ெ/g, 'n$1');
  text = text.replace(/([க-ஹ])ே/g, 'N$1');
  text = text.replace(/([க-ஹ])ை/g, 'i$1');

  // Reverse mapping
  const reverseMap = [...BAMINI_TO_TAMIL_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [bam, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, bam);
    }
  }

  return text;
}


// =============================================================================
// 3. AMS FONT <-> UNICODE DEVANAGARI
// =============================================================================

const AMS_TO_UNICODE_MAP: [string, string][] = [
  ['vks', 'ओ'], ['vkS', 'औ'], ['vk', 'आ'], ['v', 'अ'],
  ['bZ', 'ई'], ['b', 'इ'], ['m', 'उ'], ['Å', 'ऊ'], [',', 'ए'], ['S', 'ऐ'],
  ['d', 'क'], ['[k', 'ख'], ['x', 'ग'], ['?k', 'घ'],
  ['p', 'च'], ['N', 'छ'], ['t', 'ज'], ['P', 'झ'],
  ['V', 'ट'], ['B', 'ठ'], ['M', 'ड'], ['<', 'ढ'], ['.k', 'ण'],
  ['r', 'त'], ['Fk', 'थ'], ['n', 'द'], ['/k', 'ध'], ['u', 'न'],
  ['i', 'प'], ['Q', 'फ'], ['c', 'ब'], ['Hk', 'भ'], ['e', 'म'],
  [';', 'य'], ['j', 'र'], ['y', 'ल'], ['o', 'व'],
  ['\'k', 'श'], ['\"k', 'ष'], ['l', 'स'], ['g', 'ह'],
  ['kS', 'ौ'], ['ks', 'ो'], ['k', 'ा'], ['h', 'ी'],
  ['q', 'ु'], ['w', 'ू'], ['`', 'ृ'], ['s', 'े'], ['S', 'ै'],
  ['a', 'ं'], ['%', 'ः'], ['~', '्']
];

export function amsToUnicode(amsText: string): string {
  if (!amsText) return '';
  let text = amsText;

  // Handle reph 'Z'
  text = text.replace(/([a-zA-Z\?'"`~=%]+)Z/g, 'Z$1');

  for (const [ams, uni] of AMS_TO_UNICODE_MAP) {
    if (text.includes(ams)) {
      text = text.replaceAll(ams, uni);
    }
  }

  // Handle chhoti 'ee' matra 'f'
  text = text.replace(/f([\u0900-\u097F]+)/g, '$1ि');
  text = text.replaceAll('Z', 'र्');

  return text;
}

export function unicodeToAms(uniText: string): string {
  if (!uniText) return '';
  let text = uniText;

  const chotiEeRegex = /((?:[\u0900-\u097F]्)*[\u0900-\u097F])ि/g;
  text = text.replace(chotiEeRegex, 'f$1');

  const rephRegex = /र्((?:[\u0900-\u097F]्)*[\u0900-\u097F](?:[ाीुूेैोौृ]*))/g;
  text = text.replace(rephRegex, '$1Z');

  const reverseMap = [...AMS_TO_UNICODE_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [ams, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, ams);
    }
  }

  return text;
}


// =============================================================================
// 4. SHREE LIPI (SHREE-DEV) <-> UNICODE DEVANAGARI
// =============================================================================

const SHREE_TO_UNICODE_MAP: [string, string][] = [
  ['A', 'ा'], ['B', 'ी'], ['C', 'ु'], ['D', 'ू'], ['E', 'ृ'],
  ['F', 'े'], ['G', 'ै'], ['H', 'ो'], ['I', 'ौ'], ['J', 'ं'],
  ['K', 'ः'], ['L', '्'],
  ['M', 'अ'], ['N', 'आ'], ['O', 'इ'], ['P', 'ई'], ['Q', 'उ'],
  ['R', 'ऊ'], ['S', 'ऋ'], ['T', 'ए'], ['U', 'ऐ'], ['V', 'ओ'],
  ['W', 'औ'],
  ['X', 'क'], ['Y', 'ख'], ['Z', 'ग'], ['a', 'घ'], ['b', 'ङ'],
  ['c', 'च'], ['d', 'छ'], ['e', 'ज'], ['f', 'झ'], ['g', 'ञ'],
  ['h', 'ट'], ['i', 'ठ'], ['j', 'ड'], ['k', 'ढ'], ['l', 'ण'],
  ['m', 'त'], ['n', 'थ'], ['o', 'द'], ['p', 'ध'], ['q', 'न'],
  ['r', 'प'], ['s', 'फ'], ['t', 'ब'], ['u', 'भ'], ['v', 'म'],
  ['w', 'य'], ['x', 'र'], ['y', 'ल'], ['z', 'व'],
  ['1', 'श'], ['2', 'ष'], ['3', 'स'], ['4', 'ह'],
  ['5', 'क्ष'], ['6', 'त्र'], ['7', 'ज्ञ']
];

export function shreeLipiToUnicode(shreeText: string): string {
  if (!shreeText) return '';
  let text = shreeText;

  for (const [shree, uni] of SHREE_TO_UNICODE_MAP) {
    if (text.includes(shree)) {
      text = text.replaceAll(shree, uni);
    }
  }

  return text;
}

export function unicodeToShreeLipi(uniText: string): string {
  if (!uniText) return '';
  let text = uniText;

  const reverseMap = [...SHREE_TO_UNICODE_MAP].sort((a, b) => b[1].length - a[1].length);
  for (const [shree, uni] of reverseMap) {
    if (text.includes(uni)) {
      text = text.replaceAll(uni, shree);
    }
  }

  return text;
}


// =============================================================================
// 5. UNICODE FANCY STYLED TEXT GENERATOR (20+ STYLES)
// =============================================================================

export interface TextStyleOutput {
  id: string;
  name: string;
  category: string;
  preview: string;
}

const NORMAL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const STYLE_MAPS: Record<string, { name: string; category: string; chars: string }> = {
  sansBold: {
    name: 'Sans Bold',
    category: 'Bold',
    chars: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
  },
  sansBoldItalic: {
    name: 'Sans Bold Italic',
    category: 'Bold',
    chars: '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
  },
  serifBold: {
    name: 'Serif Bold',
    category: 'Bold',
    chars: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'
  },
  serifItalic: {
    name: 'Serif Italic',
    category: 'Italic',
    chars: '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789'
  },
  scriptBold: {
    name: 'Cursive / Script Bold',
    category: 'Fancy',
    chars: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789'
  },
  gothicFraktur: {
    name: 'Gothic / Fraktur',
    category: 'Gothic',
    chars: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔱0123456789'
  },
  gothicBold: {
    name: 'Gothic Bold',
    category: 'Gothic',
    chars: '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟0123456789'
  },
  doubleStruck: {
    name: 'Double-Struck (Blackboard)',
    category: 'Fancy',
    chars: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
  },
  monospace: {
    name: 'Monospace / Code',
    category: 'Monospace',
    chars: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
  },
  circled: {
    name: 'Circled / Bubble',
    category: 'Bubble',
    chars: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨'
  },
  circledNegative: {
    name: 'Circled Negative (Black)',
    category: 'Bubble',
    chars: '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩⓿❶❷❸❹❺❻❼❽❾'
  },
  squared: {
    name: 'Squared',
    category: 'Square',
    chars: '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789'
  },
  squaredSolid: {
    name: 'Squared Solid',
    category: 'Square',
    chars: '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆂🆃🆄🆅🆆🆇🆈🆉0123456789'
  },
  smallCaps: {
    name: 'Small Caps',
    category: 'Special',
    chars: 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789'
  },
  fullwidth: {
    name: 'Fullwidth / Aesthetic Wide',
    category: 'Special',
    chars: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９'
  }
};

export function generateFancyUnicodeStyles(text: string): TextStyleOutput[] {
  if (!text) {
    text = 'ToolsOfTools Font Converter';
  }

  const results: TextStyleOutput[] = [];

  for (const [id, style] of Object.entries(STYLE_MAPS)) {
    // Array.from is needed to handle UTF-16 surrogate pairs properly in Javascript
    const sourceArr = Array.from(NORMAL_CHARS);
    const targetArr = Array.from(style.chars);

    const lookup: Record<string, string> = {};
    sourceArr.forEach((char, idx) => {
      if (targetArr[idx]) {
        lookup[char] = targetArr[idx];
      }
    });

    const transformed = Array.from(text)
      .map((char) => lookup[char] || char)
      .join('');

    results.push({
      id,
      name: style.name,
      category: style.category,
      preview: transformed
    });
  }

  // Add decorative transform styles
  // 1. Strikethrough
  results.push({
    id: 'strikethrough',
    name: 'Strikethrough',
    category: 'Decorative',
    preview: Array.from(text).map(c => c + '\u0336').join('')
  });

  // 2. Underline
  results.push({
    id: 'underline',
    name: 'Underline',
    category: 'Decorative',
    preview: Array.from(text).map(c => c + '\u0332').join('')
  });

  // 3. Double Underline
  results.push({
    id: 'doubleUnderline',
    name: 'Double Underline',
    category: 'Decorative',
    preview: Array.from(text).map(c => c + '\u0333').join('')
  });

  // 4. Upside Down / Flip
  const flipMap: Record<string, string> = {
    a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ',
    i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd',
    q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x',
    y: 'ʎ', z: 'z', A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ',
    G: '⅁', H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N',
    O: 'O', P: 'Ԁ', Q: 'Ò', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ',
    W: 'M', X: 'X', Y: '⅄', Z: 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ',
    '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6'
  };

  results.push({
    id: 'upsideDown',
    name: 'Upside Down / Inverted',
    category: 'Special',
    preview: Array.from(text).reverse().map(c => flipMap[c] || c).join('')
  });

  return results;
}
