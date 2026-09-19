import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export interface BodyShapeInput {
  unitSystem?: 'metric' | 'imperial';
  bust: number;
  waist: number;
  highHip: number;
  hip: number;
}

export interface BodyShapeResult {
  bodyShape: string;
  waistToHipRatio: number;
  bustToWaistRatio: number;
  shapeDescription: string;
  styleAdvice: string;
}

export function classifyBodyShape(input: BodyShapeInput): BodyShapeResult {
  const { bust, waist, hip } = input;

  if (bust <= 0 || waist <= 0 || hip <= 0) {
    return {
      bodyShape: 'Undefined',
      waistToHipRatio: 0,
      bustToWaistRatio: 0,
      shapeDescription: 'Please provide valid positive measurements.',
      styleAdvice: 'N/A'
    };
  }

  const whr = roundHalfAwayFromZero(waist / hip, 2);
  const bwr = roundHalfAwayFromZero(bust / waist, 2);

  // Female Anthropometric Shape Classification based on standard fashion geometry:
  // 1. Hourglass: Bust and hip within 5% of each other, waist significantly defined (waist <= 0.75 * bust and waist <= 0.75 * hip)
  const bustHipDiffPct = Math.abs(bust - hip) / Math.max(bust, hip);
  const waistBustRatio = waist / bust;
  const waistHipRatio = waist / hip;

  let shape = 'Rectangle';
  let desc = '';
  let advice = '';

  if (waist >= bust && waist >= hip) {
    shape = 'Apple (Round)';
    desc = 'Your waist measurement is wider than your bust and hips, with weight concentrated predominantly around the midsection.';
    advice = 'Empire waist dresses, A-line skirts, flowy tunics, and V-neck tops create elongated silhouettes.';
  } else if (bustHipDiffPct <= 0.05 && waistBustRatio <= 0.75 && waistHipRatio <= 0.75) {
    shape = 'Hourglass';
    desc = 'Your bust and hips are closely balanced with a clearly defined, narrower waistline.';
    advice = 'Fitted dresses, wrap tops, belted jackets, and high-waisted trousers flatter your natural balance.';
  } else if (hip > bust * 1.05 && waistHipRatio <= 0.8) {
    if (bustHipDiffPct <= 0.10 && waistBustRatio <= 0.75) {
      shape = 'Bottom Hourglass';
      desc = 'A defined waist with hips slightly fuller than your bust, maintaining strong feminine curves.';
      advice = 'Wide-leg trousers, fit-and-flare dresses, and tops with structured shoulders balance proportions.';
    } else {
      shape = 'Pear (Triangle)';
      desc = 'Your hips and thighs are notably broader than your bust and shoulders, with a defined waist.';
      advice = 'Boat necklines, statement sleeves, ruffles, and darker trousers draw visual focus upward.';
    }
  } else if (bust > hip * 1.05) {
    if (bustHipDiffPct <= 0.10 && waistHipRatio <= 0.75) {
      shape = 'Top Hourglass';
      desc = 'A defined waist with a bust slightly fuller than your hips.';
      advice = 'Supportive V-neck tops, A-line skirts, and bootcut jeans balance upper-body fullness.';
    } else {
      shape = 'Inverted Triangle';
      desc = 'Your bust or shoulders are noticeably wider than your hips and waistline.';
      advice = 'V-neck tops, peplum blouses, boyfriend jeans, and flared skirts create proportional hip volume.';
    }
  } else {
    shape = 'Rectangle (Athletic)';
    desc = 'Your bust, waist, and hips share similar proportions without a sharply defined waist taper.';
    advice = 'Belts, belted trench coats, wrap dresses, and sweetheart necklines create the visual illusion of curves.';
  }

  return {
    bodyShape: shape,
    waistToHipRatio: whr,
    bustToWaistRatio: bwr,
    shapeDescription: desc,
    styleAdvice: advice
  };
}

const config: ToolConfig = {
  id: 'body-shape-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'unitSystem',
      label: 'Unit System',
      type: 'select',
      default: 'metric',
      options: [
        { label: 'Metric (Centimeters - cm)', value: 'metric' },
        { label: 'Imperial (Inches - in)', value: 'imperial' }
      ]
    },
    {
      key: 'bust',
      label: 'Bust Circumference',
      type: 'number',
      min: 50,
      max: 200,
      step: 0.5,
      default: 92,
      unit: 'cm or in',
      help: 'Measure around the fullest part of your chest with a tape parallel to the floor.'
    },
    {
      key: 'waist',
      label: 'Waist Circumference',
      type: 'number',
      min: 40,
      max: 180,
      step: 0.5,
      default: 68,
      unit: 'cm or in',
      help: 'Measure at the narrowest point of your torso, typically 2 cm above the navel.'
    },
    {
      key: 'highHip',
      label: 'High Hip Circumference',
      type: 'number',
      min: 50,
      max: 200,
      step: 0.5,
      default: 84,
      unit: 'cm or in',
      help: 'Measure around your hip bones, approximately 7 cm below your natural waist.'
    },
    {
      key: 'hip',
      label: 'Full Hip Circumference',
      type: 'number',
      min: 50,
      max: 220,
      step: 0.5,
      default: 94,
      unit: 'cm or in',
      help: 'Measure around the widest part of your hips and buttocks.'
    }
  ],
  compute(values) {
    const unitSystem = (values.unitSystem as any) || 'metric';
    const bust = Number(values.bust) || (unitSystem === 'imperial' ? 36 : 92);
    const waist = Number(values.waist) || (unitSystem === 'imperial' ? 27 : 68);
    const highHip = Number(values.highHip) || (unitSystem === 'imperial' ? 33 : 84);
    const hip = Number(values.hip) || (unitSystem === 'imperial' ? 37 : 94);

    return classifyBodyShape({ unitSystem, bust, waist, highHip, hip });
  },
  outputs: [
    { key: 'bodyShape', label: 'Identified Silhouette Shape', format: 'text', highlight: true },
    { key: 'waistToHipRatio', label: 'Waist-to-Hip Ratio (WHR)', format: 'number' },
    { key: 'bustToWaistRatio', label: 'Bust-to-Waist Ratio', format: 'number' },
    { key: 'shapeDescription', label: 'Morphological Profile', format: 'text' },
    { key: 'styleAdvice', label: 'Wardrobe & Silhouette Guidance', format: 'text' }
  ],
  chart: 'none'
};

export default config;
