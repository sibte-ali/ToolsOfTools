import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import cgpaRules from '../../data/cgpa-rules.json';

export function convertPercentageToCgpa(params: {
  percentage: number;
  rule: 'cbse' | 'vtu' | 'standard' | 'custom';
  customMultiplier?: number;
}) {
  const { percentage, rule, customMultiplier = 9.5 } = params;

  let cgpa = 0;
  let formulaDisplay = '';

  if (rule === 'cbse') {
    cgpa = roundHalfAwayFromZero(percentage / cgpaRules.cbse.multiplier, 2);
    formulaDisplay = `CGPA = ${percentage} / ${cgpaRules.cbse.multiplier} = ${cgpa}`;
  } else if (rule === 'vtu') {
    // VTU rule: Percentage = (CGPA - 0.75) * 10 => CGPA = (Percentage / 10) + 0.75
    cgpa = roundHalfAwayFromZero(percentage / 10 + 0.75, 2);
    formulaDisplay = `CGPA = (${percentage} / 10) + 0.75 = ${cgpa}`;
  } else if (rule === 'custom') {
    const mult = customMultiplier > 0 ? customMultiplier : 9.5;
    cgpa = roundHalfAwayFromZero(percentage / mult, 2);
    formulaDisplay = `CGPA = ${percentage} / ${mult} = ${cgpa}`;
  } else {
    // Standard 10 point
    cgpa = roundHalfAwayFromZero(percentage / 10, 2);
    formulaDisplay = `CGPA = ${percentage} / 10 = ${cgpa}`;
  }

  // Cap at 10.0 scale
  const normalizedCgpa = Math.min(10, Math.max(0, cgpa));

  return {
    cgpa: normalizedCgpa,
    formulaDisplay,
  };
}

export const config: ToolConfig = {
  id: 'percentage-to-cgpa',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'percentage',
      label: 'Aggregate Percentage (%)',
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1,
      default: 85.5,
      unit: '%',
      help: 'Your overall percentage obtained across all subjects',
    },
    {
      key: 'rule',
      label: 'Grading Board / University Standard',
      type: 'select',
      default: 'cbse',
      options: [
        { label: 'CBSE Standard (Divide by 9.5)', value: 'cbse' },
        { label: 'VTU Standard: (Percentage / 10) + 0.75', value: 'vtu' },
        { label: 'Standard 10-Point Scale (Divide by 10)', value: 'standard' },
        { label: 'Custom Multiplier (Divide by X)', value: 'custom' },
      ],
    },
    {
      key: 'customMultiplier',
      label: 'Custom Multiplier Value',
      type: 'number',
      min: 1,
      max: 20,
      step: 0.1,
      default: 9.5,
    },
  ],
  outputs: [
    {
      key: 'cgpa',
      label: 'Equivalent CGPA (10-Point Scale)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'formulaDisplay',
      label: 'Conversion Formula Used',
      format: 'text',
    },
    {
      key: 'gradeClassification',
      label: 'Classification',
      format: 'text',
    },
  ],
  compute(values) {
    const percentage = Number(values.percentage) || 85.5;
    const rule = (values.rule as any) || 'cbse';
    const customMultiplier = Number(values.customMultiplier) || 9.5;

    const res = convertPercentageToCgpa({
      percentage,
      rule,
      customMultiplier,
    });

    let classification = 'First Class with Distinction';
    if (percentage < 40) classification = 'Fail';
    else if (percentage < 50) classification = 'Pass Class';
    else if (percentage < 60) classification = 'Second Class';
    else if (percentage < 75) classification = 'First Class';

    return {
      cgpa: res.cgpa,
      formulaDisplay: res.formulaDisplay,
      gradeClassification: classification,
      chartData: {
        type: 'stacked',
        labels: ['CGPA Score on 10.0 Scale'],
        series: [
          { name: 'CGPA Earned', color: '#10b981', values: [res.cgpa] },
          { name: 'Remaining to 10.0', color: '#e5e7eb', values: [Math.max(0, 10 - res.cgpa)] },
        ],
      },
    };
  },
  chart: 'stacked',
};

export default config;
