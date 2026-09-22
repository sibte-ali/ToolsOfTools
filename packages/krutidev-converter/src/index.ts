/**
 * krutidev-converter
 *
 * Production-ready, zero-dependency Indic legacy font to Unicode Devanagari converter engine.
 * Powered by ToolsOfTools (https://toolsoftools.com)
 *
 * Supports:
 * - Kruti Dev 010, 011, 016, 055, 060 <-> Unicode Devanagari
 * - Mangal <-> Kruti Dev
 * - Devlys 010 <-> Unicode Devanagari
 * - Chanakya <-> Unicode Devanagari
 * - 4C Gandhi <-> Unicode Gujarati
 */

// Core types
export * from './types.js';

// Kruti Dev & Mangal
export {
  krutiDevToUnicode,
  unicodeToKrutiDev,
  krutiDevToMangal,
  mangalToKrutiDev,
  KRUTI_TO_UNICODE_MAP,
  KRUTI_VARIANT_PATCHES,
} from './krutidev.js';

// Devlys 010
export {
  devlysToUnicode,
  unicodeToDevlys,
  DEVLYS_TO_UNICODE_MAP,
} from './devlys.js';

// Chanakya
export {
  chanakyaToUnicode,
  unicodeToChanakya,
  CHANAKYA_TO_UNICODE_MAP,
} from './chanakya.js';

// 4C Gandhi
export {
  gandhiToUnicode,
  unicodeToGandhi,
  GANDHI_TO_UNICODE_MAP,
} from './gandhi.js';
