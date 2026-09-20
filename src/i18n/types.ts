export type SupportedLanguage =
  | 'en'
  | 'pt-br'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'nl'
  | 'ru'
  | 'jp'
  | 'cn'
  | 'kr'
  | 'sa'
  | 'il';


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
    about: string;
    contact: string;
    methodology: string;
  };
  howItWorks: string;
  formula: string;
  workedExample: string;
  faq: string;
  relatedTools: string;
  lastUpdated: string;
  methodologyLinkText: string;
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
  homeHeroHeading: string;
  homeHeroSubtitle: string;
  valuePropositionTitle: string;
  valueProps: {
    title: string;
    desc: string;
  }[];
  topTools: string;
  calculadoraTitle: string;
  calculadoraSubtitle: string;
  sources: string;
  sourcesVerified: string;
  viewAllInHub: (hub: string) => string;
  openTool: string;
  open: string;
  toolsAvailable: (count: number) => string;
  unitLabels: {
    days: string;
    months: string;
    years: string;
    percentage: string;
    currency: string;
  };
  widget: {
    primaryValue: string;
    rateOrPct: string;
    calculatedResult: string;
    standardFormulaNote: string;
  };
}
