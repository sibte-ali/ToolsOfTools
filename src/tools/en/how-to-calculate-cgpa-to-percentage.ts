import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import cgpaRules from '../../data/cgpa-rules.json';

export function calculateCgpaToPercentage(params: {
  mode: 'cgpaToPct' | 'pctToCgpa';
  value: number;
  rule: 'cbse' | 'vtu' | 'anna_univ' | 'mumbai_univ' | 'standard_10' | 'custom';
  customMultiplier?: number;
}) {
  const { mode, value, rule, customMultiplier = 9.5 } = params;

  let calculatedPercentage = 0;
  let calculatedCgpa = 0;
  let formulaWithNumbers = '';

  if (mode === 'pctToCgpa') {
    // Reverse mode: Percentage -> CGPA
    calculatedPercentage = value;
    if (rule === 'cbse') {
      calculatedCgpa = roundHalfAwayFromZero(value / cgpaRules.cbse.multiplier, 2);
      formulaWithNumbers = `CGPA = ${value} / ${cgpaRules.cbse.multiplier} = ${calculatedCgpa}`;
    } else if (rule === 'vtu') {
      calculatedCgpa = roundHalfAwayFromZero(value / 10 + 0.75, 2);
      formulaWithNumbers = `CGPA = (${value} / 10) + 0.75 = ${calculatedCgpa}`;
    } else if (rule === 'custom') {
      const mult = customMultiplier > 0 ? customMultiplier : 9.5;
      calculatedCgpa = roundHalfAwayFromZero(value / mult, 2);
      formulaWithNumbers = `CGPA = ${value} / ${mult} = ${calculatedCgpa}`;
    } else {
      calculatedCgpa = roundHalfAwayFromZero(value / 10, 2);
      formulaWithNumbers = `CGPA = ${value} / 10 = ${calculatedCgpa}`;
    }
  } else {
    // Standard mode: CGPA -> Percentage
    calculatedCgpa = value;
    if (rule === 'cbse') {
      calculatedPercentage = roundHalfAwayFromZero(value * cgpaRules.cbse.multiplier, 2);
      formulaWithNumbers = `Percentage = ${value} × ${cgpaRules.cbse.multiplier} = ${calculatedPercentage}%`;
    } else if (rule === 'vtu') {
      calculatedPercentage = roundHalfAwayFromZero((value - 0.75) * 10, 2);
      formulaWithNumbers = `Percentage = (${value} - 0.75) × 10 = ${calculatedPercentage}%`;
    } else if (rule === 'mumbai_univ') {
      if (value >= 7) {
        calculatedPercentage = roundHalfAwayFromZero(7.25 * value + 11, 2);
        formulaWithNumbers = `Percentage = (7.25 × ${value}) + 11 = ${calculatedPercentage}%`;
      } else {
        calculatedPercentage = roundHalfAwayFromZero(7.1 * value + 12, 2);
        formulaWithNumbers = `Percentage = (7.1 × ${value}) + 12 = ${calculatedPercentage}%`;
      }
    } else if (rule === 'custom') {
      const mult = customMultiplier > 0 ? customMultiplier : 9.5;
      calculatedPercentage = roundHalfAwayFromZero(value * mult, 2);
      formulaWithNumbers = `Percentage = ${value} × ${mult} = ${calculatedPercentage}%`;
    } else {
      // Standard / Anna Univ: CGPA * 10
      calculatedPercentage = roundHalfAwayFromZero(value * 10, 2);
      formulaWithNumbers = `Percentage = ${value} × 10 = ${calculatedPercentage}%`;
    }
  }

  return {
    calculatedPercentage,
    calculatedCgpa,
    formulaWithNumbers,
    mode,
    rule,
  };
}

export const config: ToolConfig = {
  id: 'how-to-calculate-cgpa-to-percentage',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'mode',
      label: 'Conversion Direction',
      type: 'select',
      default: 'cgpaToPct',
      options: [
        { label: 'CGPA to Percentage (e.g. 8.4 -> 79.8%)', value: 'cgpaToPct' },
        { label: 'Percentage to CGPA (Reverse: e.g. 80% -> 8.42)', value: 'pctToCgpa' },
      ],
    },
    {
      key: 'scoreValue',
      label: 'Score to Convert (CGPA or %)',
      type: 'number',
      min: 0,
      max: 100,
      step: 0.01,
      default: 8.4,
      help: 'Enter your CGPA (e.g. 8.4) or Percentage (e.g. 80) based on selected direction',
    },
    {
      key: 'universityRule',
      label: 'University / Board Standard',
      type: 'select',
      default: 'cbse',
      options: [
        { label: 'CBSE (Class 10): CGPA × 9.5', value: 'cbse' },
        { label: 'VTU: (CGPA - 0.75) × 10', value: 'vtu' },
        { label: 'Anna University / Standard UGC: CGPA × 10', value: 'anna_univ' },
        { label: 'Mumbai University (10-Pt CBCS)', value: 'mumbai_univ' },
        { label: 'Custom Multiplier Formula', value: 'custom' },
      ],
    },
    {
      key: 'customMultiplier',
      label: 'Custom Multiplier (if custom rule chosen)',
      type: 'number',
      min: 1,
      max: 25,
      step: 0.1,
      default: 9.5,
    },
  ],
  outputs: [
    {
      key: 'resultValue',
      label: 'Converted Result',
      format: 'text',
      highlight: true,
    },
    {
      key: 'formulaWithNumbers',
      label: 'Step-by-Step Applied Formula',
      format: 'text',
    },
    {
      key: 'equivalentSummary',
      label: 'Academic Summary',
      format: 'text',
    },
  ],
  compute(values) {
    const mode = (values.mode as any) === 'pctToCgpa' ? 'pctToCgpa' : 'cgpaToPct';
    const scoreVal = Number(values.scoreValue) || 8.4;
    const rule = (values.universityRule as any) || 'cbse';
    const customMult = Number(values.customMultiplier) || 9.5;

    const res = calculateCgpaToPercentage({
      mode,
      value: scoreVal,
      rule,
      customMultiplier: customMult,
    });

    const resultValue =
      mode === 'pctToCgpa'
        ? `${res.calculatedCgpa} CGPA`
        : `${res.calculatedPercentage}%`;

    const summary =
      mode === 'pctToCgpa'
        ? `${scoreVal}% converts to ${res.calculatedCgpa} CGPA on a 10-point scale.`
        : `${scoreVal} CGPA converts to an equivalent of ${res.calculatedPercentage}%.`;

    return {
      resultValue,
      formulaWithNumbers: res.formulaWithNumbers,
      equivalentSummary: summary,
    };
  },
};

export default config;
