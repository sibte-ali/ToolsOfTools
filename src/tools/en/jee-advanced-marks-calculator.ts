import type { ToolConfig } from '../../lib/engine/types';

export interface JeeAdvPaperParams {
  singleCorrect: number;
  singleWrong: number;
  multiFullCorrect: number;
  multiPartialCount: number; // e.g. 2 marks per partial
  multiWrong: number;
  numericalCorrect: number;
  numericalWrong: number;
}

export function calculateJeeAdvPaper(params: JeeAdvPaperParams) {
  // Typical IIT JEE Advanced scheme:
  // Single choice: +3, -1
  // Multi correct: +4 full, +2 partial avg, -2 wrong
  // Numerical: +4 correct, 0 wrong
  const single = params.singleCorrect * 3 - params.singleWrong * 1;
  const multi =
    params.multiFullCorrect * 4 +
    params.multiPartialCount * 2 -
    params.multiWrong * 2;
  const numerical = params.numericalCorrect * 4;

  const totalPaperMarks = single + multi + numerical;

  return {
    single,
    multi,
    numerical,
    totalPaperMarks,
  };
}

export const config: ToolConfig = {
  id: 'jee-advanced-marks-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    // Paper 1
    {
      key: 'p1SingleCorrect',
      label: 'Paper 1: Single Choice Correct (+3)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 8,
    },
    {
      key: 'p1SingleWrong',
      label: 'Paper 1: Single Choice Wrong (-1)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 2,
    },
    {
      key: 'p1MultiFullCorrect',
      label: 'Paper 1: Multi-Correct Full (+4)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 5,
    },
    {
      key: 'p1MultiPartial',
      label: 'Paper 1: Multi-Correct Partial Points (Avg +2 each)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 3,
    },
    {
      key: 'p1MultiWrong',
      label: 'Paper 1: Multi-Correct Wrong (-2)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 2,
    },
    {
      key: 'p1NumericalCorrect',
      label: 'Paper 1: Numerical Correct (+4, 0 negative)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 6,
    },
    // Paper 2
    {
      key: 'p2SingleCorrect',
      label: 'Paper 2: Single Choice Correct (+3)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 7,
    },
    {
      key: 'p2SingleWrong',
      label: 'Paper 2: Single Choice Wrong (-1)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 3,
    },
    {
      key: 'p2MultiFullCorrect',
      label: 'Paper 2: Multi-Correct Full (+4)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 4,
    },
    {
      key: 'p2MultiPartial',
      label: 'Paper 2: Multi-Correct Partial Points (Avg +2 each)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 2,
    },
    {
      key: 'p2MultiWrong',
      label: 'Paper 2: Multi-Correct Wrong (-2)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 2,
    },
    {
      key: 'p2NumericalCorrect',
      label: 'Paper 2: Numerical Correct (+4, 0 negative)',
      type: 'number',
      min: 0,
      max: 18,
      step: 1,
      default: 5,
    },
  ],
  outputs: [
    {
      key: 'grandTotal',
      label: 'Total JEE Advanced Score (Paper 1 + 2)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'paper1Total',
      label: 'Paper 1 Score',
      format: 'number',
    },
    {
      key: 'paper2Total',
      label: 'Paper 2 Score',
      format: 'number',
    },
    {
      key: 'officialNotice',
      label: 'IIT Organizing Notice',
      format: 'text',
    },
  ],
  compute(values) {
    const p1 = calculateJeeAdvPaper({
      singleCorrect: Number(values.p1SingleCorrect) || 0,
      singleWrong: Number(values.p1SingleWrong) || 0,
      multiFullCorrect: Number(values.p1MultiFullCorrect) || 0,
      multiPartialCount: Number(values.p1MultiPartial) || 0,
      multiWrong: Number(values.p1MultiWrong) || 0,
      numericalCorrect: Number(values.p1NumericalCorrect) || 0,
      numericalWrong: 0,
    });

    const p2 = calculateJeeAdvPaper({
      singleCorrect: Number(values.p2SingleCorrect) || 0,
      singleWrong: Number(values.p2SingleWrong) || 0,
      multiFullCorrect: Number(values.p2MultiFullCorrect) || 0,
      multiPartialCount: Number(values.p2MultiPartial) || 0,
      multiWrong: Number(values.p2MultiWrong) || 0,
      numericalCorrect: Number(values.p2NumericalCorrect) || 0,
      numericalWrong: 0,
    });

    const grandTotal = p1.totalPaperMarks + p2.totalPaperMarks;

    return {
      grandTotal,
      paper1Total: p1.totalPaperMarks,
      paper2Total: p2.totalPaperMarks,
      officialNotice:
        'JEE Advanced marking schemes change yearly by section type. Always cross-verify with your specific year official IIT brochure.',
      chartData: {
        type: 'stacked',
        labels: ['Paper Score Split'],
        series: [
          { name: 'Paper 1 Marks', color: '#3b82f6', values: [Math.max(0, p1.totalPaperMarks)] },
          { name: 'Paper 2 Marks', color: '#10b981', values: [Math.max(0, p2.totalPaperMarks)] },
        ],
      },
    };
  },
  table(values) {
    const p1 = calculateJeeAdvPaper({
      singleCorrect: Number(values.p1SingleCorrect) || 0,
      singleWrong: Number(values.p1SingleWrong) || 0,
      multiFullCorrect: Number(values.p1MultiFullCorrect) || 0,
      multiPartialCount: Number(values.p1MultiPartial) || 0,
      multiWrong: Number(values.p1MultiWrong) || 0,
      numericalCorrect: Number(values.p1NumericalCorrect) || 0,
      numericalWrong: 0,
    });

    const p2 = calculateJeeAdvPaper({
      singleCorrect: Number(values.p2SingleCorrect) || 0,
      singleWrong: Number(values.p2SingleWrong) || 0,
      multiFullCorrect: Number(values.p2MultiFullCorrect) || 0,
      multiPartialCount: Number(values.p2MultiPartial) || 0,
      multiWrong: Number(values.p2MultiWrong) || 0,
      numericalCorrect: Number(values.p2NumericalCorrect) || 0,
      numericalWrong: 0,
    });

    return {
      columns: [
        { key: 'paper', label: 'Examination Paper', format: 'text' },
        { key: 'single', label: 'Single Choice Score', format: 'number' },
        { key: 'multi', label: 'Multi-Correct Score', format: 'number' },
        { key: 'numerical', label: 'Numerical Score', format: 'number' },
        { key: 'total', label: 'Paper Total', format: 'number' },
      ],
      rows: [
        { paper: 'Paper 1', single: p1.single, multi: p1.multi, numerical: p1.numerical, total: p1.totalPaperMarks },
        { paper: 'Paper 2', single: p2.single, multi: p2.multi, numerical: p2.numerical, total: p2.totalPaperMarks },
      ],
    };
  },
  chart: 'stacked',
};

export default config;
