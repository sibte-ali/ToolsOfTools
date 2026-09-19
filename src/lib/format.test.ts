import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatDate, resolveToolLocale } from './format';

describe('format utilities', () => {
  it('formats numbers according to passed locale', () => {
    const formattedEn = formatNumber(1234567.89, 'en-US');
    expect(formattedEn).toBe('1,234,567.89');

    const formattedIn = formatNumber(1234567.89, 'en-IN');
    expect(formattedIn).toBe('12,34,567.89');

    const formattedPt = formatNumber(1234567.89, 'pt-BR');
    // pt-BR uses dot for thousands and comma for decimal
    expect(formattedPt).toMatch(/1\.234\.567,89/);
  });

  it('formats currency according to passed locale and currency code', () => {
    const brl = formatCurrency(100, 'pt-BR', 'BRL');
    expect(brl).toContain('100');

    const inr = formatCurrency(50000, 'en-IN', 'INR');
    expect(inr).toContain('50,000');
  });

  it('formats date correctly', () => {
    const d = new Date('2026-05-15T12:00:00Z');
    const formatted = formatDate(d, 'en-US');
    expect(formatted).toContain('2026');
  });

  it('resolves tool locale config accurately', () => {
    expect(resolveToolLocale({ lang: 'pt-br' })).toEqual({ locale: 'pt-BR', currency: 'BRL' });
    expect(resolveToolLocale({ lang: 'es' })).toEqual({ locale: 'es-ES', currency: 'EUR' });
    expect(
      resolveToolLocale({
        lang: 'en',
        risk_flags: 'India financial rules',
        spec: 'GST calculator in INR',
      })
    ).toEqual({ locale: 'en-IN', currency: 'INR' });
    expect(resolveToolLocale({ lang: 'en', spec: 'Standard calculator' })).toEqual({
      locale: 'en-US',
      currency: 'USD',
    });
  });
});
