/**
 * Type definitions for krutidev-converter
 */

export type KrutiDevVariant = '010' | '011' | '016' | '055' | '060';

export interface KrutiDevOptions {
  /**
   * Kruti Dev font variant. Defaults to '010'.
   */
  variant?: KrutiDevVariant;
  /**
   * Custom character/glyph override patch tuples [legacyString, unicodeString].
   * Applied after base conversion for forward conversion, and before reverse mapping for backward conversion.
   */
  customPatches?: Array<[string, string]>;
}

export interface IndicConverterEngine {
  toUnicode: (text: string) => string;
  fromUnicode: (text: string) => string;
}
