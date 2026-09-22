import { en } from './en';
import { ptBr } from './pt-br';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { nl } from './nl';
import { ru } from './ru';
import { jp } from './jp';
import { cn } from './cn';
import { kr } from './kr';
import { sa } from './sa';
import { il } from './il';
import type { SupportedLanguage, UIStrings } from './types';

export * from './types';
export { en, ptBr, es, fr, de, it, nl, ru, jp, cn, kr, sa, il };

export const supportedLanguages: SupportedLanguage[] = [
  'en',
  'es',
  'fr',
  'de',
  'pt-br',
  'it',
  'nl',
  'ru',
  'jp',
  'cn',
  'kr',
  'sa',
  'il',
];
export const defaultLanguage: SupportedLanguage = 'en';

export const translations: Record<SupportedLanguage, UIStrings> = {
  en,
  'pt-br': ptBr,
  es,
  fr,
  de,
  it,
  nl,
  ru,
  jp,
  cn,
  kr,
  sa,
  il,
};

export function getTranslations(lang: string): UIStrings {
  const sLang = lang as SupportedLanguage;
  if (translations[sLang]) {
    return translations[sLang];
  }
  return en;
}

/**
 * Returns the valid BCP-47 value for the <html lang="..."> attribute.
 */
export function getHtmlLang(lang: string): string {
  switch (lang) {
    case 'pt-br':
      return 'pt-BR';
    case 'es':
      return 'es';
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'it':
      return 'it';
    case 'nl':
      return 'nl';
    case 'ru':
      return 'ru';
    case 'jp':
      return 'ja';
    case 'cn':
      return 'zh-Hans';
    case 'kr':
      return 'ko';
    case 'sa':
      return 'ar';
    case 'il':
      return 'he';
    default:
      return 'en';
  }
}

export function getLanguageHome(lang: string): string {
  if (lang === 'en' || !lang) return '/';
  if (lang === 'pt-br') return '/pt-br/';
  if (supportedLanguages.includes(lang as SupportedLanguage)) {
    return `/${lang}/`;
  }
  return '/';
}

