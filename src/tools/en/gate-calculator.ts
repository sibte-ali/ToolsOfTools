import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export function calculateGateMarks(params: {
  mcq1Correct: number;
  mcq1Wrong: number;
  mcq2Correct: number;
  mcq2Wrong: number;
  nat1Correct: number;
  nat1Wrong: number; // no negative
  nat2Correct: number;
  nat2Wrong: number; // no negative
  computeGateScore?: boolean;
  mq?: number; // qualifying marks (e.g. 25)
  mt?: number; // mean of top 0.1% (e.g. 75)
}) {
  const mcq1 = params.mcq1Correct * 1 - params.mcq1Wrong * (1 / 3);
  const mcq2 = params.mcq2Correct * 2 - params.mcq2Wrong * (2 / 3);
  const nat1 = params.nat1Correct * 1;
  const nat2 = params.nat2Correct * 2;

  const rawMarks = roundHalfAwayFromZero(mcq1 + mcq2 + nat1 + nat2, 2);
  const totalQuestions =
    params.mcq1Correct +
    params.mcq1Wrong +
    params.mcq2Correct +
    params.mcq2Wrong +
    params.nat1Correct +
    params.nat1Wrong +
    params.nat2Correct +
    params.nat2Wrong;

  let normalizedGateScore = 0;
  if (params.computeGateScore) {
    const mq = params.mq || 25;
    const mt = params.mt || 75;
    const sq = 350;
    const st = 900;

    if (rawMarks >= mq) {
      const score = sq + ((st - sq) * (rawMarks - mq)) / (mt - mq);
      normalizedGateScore = Math.min(1000, Math.max(0, roundHalfAwayFromZero(score, 0)));
    } else {
      normalizedGateScore = Math.max(0, roundHalfAwayFromZero((sq * rawMarks) / mq, 0));
    }
  }

  return {
    rawMarks,
    mcq1: roundHalfAwayFromZero(mcq1, 2),
    mcq2: roundHalfAwayFromZero(mcq2, 2),
    nat1,
    nat2,
    totalQuestions,
    normalizedGateScore,
  };
}

