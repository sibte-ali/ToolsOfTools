/**
 * Fraction arithmetic and simplification with step-by-step trace.
 */

/** Greatest Common Divisor (Euclidean algorithm) */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a === 0 ? 1 : a;
}

/** Least Common Multiple */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface SimplifyStep {
  step: number;
  description: string;
  expression: string;
}

export interface SimplifyResult {
  original: Fraction;
  simplified: Fraction;
  divisor: number;
  isAlreadySimplified: boolean;
  steps: SimplifyStep[];
  decimal: number;
  mixed?: { whole: number; fraction: Fraction } | null;
}

/**
 * Simplify a fraction and return step-by-step explanation.
 */
export function simplifyFraction(numerator: number, denominator: number): SimplifyResult {
  if (denominator === 0) throw new Error('Denominator cannot be zero');

  // Normalize sign: keep sign on numerator
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }

  const original: Fraction = { numerator, denominator };
  const divisor = gcd(Math.abs(numerator), denominator);
  const sNum = numerator / divisor;
  const sDen = denominator / divisor;
  const simplified: Fraction = { numerator: sNum, denominator: sDen };
  const isAlreadySimplified = divisor === 1;
  const decimal = sNum / sDen;

  // Mixed number (only for proper display when |numerator| > denominator)
  let mixed: SimplifyResult['mixed'] = null;
  if (Math.abs(sNum) >= sDen && sDen !== 1) {
    const whole = Math.trunc(sNum / sDen);
    const remNum = sNum - whole * sDen;
    mixed = { whole, fraction: { numerator: remNum, denominator: sDen } };
  }

  const steps: SimplifyStep[] = [];
  steps.push({
    step: 1,
    description: 'Write the fraction',
    expression: `${numerator}/${denominator}`,
  });
  steps.push({
    step: 2,
    description: `Find GCD(${Math.abs(numerator)}, ${denominator})`,
    expression: `GCD = ${divisor}`,
  });
  if (!isAlreadySimplified) {
    steps.push({
      step: 3,
      description: 'Divide numerator and denominator by GCD',
      expression: `(${numerator} ÷ ${divisor}) / (${denominator} ÷ ${divisor}) = ${sNum}/${sDen}`,
    });
  } else {
    steps.push({
      step: 3,
      description: 'GCD = 1, fraction is already in simplest form',
      expression: `${numerator}/${denominator}`,
    });
  }
  steps.push({
    step: 4,
    description: 'Decimal equivalent',
    expression: `${sNum}/${sDen} = ${decimal.toFixed(6).replace(/\.?0+$/, '')}`,
  });

  return { original, simplified, divisor, isAlreadySimplified, steps, decimal, mixed };
}

/**
 * Add two fractions: a/b + c/d = (a*d + c*b) / (b*d), then simplify.
 */
export function addFractions(a: Fraction, b: Fraction): Fraction {
  const num = a.numerator * b.denominator + b.numerator * a.denominator;
  const den = a.denominator * b.denominator;
  const d = gcd(Math.abs(num), Math.abs(den));
  return { numerator: num / d, denominator: den / d };
}

/**
 * Subtract two fractions.
 */
export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  return addFractions(a, { numerator: -b.numerator, denominator: b.denominator });
}

/**
 * Multiply two fractions.
 */
export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  const num = a.numerator * b.numerator;
  const den = a.denominator * b.denominator;
  const d = gcd(Math.abs(num), Math.abs(den));
  return { numerator: num / d, denominator: den / d };
}

/**
 * Divide two fractions.
 */
export function divideFractions(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) throw new Error('Cannot divide by zero fraction');
  return multiplyFractions(a, { numerator: b.denominator, denominator: b.numerator });
}

/**
 * Convert decimal to fraction (rational approximation via continued fractions).
 * Max denominator = 10000.
 */
export function decimalToFraction(decimal: number, maxDenominator = 10000): Fraction {
  if (!isFinite(decimal)) throw new Error('Input must be finite');
  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);

  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = decimal;
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * 1e-9 && k1 <= maxDenominator);

  return { numerator: sign * h1, denominator: k1 };
}

/**
 * Parse fraction string "3/4" or "3" into Fraction.
 */
export function parseFraction(str: string): Fraction {
  const trimmed = str.trim();
  const parts = trimmed.split('/');
  if (parts.length === 2) {
    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);
    if (isNaN(num) || isNaN(den)) throw new Error(`Invalid fraction: ${str}`);
    return { numerator: num, denominator: den };
  }
  const n = parseFloat(trimmed);
  if (isNaN(n)) throw new Error(`Invalid number: ${str}`);
  return { numerator: n, denominator: 1 };
}

/**
 * Format fraction as string.
 */
export function formatFraction(f: Fraction): string {
  return f.denominator === 1 ? String(f.numerator) : `${f.numerator}/${f.denominator}`;
}
