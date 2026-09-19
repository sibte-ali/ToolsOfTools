export type SupportedLanguage = 'en' | 'pt-br' | 'es';

export interface UIStrings {
  nav: {
    home: string;
    categories: string;
    tools: string;
    search: string;
  };
  footer: {
    description: string;
    allRightsReserved: string;
    privacy: string;
    terms: string;
  };
  howItWorks: string;
  formula: string;
  workedExample: string;
  faq: string;
  relatedTools: string;
  lastUpdated: string;
  disclaimer: {
    none: string;
    finance: string;
    health: string;
    entertainment: string;
  };
  copy: string;
  reset: string;
  calculate: string;
  errorMessages: {
    required: string;
    invalidNumber: string;
    general: string;
  };
  unitLabels: {
    days: string;
    months: string;
    years: string;
    percentage: string;
    currency: string;
  };
}