export const config: ToolConfig = {
  id: 'gate-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'mcq1Correct',
      label: '1-Mark MCQs: Correct (+1)',
      type: 'number',
      min: 0,
      max: 30,
      step: 1,
      default: 18,
    },
    {
      key: 'mcq1Wrong',
      label: '1-Mark MCQs: Incorrect (-0.33)',
      type: 'number',
      min: 0,
      max: 30,
      step: 1,
      default: 4,
    },
    {
      key: 'mcq2Correct',
      label: '2-Mark MCQs: Correct (+2)',
      type: 'number',
      min: 0,
      max: 35,
      step: 1,
      default: 16,
    },
    {
      key: 'mcq2Wrong',
      label: '2-Mark MCQs: Incorrect (-0.67)',
      type: 'number',
      min: 0,
      max: 35,
      step: 1,
      default: 3,
    },
    {
      key: 'nat1Correct',
      label: '1-Mark NAT / MSQ: Correct (+1, 0 negative)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 6,
    },
    {
      key: 'nat1Wrong',
      label: '1-Mark NAT / MSQ: Incorrect (0 negative)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 2,
    },
    {
      key: 'nat2Correct',
      label: '2-Mark NAT / MSQ: Correct (+2, 0 negative)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 8,
    },
    {
      key: 'nat2Wrong',
      label: '2-Mark NAT / MSQ: Incorrect (0 negative)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 2,
    },
    {
      key: 'computeGateScore',
      label: 'Estimate Official GATE Score (out of 1000)?',
      type: 'select',
      default: 'yes',
      options: [
        { label: 'Yes (Using Qualifying & Top-Rank Metrics)', value: 'yes' },
        { label: 'No (Raw Marks Only)', value: 'no' },
      ],
    },
    {
      key: 'mq',
      label: 'Discipline Qualifying Cutoff (Mq, approx 25-32)',
      type: 'number',
      min: 15,
      max: 45,
      step: 0.1,
      default: 25,
      help: 'General category qualifying marks for your engineering paper',
    },
    {
      key: 'mt',
      label: 'Mean Marks of Top 0.1% (Mt, approx 70-85)',
      type: 'number',
      min: 50,
      max: 95,
      step: 0.1,
      default: 75,
      help: 'Average marks obtained by the top 0.1% or top 10 candidates',
    },
  ],
  outputs: [
    {
      key: 'rawMarks',
      label: 'Total GATE Raw Marks (/100)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'gateScoreDisplay',
      label: 'Estimated Normalized GATE Score (/1000)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'mcqTotal',
      label: 'Net Score from MCQs',
      format: 'number',
    },
    {
      key: 'natTotal',
      label: 'Net Score from NAT / MSQs',
      format: 'number',
    },
  ],
  compute(values) {
    const computeScore = values.computeGateScore !== 'no';
    const res = calculateGateMarks({
      mcq1Correct: Number(values.mcq1Correct) || 0,
      mcq1Wrong: Number(values.mcq1Wrong) || 0,
      mcq2Correct: Number(values.mcq2Correct) || 0,
      mcq2Wrong: Number(values.mcq2Wrong) || 0,
      nat1Correct: Number(values.nat1Correct) || 0,
      nat1Wrong: Number(values.nat1Wrong) || 0,
      nat2Correct: Number(values.nat2Correct) || 0,
      nat2Wrong: Number(values.nat2Wrong) || 0,
      computeGateScore: computeScore,
      mq: Number(values.mq) || 25,
      mt: Number(values.mt) || 75,
    });

    return {
      rawMarks: res.rawMarks,
      gateScoreDisplay: computeScore ? res.normalizedGateScore : res.rawMarks,
      mcqTotal: roundHalfAwayFromZero(res.mcq1 + res.mcq2, 2),
      natTotal: roundHalfAwayFromZero(res.nat1 + res.nat2, 2),
      chartData: {
        type: 'stacked',
        labels: ['Marks Contribution'],
        series: [
          { name: '1-Mark Questions', color: '#3b82f6', values: [Math.max(0, res.mcq1 + res.nat1)] },
          { name: '2-Mark Questions', color: '#10b981', values: [Math.max(0, res.mcq2 + res.nat2)] },
        ],
      },
    };
  },
  table(values) {
    const computeScore = values.computeGateScore !== 'no';
    const res = calculateGateMarks({
      mcq1Correct: Number(values.mcq1Correct) || 0,
      mcq1Wrong: Number(values.mcq1Wrong) || 0,
      mcq2Correct: Number(values.mcq2Correct) || 0,
      mcq2Wrong: Number(values.mcq2Wrong) || 0,
      nat1Correct: Number(values.nat1Correct) || 0,
      nat1Wrong: Number(values.nat1Wrong) || 0,
      nat2Correct: Number(values.nat2Correct) || 0,
      nat2Wrong: Number(values.nat2Wrong) || 0,
      computeGateScore: computeScore,
      mq: Number(values.mq) || 25,
      mt: Number(values.mt) || 75,
    });

    return {
      columns: [
        { key: 'category', label: 'Question Type', format: 'text' },
        { key: 'score', label: 'Net Marks Contributed', format: 'number' },
      ],
      rows: [
        { category: '1-Mark MCQs (Net of -1/3 penalties)', score: res.mcq1 },
        { category: '2-Mark MCQs (Net of -2/3 penalties)', score: res.mcq2 },
        { category: '1-Mark NAT & MSQ (No negative)', score: res.nat1 },
        { category: '2-Mark NAT & MSQ (No negative)', score: res.nat2 },
        { category: 'Total GATE Raw Marks', score: res.rawMarks },
      ],
    };
  },
  chart: 'stacked',
};

export default config;
