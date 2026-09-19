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
