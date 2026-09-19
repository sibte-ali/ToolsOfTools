import type { UIStrings } from './types';

export const en: UIStrings = {
  nav: {
    home: 'Home',
    categories: 'Categories',
    tools: 'All Tools',
    search: 'Search tools...',
  },
  footer: {
    description: 'Fast, client-side online calculators and utilities. 100% private and browser-based.',
    allRightsReserved: 'All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    about: 'About Us',
    contact: 'Contact',
    methodology: 'Calculation Methodology',
  },
  howItWorks: 'How It Works',
  formula: 'Formula',
  workedExample: 'Worked Example',
  faq: 'Frequently Asked Questions',
  relatedTools: 'Related Tools',
  lastUpdated: 'Last updated',
  methodologyLinkText: 'Learn more about how our formulas are verified in our Methodology Guide.',
  disclaimer: {
    none: '',
    finance:
      'Disclaimer: This tool is for informational and educational purposes only and should not be construed as financial, legal, or investment advice. Verify all calculations independently.',
    health:
      'Disclaimer: This tool is provided for educational and general wellness purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.',
    entertainment:
      'Disclaimer: This tool is for entertainment and novelty purposes only. Results are generated for amusement and have no scientific validity.',
  },
  copy: 'Copy',
  reset: 'Reset',
  calculate: 'Calculate',
  errorMessages: {
    required: 'This field is required.',
    invalidNumber: 'Please enter a valid number.',
    general: 'An error occurred during calculation.',
  },
  unitLabels: {
    days: 'Days',
    months: 'Months',
    years: 'Years',
    percentage: '%',
    currency: 'Currency',
  },
  homeHeroHeading: 'Fast, Client-Side Online Tools',
  homeHeroSubtitle: 'Accurate, privacy-friendly calculators and utilities that run 100% in your browser without tracking.',
  valuePropositionTitle: 'Why Use ToolsOfTools?',
  valueProps: [
    {
      title: '100% Client-Side Private',
      desc: 'All computations execute in your local browser runtime. No figures, biometric data, or dates are ever sent to remote servers.',
    },
    {
      title: 'Zero Latency & Instant Response',
      desc: 'No network round trips or server processing delays. Calculations update instantaneously as you type or adjust values.',
    },
    {
      title: 'Mathematically Verified',
      desc: 'Formulas and calculation engines are benchmarked against official regulatory standards and academic specifications.',
    },
  ],
  topTools: 'Popular Tools & Calculators',
  calculadoraTitle: 'Basic & Scientific Calculator',
  calculadoraSubtitle: 'Fast, private calculation directly in your browser with keyboard and keypad support.',
  sources: 'Sources',
  sourcesVerified: 'Formulas verified against standard mathematical and statutory baselines.',
  viewAllInHub: (hub: string) => `← View all ${hub} tools`,
  openTool: 'Open tool →',
  open: 'Open →',
  toolsAvailable: (count: number) => `${count} tools available`,
  widget: {
    primaryValue: 'Primary Value',
    rateOrPct: 'Rate / Percentage (%)',
    calculatedResult: 'Calculated Result',
    standardFormulaNote: 'Based on standard mathematical formula',
  },
};

