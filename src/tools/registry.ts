import type { ToolConfig } from '../lib/engine/types';

// Batch A Finance tools
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

// Batch B Education tools
import attendanceConfig from './en/attendance-calculator';
import catConfig from './en/cat-score-calculator';
import cgpaToPctConfig from './en/how-to-calculate-cgpa-to-percentage';
import marksPctConfig from './en/marks-percentage-calculator';
import vitCgpaConfig from './en/vit-cgpa-calculator';
import pctToCgpaConfig from './en/percentage-to-cgpa';
import jeeMainConfig from './en/jee-marks-calculator';
import sgpaToCgpaConfig from './en/sgpa-to-cgpa';
import srmCgpaConfig from './en/srm-cgpa-calculator';
import sgpaToPctConfig from './en/how-to-convert-sgpa-into-percentage';
import jeeAdvConfig from './en/jee-advanced-marks-calculator';
import ieltsBandConfig from './en/ielts-band-calculator';
import markExamConfig from './en/mark-calculator-exam';
import gateConfig from './en/gate-calculator';

// Portuguese tools
import investimentoPtBrConfig from './pt-br/calculadora-de-investimentos';

const registry: Record<string, Record<string, ToolConfig>> = {
  en: {
    // Batch A
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

    // Batch B
    'attendance-calculator': attendanceConfig,
    'cat-score-calculator': catConfig,
    'how-to-calculate-cgpa-to-percentage': cgpaToPctConfig,
    'marks-percentage-calculator': marksPctConfig,
    'vit-cgpa-calculator': vitCgpaConfig,
    'percentage-to-cgpa': pctToCgpaConfig,
    'jee-marks-calculator': jeeMainConfig,
    'sgpa-to-cgpa': sgpaToCgpaConfig,
    'srm-cgpa-calculator': srmCgpaConfig,
    'how-to-convert-sgpa-into-percentage': sgpaToPctConfig,
    'jee-advanced-marks-calculator': jeeAdvConfig,
    'ielts-band-calculator': ieltsBandConfig,
    'mark-calculator-exam': markExamConfig,
    'gate-calculator': gateConfig,
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
  if (registry.en && registry.en[slug]) {
    return registry.en[slug];
  }
  return null;
}

export default registry;
