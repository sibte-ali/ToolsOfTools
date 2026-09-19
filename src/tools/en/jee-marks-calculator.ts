import type { ToolConfig } from '../../lib/engine/types';
import examsData from '../../data/exams.json';

export function calculateJeeMainScore(params: {
  phyMcqCorrect: number;
  phyMcqWrong: number;
  phyNumCorrect: number;
  phyNumWrong: number;
  chemMcqCorrect: number;
  chemMcqWrong: number;
  chemNumCorrect: number;
  chemNumWrong: number;
  mathMcqCorrect: number;
  mathMcqWrong: number;
  mathNumCorrect: number;
  mathNumWrong: number;
}) {
  const scoring = examsData.jee_main.scoring; // correct: 4, incorrect_mcq: -1, incorrect_numerical: -1

  const phyScore =
    params.phyMcqCorrect * scoring.correct +
    params.phyMcqWrong * scoring.incorrect_mcq +
    params.phyNumCorrect * scoring.correct +
    params.phyNumWrong * scoring.incorrect_numerical;

  const chemScore =
    params.chemMcqCorrect * scoring.correct +
    params.chemMcqWrong * scoring.incorrect_mcq +
    params.chemNumCorrect * scoring.correct +
    params.chemNumWrong * scoring.incorrect_numerical;

  const mathScore =
    params.mathMcqCorrect * scoring.correct +
    params.mathMcqWrong * scoring.incorrect_mcq +
    params.mathNumCorrect * scoring.correct +
    params.mathNumWrong * scoring.incorrect_numerical;

  const totalScore = phyScore + chemScore + mathScore;

  return {
    phyScore,
    chemScore,
    mathScore,
    totalScore,
    maxMarks: examsData.jee_main.max_marks, // 300
  };
}

export const config: ToolConfig = {
  id: 'jee-marks-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    // Physics
    {
      key: 'phyMcqCorrect',
      label: 'Physics: Correct MCQs (+4)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 15,
    },
    {
      key: 'phyMcqWrong',
      label: 'Physics: Incorrect MCQs (-1)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 3,
    },
    {
      key: 'phyNumCorrect',
      label: 'Physics: Correct Numericals (+4)',
      type: 'number',
      min: 0,
      max: 5,
      step: 1,
      default: 3,
    },
    {
      key: 'phyNumWrong',
      label: 'Physics: Incorrect Numericals (-1)',
      type: 'number',
      min: 0,
      max: 5,
      step: 1,
      default: 1,
    },
    // Chemistry
    {
      key: 'chemMcqCorrect',
      label: 'Chemistry: Correct MCQs (+4)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 16,
    },
    {
      key: 'chemMcqWrong',
      label: 'Chemistry: Incorrect MCQs (-1)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 2,
    },
    {
      key: 'chemNumCorrect',
      label: 'Chemistry: Correct Numericals (+4)',
      type: 'number',
      min: 0,
      max: 5,
      step: 1,
      default: 4,
    },
    {
      key: 'chemNumWrong',
      label: 'Chemistry: Incorrect Numericals (-1)',
      type: 'number',
      min: 0,
      max: 5,
      step: 1,
      default: 0,
    },
    // Mathematics
    {
      key: 'mathMcqCorrect',
      label: 'Mathematics: Correct MCQs (+4)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 12,
    },
    {
      key: 'mathMcqWrong',
      label: 'Mathematics: Incorrect MCQs (-1)',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      default: 4,
    },
    {
      key: 'mathNumCorrect',
      label: 'Mathematics: Correct Numericals (+4)',
      type: 'number',
      min: 0,
      max: 5,
      step: 1,
      default: 2,
    },
    {
      key: 'mathNumWrong',
      label: 'Mathematics: Incorrect Numericals (-1)',
      type: 'number',
      min: 0,
      max: 5,
      step: 1,
      default: 1,
    },
  ],
  outputs: [
    {
      key: 'totalScore',
      label: 'Total JEE Main Score (/300)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'phyScore',
      label: 'Physics Score (/100)',
      format: 'number',
    },
    {
      key: 'chemScore',
      label: 'Chemistry Score (/100)',
      format: 'number',
    },
    {
      key: 'mathScore',
      label: 'Mathematics Score (/100)',
      format: 'number',
    },
  ],
  compute(values) {
    const res = calculateJeeMainScore({
      phyMcqCorrect: Number(values.phyMcqCorrect) || 0,
      phyMcqWrong: Number(values.phyMcqWrong) || 0,
      phyNumCorrect: Number(values.phyNumCorrect) || 0,
      phyNumWrong: Number(values.phyNumWrong) || 0,
      chemMcqCorrect: Number(values.chemMcqCorrect) || 0,
      chemMcqWrong: Number(values.chemMcqWrong) || 0,
      chemNumCorrect: Number(values.chemNumCorrect) || 0,
      chemNumWrong: Number(values.chemNumWrong) || 0,
      mathMcqCorrect: Number(values.mathMcqCorrect) || 0,
      mathMcqWrong: Number(values.mathMcqWrong) || 0,
      mathNumCorrect: Number(values.mathNumCorrect) || 0,
      mathNumWrong: Number(values.mathNumWrong) || 0,
    });

    return {
      totalScore: res.totalScore,
      phyScore: res.phyScore,
      chemScore: res.chemScore,
      mathScore: res.mathScore,
      chartData: {
        type: 'stacked',
        labels: ['Subject Score Breakdown'],
        series: [
          { name: 'Physics', color: '#3b82f6', values: [Math.max(0, res.phyScore)] },
          { name: 'Chemistry', color: '#10b981', values: [Math.max(0, res.chemScore)] },
          { name: 'Mathematics', color: '#f59e0b', values: [Math.max(0, res.mathScore)] },
        ],
      },
    };
  },
  table(values) {
    const res = calculateJeeMainScore({
      phyMcqCorrect: Number(values.phyMcqCorrect) || 0,
      phyMcqWrong: Number(values.phyMcqWrong) || 0,
      phyNumCorrect: Number(values.phyNumCorrect) || 0,
      phyNumWrong: Number(values.phyNumWrong) || 0,
      chemMcqCorrect: Number(values.chemMcqCorrect) || 0,
      chemMcqWrong: Number(values.chemMcqWrong) || 0,
      chemNumCorrect: Number(values.chemNumCorrect) || 0,
      chemNumWrong: Number(values.chemNumWrong) || 0,
      mathMcqCorrect: Number(values.mathMcqCorrect) || 0,
      mathMcqWrong: Number(values.mathMcqWrong) || 0,
      mathNumCorrect: Number(values.mathNumCorrect) || 0,
      mathNumWrong: Number(values.mathNumWrong) || 0,
    });

    return {
      columns: [
        { key: 'subject', label: 'Subject', format: 'text' },
        { key: 'score', label: 'Score Obtained', format: 'number' },
        { key: 'maxMarks', label: 'Max Possible', format: 'number' },
      ],
      rows: [
        { subject: 'Physics', score: res.phyScore, maxMarks: 100 },
        { subject: 'Chemistry', score: res.chemScore, maxMarks: 100 },
        { subject: 'Mathematics', score: res.mathScore, maxMarks: 100 },
        { subject: 'Overall Composite', score: res.totalScore, maxMarks: 300 },
      ],
    };
  },
  chart: 'stacked',
};

export default config;
