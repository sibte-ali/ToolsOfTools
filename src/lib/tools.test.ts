import { describe, it, expect } from 'vitest';
import { buildTools } from './tools';

describe('buildTools URL invariants', () => {
  it('every build tool url is unique', () => {
    const urls = buildTools.map((t) => t.url);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);
  });

  it('every url starts with "/" and ends with "/"', () => {
    for (const tool of buildTools) {
      expect(tool.url.startsWith('/')).toBe(true);
      expect(tool.url.endsWith('/')).toBe(true);
    }
  });

  it('pt-br urls start with "/pt-br/"', () => {
    const ptBrTools = buildTools.filter((t) => t.lang === 'pt-br');
    expect(ptBrTools.length).toBeGreaterThan(0);
    for (const tool of ptBrTools) {
      expect(tool.url.startsWith('/pt-br/')).toBe(true);
    }
  });

  it('es urls start with "/es/"', () => {
    const esTools = buildTools.filter((t) => t.lang === 'es');
    expect(esTools.length).toBeGreaterThan(0);
    for (const tool of esTools) {
      expect(tool.url.startsWith('/es/')).toBe(true);
    }
  });

  it('no url contains a four-digit year', () => {
    const yearPattern = /\b(19|20)\d{2}\b|\/\d{4}\/|-\d{4}-|_\d{4}_|\d{4}/;
    for (const tool of buildTools) {
      expect(yearPattern.test(tool.url)).toBe(false);
    }
  });

  it('all font converter tools are English-only', () => {
    const fontTools = buildTools.filter((t) => t.folder === 'font-converters');
    expect(fontTools.length).toBeGreaterThan(0);
    for (const tool of fontTools) {
      expect(tool.lang).toBe('en');
    }

    const nonEnFontTools = buildTools.filter((t) => t.folder === 'font-converters' && t.lang !== 'en');
    expect(nonEnFontTools).toHaveLength(0);
  });
});
