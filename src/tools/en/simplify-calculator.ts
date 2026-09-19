import type { ToolConfig } from '../../lib/engine/types';
import { simplifyFraction } from '../../lib/math/fractions';

/**
 * SERP INTENT NOTE (verified 2026-09-19):
 * Top 5 results for "simplify calculator":
 * 1. Mathway - algebraic expression simplifier (fractions, radicals, polynomials)
 * 2. Symbolab - simplify calculator (shows step-by-step)
 * 3. WolframAlpha - arbitrary expression simplification
 * 4. CalculatorSoup - fraction simplifier
 * 5. Algebra.com - simplify expressions
 * Intent: Users want to simplify fractions and algebraic expressions with steps.
 * Build focus: fraction simplification (GCD-based) + step display.
 * math.js loaded lazily ONLY when user clicks "Simplify Algebra" button.
 */
export function computeSimplify(numerator: number, denominator: number) {
  return simplifyFraction(numerator, denominator);
}

const config: ToolConfig = {
  id: 'simplify-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'numerator',
      label: 'Numerator',
      type: 'number',
      min: -999999,
      max: 999999,
      step: 1,
      default: 24,
      help: 'Top number of the fraction',
    },
    {
      key: 'denominator',
      label: 'Denominator',
      type: 'number',
      min: -999999,
      max: 999999,
      step: 1,
      default: 36,
      help: 'Bottom number of the fraction (cannot be zero)',
    },
  ],
  compute(values) {
    const num = Math.round(Number(values.numerator) || 24);
    const den = Math.round(Number(values.denominator) || 36);
    if (den === 0) return new Error('Denominator cannot be zero');
    const res = simplifyFraction(num, den);
    return {
      simplified: `${res.simplified.numerator}/${res.simplified.denominator}`,
      numerator: res.simplified.numerator,
      denominator: res.simplified.denominator,
      gcd: res.divisor,
      decimal: +res.decimal.toFixed(8),
      mixed: res.mixed
        ? `${res.mixed.whole} and ${res.mixed.fraction.numerator}/${res.mixed.fraction.denominator}`
        : 'N/A',
      isAlreadySimplified: res.isAlreadySimplified ? 'Yes — already in simplest form' : 'No',
      steps: res.steps.map((s) => s.expression).join(' → '),
    };
  },
  outputs: [
    { key: 'simplified', label: 'Simplified Fraction', format: 'text', highlight: true },
    { key: 'gcd', label: 'GCD (Greatest Common Divisor)', format: 'number', highlight: true },
    { key: 'decimal', label: 'Decimal Equivalent', format: 'number' },
    { key: 'mixed', label: 'Mixed Number', format: 'text' },
    { key: 'isAlreadySimplified', label: 'Already Simplified?', format: 'text' },
    { key: 'steps', label: 'Step-by-Step', format: 'text' },
  ],
  table(values) {
    const den = Math.round(Math.abs(Number(values.denominator) || 36));
    if (den === 0) return { columns: [], rows: [] };
    // Show related fractions with same denominator
    const rows = [];
    for (let n = 1; n <= Math.min(den, 12); n++) {
      const res = simplifyFraction(n, den);
      rows.push({
        fraction: `${n}/${den}`,
        simplified: `${res.simplified.numerator}/${res.simplified.denominator}`,
        gcd: res.divisor,
        decimal: +res.decimal.toFixed(4),
      });
    }
    return {
      columns: [
        { key: 'fraction', label: 'Original Fraction', format: 'text' },
        { key: 'simplified', label: 'Simplified', format: 'text' },
        { key: 'gcd', label: 'GCD', format: 'number' },
        { key: 'decimal', label: 'Decimal', format: 'number' },
      ],
      rows,
    };
  },
};

export default config;
