/**
 * Shared UnitConverter — a single conversion table drives all converter pages.
 * Each entry stores the factor to convert FROM that unit TO the canonical SI unit.
 */

export interface UnitDef {
  key: string;
  label: string;
  /** Factor to convert FROM this unit TO the canonical base unit */
  toBase: number;
  /** Optional: suffix to display (e.g. "ft", "lb") */
  suffix?: string;
  /** Whether this unit is approximate or derived from convention */
  approximate?: boolean;
}

export interface ConversionResult {
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  factor: number;
}

export class UnitConverter {
  private units: Map<string, UnitDef>;

  constructor(units: UnitDef[]) {
    this.units = new Map(units.map((u) => [u.key, u]));
  }

  get(key: string): UnitDef | undefined {
    return this.units.get(key);
  }

  keys(): string[] {
    return Array.from(this.units.keys());
  }

  all(): UnitDef[] {
    return Array.from(this.units.values());
  }

  /**
   * Convert a value from one unit to another.
   * Uses the canonical base as intermediate: value * fromUnit.toBase / toUnit.toBase
   */
  convert(value: number, fromKey: string, toKey: string): ConversionResult {
    const from = this.units.get(fromKey);
    const to = this.units.get(toKey);
    if (!from || !to) {
      throw new Error(`Unknown unit: ${fromKey} or ${toKey}`);
    }
    const inBase = value * from.toBase;
    const toValue = inBase / to.toBase;
    return {
      fromUnit: fromKey,
      toUnit: toKey,
      fromValue: value,
      toValue,
      factor: from.toBase / to.toBase,
    };
  }

  /**
   * Generate a conversion table for a set of common values from one unit.
   */
  table(
    fromKey: string,
    toKey: string,
    values: number[]
  ): Array<{ input: number; output: number }> {
    return values.map((v) => ({
      input: v,
      output: this.convert(v, fromKey, toKey).toValue,
    }));
  }
}

// ─── Length ────────────────────────────────────────────────────────────────

/** base: meter */
export const lengthConverter = new UnitConverter([
  { key: 'm', label: 'Meters', toBase: 1, suffix: 'm' },
  { key: 'km', label: 'Kilometers', toBase: 1000, suffix: 'km' },
  { key: 'cm', label: 'Centimeters', toBase: 0.01, suffix: 'cm' },
  { key: 'mm', label: 'Millimeters', toBase: 0.001, suffix: 'mm' },
  { key: 'ft', label: 'Feet', toBase: 0.3048, suffix: 'ft' },
  { key: 'in', label: 'Inches', toBase: 0.0254, suffix: 'in' },
  { key: 'yd', label: 'Yards', toBase: 0.9144, suffix: 'yd' },
  { key: 'mi', label: 'Miles', toBase: 1609.344, suffix: 'mi' },
]);

// ─── Mass ──────────────────────────────────────────────────────────────────

/** base: gram */
export const massConverter = new UnitConverter([
  { key: 'g', label: 'Grams', toBase: 1, suffix: 'g' },
  { key: 'kg', label: 'Kilograms', toBase: 1000, suffix: 'kg' },
  { key: 'mg', label: 'Milligrams', toBase: 0.001, suffix: 'mg' },
  { key: 'lb', label: 'Pounds', toBase: 453.59237, suffix: 'lb' },
  { key: 'oz', label: 'Ounces', toBase: 28.349523125, suffix: 'oz' },
  { key: 't', label: 'Metric Tons', toBase: 1_000_000, suffix: 't' },
]);

// ─── Area ──────────────────────────────────────────────────────────────────

/** base: square meter */
export const areaConverter = new UnitConverter([
  { key: 'sqm', label: 'Square Meters (m²)', toBase: 1, suffix: 'm²' },
  { key: 'sqkm', label: 'Square Kilometers (km²)', toBase: 1_000_000, suffix: 'km²' },
  { key: 'sqft', label: 'Square Feet (ft²)', toBase: 0.09290304, suffix: 'ft²' },
  { key: 'sqyd', label: 'Square Yards (yd²)', toBase: 0.83612736, suffix: 'yd²' },
  { key: 'sqin', label: 'Square Inches (in²)', toBase: 0.00064516, suffix: 'in²' },
  { key: 'ha', label: 'Hectares (ha)', toBase: 10_000, suffix: 'ha' },
  { key: 'acre', label: 'Acres', toBase: 4046.8564224, suffix: 'ac' },
  {
    key: 'bigha',
    label: 'Bigha (India, approx.)',
    toBase: 2529,
    suffix: 'bigha',
    approximate: true,
  },
  {
    key: 'guntha',
    label: 'Guntha (India, approx.)',
    toBase: 101.17,
    suffix: 'guntha',
    approximate: true,
  },
]);

// ─── Digital Storage ───────────────────────────────────────────────────────

/** base: byte (SI decimal) */
export const storageConverterDecimal = new UnitConverter([
  { key: 'B', label: 'Bytes (B)', toBase: 1, suffix: 'B' },
  { key: 'KB', label: 'Kilobytes (KB)', toBase: 1_000, suffix: 'KB' },
  { key: 'MB', label: 'Megabytes (MB)', toBase: 1_000_000, suffix: 'MB' },
  { key: 'GB', label: 'Gigabytes (GB)', toBase: 1_000_000_000, suffix: 'GB' },
  { key: 'TB', label: 'Terabytes (TB)', toBase: 1_000_000_000_000, suffix: 'TB' },
]);

/** base: byte (IEC binary) */
export const storageConverterBinary = new UnitConverter([
  { key: 'B', label: 'Bytes (B)', toBase: 1, suffix: 'B' },
  { key: 'KiB', label: 'Kibibytes (KiB)', toBase: 1024, suffix: 'KiB' },
  { key: 'MiB', label: 'Mebibytes (MiB)', toBase: 1_048_576, suffix: 'MiB' },
  { key: 'GiB', label: 'Gibibytes (GiB)', toBase: 1_073_741_824, suffix: 'GiB' },
  { key: 'TiB', label: 'Tebibytes (TiB)', toBase: 1_099_511_627_776, suffix: 'TiB' },
]);
