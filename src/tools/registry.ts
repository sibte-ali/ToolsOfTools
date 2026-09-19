import type { ToolConfig } from '../lib/engine/types';

// English tools
import swpConfig from './en/swp-calculator';
import pfConfig from './en/pf-calculator';
import discountConfig from './en/discount-calculator';
import xirrConfig from './en/xirr-calculator';
import personalLoanConfig from './en/personal-loan-emi-calculator';
import gstConfig from './en/gst-calculator';
import dailySipConfig from './en/daily-sip-calculator';
import lotSizeConfig from './en/lot-size-calculator';
import carLoanConfig from './en/car-loan-emi-calculator';
import homeLoanConfig from './en/home-loan-calculator';
import sipConfig from './en/sip';
import scssConfig from './en/scss-calculator';
import cashConfig from './en/cash-calculator';
import reducingEmiConfig from './en/reducing-emi-calculator';
import emiConfig from './en/emi-calculator';
import gpfConfig from './en/gpf-calculator';
import gannConfig from './en/gann-square-of-9-calculator';
import mortgageConfig from './en/mortgage-loan-calculator';
import compoundConfig from './en/compound-interest-calculator';
import lumpSumConfig from './en/lump-sum-amount';

// Portuguese tools
import investimentoPtBrConfig from './pt-br/calculadora-de-investimentos';

const registry: Record<string, Record<string, ToolConfig>> = {
  en: {
    'swp-calculator': swpConfig,
    'pf-calculator': pfConfig,
    'discount-calculator': discountConfig,
    'xirr-calculator': xirrConfig,
    'personal-loan-emi-calculator': personalLoanConfig,
    'gst-calculator': gstConfig,
    'daily-sip-calculator': dailySipConfig,
    'lot-size-calculator': lotSizeConfig,
    'car-loan-emi-calculator': carLoanConfig,
    'home-loan-calculator': homeLoanConfig,
    sip: sipConfig,
    'scss-calculator': scssConfig,
    'cash-calculator': cashConfig,
    'reducing-emi-calculator': reducingEmiConfig,
    'emi-calculator': emiConfig,
    'gpf-calculator': gpfConfig,
    'gann-square-of-9-calculator': gannConfig,
    'mortgage-loan-calculator': mortgageConfig,
    'compound-interest-calculator': compoundConfig,
    'lump-sum-amount': lumpSumConfig,
  },
  'pt-br': {
    'calculadora-de-investimentos': investimentoPtBrConfig,
  },
};

export function getToolConfig(lang: string, slug: string): ToolConfig | null {
  const normalizedLang = lang.toLowerCase();
  const langGroup = registry[normalizedLang];
  if (langGroup && langGroup[slug]) {
    return langGroup[slug];
  }
  // Fallback to English if tool config exists there
  if (registry.en && registry.en[slug]) {
    return registry.en[slug];
  }
  return null;
}

export default registry;
