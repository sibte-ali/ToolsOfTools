export const supportedLanguages = ['en', 'es', 'pt-br'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export const defaultLanguage: SupportedLanguage = 'en';
