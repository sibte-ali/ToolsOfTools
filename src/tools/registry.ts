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

// Batch C Health & Fitness tools (EN)
import calorieConfig from './en/calorie-calculator';
import idealWeightConfig from './en/ideal-weight-calculator';
import bodyShapeConfig from './en/body-shape-calculator';
import bmiConfig from './en/bmi-calculator';
import plateWeightConfig from './en/plate-weight-calculator';
import paceConfig from './en/pace-calculator';
import calorieBurnConfig from './en/calorie-burn-calculator';

// Batch C Health & Fitness tools (PT-BR)
import pacePtBrConfig from './pt-br/calculadora-de-pace';
import caloriasPtBrConfig from './pt-br/calculadora-de-calorias';
import macrosPtBrConfig from './pt-br/calculadora-de-macros';
import tdeePtBrConfig from './pt-br/tdee-calculator';
import imcPtBrConfig from './pt-br/imc';

// Batch C Health & Fitness tools (ES)
import ritmoEsConfig from './es/calculadora-de-ritmos';

// Portuguese Finance tools
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
    'sip': sipConfig,
    'scss-calculator': scssConfig,
    'cash-calculator': cashConfig,
    'reducing-emi-calculator': reducingEmiConfig,
    'emi-calculator': emiConfig,
    'gpf-calculator': gpfConfig,
    'gann-square-of-9-calculator': gannConfig,
    'mortgage-loan-calculator': mortgageConfig,
    'compound-interest-calculator': compoundConfig,
    'lump-sum-amount': lumpSumConfig,
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
    'calorie-calculator': calorieConfig,
    'ideal-weight-calculator': idealWeightConfig,
    'body-shape-calculator': bodyShapeConfig,
    'bmi-calculator': bmiConfig,
    'plate-weight-calculator': plateWeightConfig,
    'pace-calculator': paceConfig,
    'calorie-burn-calculator': calorieBurnConfig,
  },
  'pt-br': {
    'calculadora-de-investimentos': investimentoPtBrConfig,
    'calculadora-de-pace': pacePtBrConfig,
    'calculadora-de-calorias': caloriasPtBrConfig,
    'calculadora-de-macros': macrosPtBrConfig,
    'tdee-calculator': tdeePtBrConfig,
    'imc': imcPtBrConfig,
  },
  es: {
    'calculadora-de-ritmos': ritmoEsConfig,
  }
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
