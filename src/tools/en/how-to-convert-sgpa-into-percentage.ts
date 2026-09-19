import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import cgpaRules from '../../data/cgpa-rules.json';

export function convertSgpaToPercentage(params: {
  sgpa: number;
  rule: 'standard' | 'cbse' | 'vtu' | 'mumbai' | 'anna' | 'custom';
  customFormulaMultiplier?: number;
  customOffset?: number;
}) {
  const { sgpa, rule, customFormulaMultiplier = 10, customOffset = 0 } = params;

  let percentage = 0;
  let formulaDisplay = '';

  if (rule === 'cbse') {
    percentage = roundHalfAwayFromZero(sgpa * cgpaRules.cbse.multiplier, 2);
    formulaDisplay = `Percentage = ${sgpa} × 9.5 = ${percentage}%`;
  } else if (rule === 'vtu') {
    percentage = roundHalfAwayFromZero((sgpa - 0.75) * 10, 2);
    formulaDisplay = `Percentage = (${sgpa} - 0.75) × 10 = ${percentage}%`;
  } else if (rule === 'mumbai') {
    if (sgpa >= 7) {
      percentage = roundHalfAwayFromZero(7.25 * sgpa + 11, 2);
      formulaDisplay = `Percentage = (7.25 × ${sgpa}) + 11 = ${percentage}%`;
    } else {
      percentage = roundHalfAwayFromZero(7.1 * sgpa + 12, 2);
      formulaDisplay = `Percentage = (7.1 × ${sgpa}) + 12 = ${percentage}%`;
    }
  } else if (rule === 'anna') {
    percentage = roundHalfAwayFromZero(sgpa * 10, 2);
    formulaDisplay = `Percentage = ${sgpa} × 10 = ${percentage}%`;
  } else if (rule === 'custom') {
    percentage = roundHalfAwayFromZero((sgpa - customOffset) * customFormulaMultiplier, 2);
    formulaDisplay = `Percentage = (${sgpa} - ${customOffset}) × ${customFormulaMultiplier} = ${percentage}%`;
  } else {
    percentage = roundHalfAwayFromZero(sgpa * 10, 2);
    formulaDisplay = `Percentage = ${sgpa} × 10 = ${percentage}%`;
  }

  // Cap at 100%
  const finalPercentage = Math.min(100, Math.max(0, percentage));

  return {
    percentage: finalPercentage,
    formulaDisplay,
  };
}

export const config: ToolConfig = {
  id: 'how-to-convert-sgpa-into-percentage',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'sgpa',
      label: 'Semester GPA (SGPA) Score',
      type: 'number',
      min: 0,
      max: 10,
      step: 0.01,
      default: 8.6,
      help: 'Enter your SGPA (0.0 to 10.0 scale)',
    },
    {
      key: 'rule',
      label: 'University / Board Conversion Standard',
      type: 'select',
      default: 'standard',
      options: [
        { label: 'Standard UGC / AICTE: SGPA × 10', value: 'standard' },
        { label: 'CBSE Secondary Standard: SGPA × 9.5', value: 'cbse' },
        { label: 'VTU Engineering: (SGPA - 0.75) × 10', value: 'vtu' },
        { label: 'Anna University: SGPA × 10', value: 'anna' },
        { label: 'Mumbai University (10-Pt CBCS)', value: 'mumbai' },
        { label: 'Custom Formula: (SGPA - Offset) × Multiplier', value: 'custom' },
      ],
    },
    {
      key: 'customMultiplier',
      label: 'Custom Multiplier (if custom chosen)',
      type: 'number',
      min: 1,
      max: 20,
      step: 0.1,
      default: 10,
    },
    {
      key: 'customOffset',
      label: 'Custom Offset (if custom chosen)',
      type: 'number',
      min: 0,
      max: 5,
      step: 0.05,
      default: 0.75,
    },
  ],
  outputs: [
    {
      key: 'percentage',
      label: 'Equivalent Percentage Score',
      format: 'percent',
      highlight: true,
    },
    {
      key: 'formulaDisplay',
      label: 'Official Formula Breakdown',
      format: 'text',
    },
    {
      key: 'division',
      label: 'University Award Division',
      format: 'text',
    },
  ],
  compute(values) {
    const sgpa = Number(values.sgpa) || 8.6;
    const rule = (values.rule as any) || 'standard';
    const customMultiplier = Number(values.customMultiplier) || 10;
    const customOffset = Number(values.customOffset) || 0;

    const res = convertSgpaToPercentage({
      sgpa,
      rule,
      customFormulaMultiplier: customMultiplier,
      customOffset,
    });

    let division = 'First Class with Distinction';
    if (res.percentage < 40) division = 'Fail';
    else if (res.percentage < 50) division = 'Pass Division';
    else if (res.percentage < 60) division = 'Second Division';
    else if (res.percentage < 75) division = 'First Division';

    return {
      percentage: res.percentage,
      formulaDisplay: res.formulaDisplay,
      division,
      chartData: {
        type: 'stacked',
        labels: ['Marks Equivalent'],
        series: [
          { name: 'Percentage Earned', color: '#10b981', values: [res.percentage] },
          { name: 'Deficit to 100%', color: '#e5e7eb', values: [Math.max(0, 100 - res.percentage)] },
        ],
      },
    };
  },
  chart: 'stacked',
};

export default config;
