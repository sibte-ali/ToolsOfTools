import { en } from './en';
import { ptBr } from './pt-br';
import { es } from './es';
import type { SupportedLanguage, UIStrings } from './types';

export * from './types';
export { en, ptBr, es };

export const supportedLanguages: SupportedLanguage[] = ['en', 'pt-br', 'es'];
export const defaultLanguage: SupportedLanguage = 'en';

export const translations: Record<SupportedLanguage, UIStrings> = {
  en,
  'pt-br': ptBr,
  es,
};

export function getTranslations(lang: string): UIStrings {
  if (lang === 'pt-br') return ptBr;
  if (lang === 'es') return es;
  return en;
}

/**
 * Returns the valid BCP-47 value for the <html lang="..."> attribute.
 * Requirements state: "The <html lang> values must be en, pt-BR, es."
 */
export function getHtmlLang(lang: string): string {
  if (lang === 'pt-br') return 'pt-BR';
  if (lang === 'es') return 'es';
  return 'en';
}

export function getLanguageHome(lang: string): string {
  if (lang === 'pt-br') return '/pt-br/';
  if (lang === 'es') return '/es/';
  return '/';
}
