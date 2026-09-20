export interface ToolLocaleConfig {
  locale: string;
  currency: string;
}

/**
 * Resolves the appropriate locale and currency based on tool configuration.
 * - en tools flagged india use 'en-IN' (lakh/crore grouping) with INR
 * - pt-br uses 'pt-BR' with BRL
 * - es uses 'es-ES' with EUR
 * - other en tools default to 'en-US' with USD
 */
export function resolveToolLocale(tool: {
  lang: string;
  risk_flags?: string;
  spec?: string;
  keyword?: string;
}): ToolLocaleConfig {
  if (tool.lang === 'pt-br') {
    return { locale: 'pt-BR', currency: 'BRL' };
  }
  if (tool.lang === 'es') {
    return { locale: 'es-ES', currency: 'EUR' };
  }

  const combined = `${tool.risk_flags || ''} ${tool.spec || ''} ${tool.keyword || ''}`.toLowerCase();
  const isIndiaFlagged =
    combined.includes('india') ||
    combined.includes('inr') ||
    combined.includes('lakh') ||
    combined.includes('crore') ||
    combined.includes('epf') ||
    combined.includes('gst') ||
    combined.includes('ppf') ||
    combined.includes('nps') ||
    combined.includes('cbse');

  if (isIndiaFlagged) {
    return { locale: 'en-IN', currency: 'INR' };
  }

  return { locale: 'en-US', currency: 'USD' };
}

export function formatNumber(
  value: number,
  lang: string,
  opts?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(lang, opts).format(value);
}

export function formatCurrency(
  value: number,
  lang: string,
  currency: string = 'USD',
  opts?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
    ...opts,
  }).format(value);
}

export function formatDate(
  date: Date | string | number,
  lang: string,
  opts?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(d);
}

/**
 * Converts raw LaTeX mathematical expressions into clean, human-readable Unicode math.
 * E.g.: "\\text{WHR} = \\frac{\\text{Waist}}{\\text{Hip}}, \\quad \\text{Hourglass: } \\frac{|\\text{Bust} - \\text{Hip}|}{\\max(\\text{Bust}, \\text{Hip})} \\le 0.05"
 * -> "WHR = Waist / Hip, Hourglass: |Bust - Hip| / max(Bust, Hip) ≤ 0.05"
 */
export function cleanLatexMath(str: string): string {
  if (!str) return '';
  let res = str;

  // Remove $$ wrappers or inline $
  res = res.replace(/\$\$/g, '').replace(/\$/g, '');

  // Handle \frac{num}{den} recursively (handles nested braces)
  const fracRegex = /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g;
  while (fracRegex.test(res)) {
    res = res.replace(fracRegex, (_match, num, den) => {
      const cleanNum = num.trim();
      const cleanDen = den.trim();
      const needsParenNum = cleanNum.includes(' ') && !cleanNum.startsWith('(') && !cleanNum.startsWith('|');
      const needsParenDen = cleanDen.includes(' ') && !cleanDen.startsWith('(') && !cleanDen.startsWith('|');
      const n = needsParenNum ? `(${cleanNum})` : cleanNum;
      const d = needsParenDen ? `(${cleanDen})` : cleanDen;
      return `${n} / ${d}`;
    });
  }

  // Handle \text{...}, \mathbf{...}, \mathrm{...}, \mathit{...}
  res = res.replace(/\\(text|mathbf|mathrm|mathit)\s*\{([^{}]+)\}/g, '$2');

  // Relational and arithmetic operators
  res = res.replace(/\\le\b/g, '≤');
  res = res.replace(/\\ge\b/g, '≥');
  res = res.replace(/\\times\b/g, '×');
  res = res.replace(/\\approx\b/g, '≈');
  res = res.replace(/\\neq\b/g, '≠');
  res = res.replace(/\\pm\b/g, '±');
  res = res.replace(/\\div\b/g, '÷');
  res = res.replace(/\\cdot\b/g, '·');
  res = res.replace(/\\Delta\b/g, 'Δ');
  res = res.replace(/\\sum\b/g, 'Σ');
  res = res.replace(/\\bigcup\b/g, '∪');
  res = res.replace(/\\implies\b/g, '⇒');
  res = res.replace(/\\(to|rightarrow)\b/g, '→');
  res = res.replace(/\\max\b/g, 'max');
  res = res.replace(/\\min\b/g, 'min');

  // Spacing
  res = res.replace(/\\(quad|qquad)/g, ', ');
  res = res.replace(/\\([,;:!])/g, ' ');

  // Delimiters
  res = res.replace(/\\left\s*([(\[{|])/g, '$1');
  res = res.replace(/\\right\s*([)\]}|])/g, '$1');

  // Escaped characters: \%, \$, \_, \{, \}
  res = res.replace(/\\([%$#&_{}])/g, '$1');

  // Superscripts and exponents
  res = res.replace(/\^\{([^{}]+)\}/g, '^($1)');
  res = res.replace(/\^2\b/g, '²');
  res = res.replace(/\^3\b/g, '³');

  // Subscripts
  res = res.replace(/_\{([^{}]+)\}/g, '_$1');

  // Remaining standalone macro prefixes
  res = res.replace(/\\([a-zA-Z]+)/g, '$1');

  // Clean duplicate spaces and commas
  res = res.replace(/,\s*,/g, ',');
  res = res.replace(/\s+/g, ' ').trim();

  return res;
}
