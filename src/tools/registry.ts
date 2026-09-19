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

// Batch D Date & Time tools (EN)
import { estToIstConfig } from './en/est-to-ist';
import { cstToIstConfig } from './en/cst-to-ist-converter';
import { tenAmGmtToIstConfig } from './en/10am-gmt-to-ist';
import { dayCalculatorConfig } from './en/day-calculator';
import { dobCalculatorConfig } from './en/dob-calculator';
import { experienceCalculatorConfig } from './en/experience-calculator';
import { shelfLifeCalculatorConfig } from './en/shelf-life-calculator';

// Batch D Date & Time tools (PT-BR)
import { contadorDeDiasConfig } from './pt-br/contador-de-dias';
import { calculadoraDeHorasTrabalhadasConfig } from './pt-br/calculadora-de-horas-trabalhadas';
import { calculadoraEntreDatasConfig } from './pt-br/calculadora-entre-datas';
import { calculadoraDeHorasConfig } from './pt-br/calculadora-de-horas';

// Portuguese Finance tools
import investimentoPtBrConfig from './pt-br/calculadora-de-investimentos';

// Batch E Tools (EN)
import simplifyConfig from './en/simplify-calculator';
import epochConfig from './en/epoch-converter';
import sqftConfig from './en/square-feet-calculator';
import metersToFeetConfig from './en/meters-to-feet';
import speedConfig from './en/speed-calculator';
import jsonToExcelConfig from './en/json-to-excel';
import jsonFormatterConfig from './en/json-formatter';
import resinConfig from './en/resin-calculator';
import houseCostConfig from './en/house-construction-cost-calculator';
import combinationConfig from './en/combination-calculator';
import msPipeConfig from './en/ms-pipe-weight-calculator';
import infixPostfixConfig from './en/infix-to-postfix-converter';
import gramsToLbsConfig from './en/grams-to-lbs';
import concreteConfig from './en/concrete-calculator';
import stdDevConfig from './en/standard-deviation-calculator';
import mbToKbConfig from './en/mb-to-kb-converter';
import volumetricWeightConfig from './en/volumetric-weight-calculator';
import hectareToAcreConfig from './en/hectare-to-acre';
import mlToGramsConfig from './en/ml-to-grams-converter';

// Batch F Tools (EN)
import loveCalculatorConfig from './en/love-calculator';
import flamesGameConfig from './en/flames-game';
import loShuGridConfig from './en/lo-shu-grid';
import nameNumerologyDobConfig from './en/name-numerology-calculator-by-date-of-birth';
import toneGeneratorConfig from './en/tone-generator';
import mulankCalculatorConfig from './en/mulank-calculator';
import bhagyankCalculatorConfig from './en/bhagyank-calculator';
import friendshipCalculatorConfig from './en/friendship-calculator-by-name';
import businessNameNumerologyConfig from './en/business-name-numerology-calculator';

// Batch E Tools (ES)
import interesCompuestoConfig from './es/interes-compuesto';
import calcularPorcentajeConfig from './es/calcular-porcentaje';

// Batch E Tools (PT-BR)
import metroQuadradoPtBrConfig from './pt-br/como-calcular-metro-quadrado';
import regraDeTresPtBrConfig from './pt-br/regra-de-3-online';
import porcentagemPtBrConfig from './pt-br/calculadora-de-porcentagem';
import rampaPtBrConfig from './pt-br/calculadora-de-rampa';
import fracaoPtBrConfig from './pt-br/calculadora-de-fracao';

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
    'est-to-ist': estToIstConfig,
    'cst-to-ist-converter': cstToIstConfig,
    '10am-gmt-to-ist': tenAmGmtToIstConfig,
    'day-calculator': dayCalculatorConfig,
    'dob-calculator': dobCalculatorConfig,
    'experience-calculator': experienceCalculatorConfig,
    'shelf-life-calculator': shelfLifeCalculatorConfig,
    // Batch E EN
    'simplify-calculator': simplifyConfig,
    'epoch-converter': epochConfig,
    'square-feet-calculator': sqftConfig,
    'meters-to-feet': metersToFeetConfig,
    'speed-calculator': speedConfig,
    'json-to-excel': jsonToExcelConfig,
    'json-formatter': jsonFormatterConfig,
    'resin-calculator': resinConfig,
    'house-construction-cost-calculator': houseCostConfig,
    'combination-calculator': combinationConfig,
    'ms-pipe-weight-calculator': msPipeConfig,
    'infix-to-postfix-converter': infixPostfixConfig,
    'grams-to-lbs': gramsToLbsConfig,
    'concrete-calculator': concreteConfig,
    'standard-deviation-calculator': stdDevConfig,
    'mb-to-kb-converter': mbToKbConfig,
    'volumetric-weight-calculator': volumetricWeightConfig,
    'hectare-to-acre': hectareToAcreConfig,
    'ml-to-grams-converter': mlToGramsConfig,
    // Batch F Tools
    'love-calculator': loveCalculatorConfig,
    'flames-game': flamesGameConfig,
    'lo-shu-grid': loShuGridConfig,
    'name-numerology-calculator-by-date-of-birth': nameNumerologyDobConfig,
    'tone-generator': toneGeneratorConfig,
    'mulank-calculator': mulankCalculatorConfig,
    'bhagyank-calculator': bhagyankCalculatorConfig,
    'friendship-calculator-by-name': friendshipCalculatorConfig,
    'business-name-numerology-calculator': businessNameNumerologyConfig,
  },
  'pt-br': {
    'calculadora-de-investimentos': investimentoPtBrConfig,
    'calculadora-de-pace': pacePtBrConfig,
    'calculadora-de-calorias': caloriasPtBrConfig,
    'calculadora-de-macros': macrosPtBrConfig,
    'tdee-calculator': tdeePtBrConfig,
    'imc': imcPtBrConfig,
    'contador-de-dias': contadorDeDiasConfig,
    'calculadora-de-horas-trabalhadas': calculadoraDeHorasTrabalhadasConfig,
    'calculadora-entre-datas': calculadoraEntreDatasConfig,
    'calculadora-de-horas': calculadoraDeHorasConfig,
    // Batch E PT-BR
    'como-calcular-metro-quadrado': metroQuadradoPtBrConfig,
    'regra-de-3-online': regraDeTresPtBrConfig,
    'calculadora-de-porcentagem': porcentagemPtBrConfig,
    'calculadora-de-rampa': rampaPtBrConfig,
    'calculadora-de-fracao': fracaoPtBrConfig,
  },
  es: {
    'calculadora-de-ritmos': ritmoEsConfig,
    // Batch E ES
    'interes-compuesto': interesCompuestoConfig,
    'calcular-porcentaje': calcularPorcentajeConfig,
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
