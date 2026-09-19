import type { ToolConfig } from '../../lib/engine/types';
import examsData from '../../data/exams.json';

export function calculateCatRawScore(params: {
  varcMcqCorrect: number;
  varcMcqWrong: number;
  varcTitaCorrect: number;
  dilrMcqCorrect: number;
  dilrMcqWrong: number;
  dilrTitaCorrect: number;
  qaMcqCorrect: number;
  qaMcqWrong: number;
  qaTitaCorrect: number;
}) {
  const scoring = examsData.cat.scoring; // correct: 3, incorrect_mcq: -1, incorrect_tita: 0

  const varcScore =
    params.varcMcqCorrect * scoring.correct +
    params.varcMcqWrong * scoring.incorrect_mcq +
    params.varcTitaCorrect * scoring.correct;

  const dilrScore =
    params.dilrMcqCorrect * scoring.correct +
    params.dilrMcqWrong * scoring.incorrect_mcq +
    params.dilrTitaCorrect * scoring.correct;

  const qaScore =
    params.qaMcqCorrect * scoring.correct +
    params.qaMcqWrong * scoring.incorrect_mcq +
    params.qaTitaCorrect * scoring.correct;

  const totalRawScore = varcScore + dilrScore + qaScore;
  const maxPossible = examsData.cat.max_marks; // 198

  return {
    varcScore,
    dilrScore,
    qaScore,
    totalRawScore,
    maxPossible,
  };
}

export const config: ToolConfig = {
  id: 'cat-score-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'varcMcqCorrect',
      label: 'VARC: MCQ Correct (+3 marks)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.varc.typical_mcq,
      step: 1,
      default: 14,
    },
    {
      key: 'varcMcqWrong',
      label: 'VARC: MCQ Incorrect (-1 mark)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.varc.typical_mcq,
      step: 1,
      default: 3,
    },
    {
      key: 'varcTitaCorrect',
      label: 'VARC: Non-MCQ / TITA Correct (+3 marks, 0 negative)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.varc.typical_tita,
      step: 1,
      default: 2,
    },
    {
      key: 'dilrMcqCorrect',
      label: 'DILR: MCQ Correct (+3 marks)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.dilr.typical_mcq,
      step: 1,
      default: 10,
    },
    {
      key: 'dilrMcqWrong',
      label: 'DILR: MCQ Incorrect (-1 mark)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.dilr.typical_mcq,
      step: 1,
      default: 2,
    },
    {
      key: 'dilrTitaCorrect',
      label: 'DILR: Non-MCQ / TITA Correct (+3 marks)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.dilr.typical_tita,
      step: 1,
      default: 2,
    },
    {
      key: 'qaMcqCorrect',
      label: 'QA: MCQ Correct (+3 marks)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.qa.typical_mcq,
      step: 1,
      default: 11,
    },
    {
      key: 'qaMcqWrong',
      label: 'QA: MCQ Incorrect (-1 mark)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.qa.typical_mcq,
      step: 1,
      default: 2,
    },
    {
      key: 'qaTitaCorrect',
      label: 'QA: Non-MCQ / TITA Correct (+3 marks)',
      type: 'number',
      min: 0,
      max: examsData.cat.sections.qa.typical_tita,
      step: 1,
      default: 3,
    },
  ],
  outputs: [
    {
      key: 'totalRawScore',
      label: 'Total CAT Raw Score (/198)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'varcScore',
      label: 'VARC Section Score',
      format: 'number',
    },
    {
      key: 'dilrScore',
      label: 'DILR Section Score',
      format: 'number',
    },
    {
      key: 'qaScore',
      label: 'QA Section Score',
      format: 'number',
    },
  ],
  compute(values) {
    const res = calculateCatRawScore({
      varcMcqCorrect: Number(values.varcMcqCorrect) || 0,
      varcMcqWrong: Number(values.varcMcqWrong) || 0,
      varcTitaCorrect: Number(values.varcTitaCorrect) || 0,
      dilrMcqCorrect: Number(values.dilrMcqCorrect) || 0,
      dilrMcqWrong: Number(values.dilrMcqWrong) || 0,
      dilrTitaCorrect: Number(values.dilrTitaCorrect) || 0,
      qaMcqCorrect: Number(values.qaMcqCorrect) || 0,
      qaMcqWrong: Number(values.qaMcqWrong) || 0,
      qaTitaCorrect: Number(values.qaTitaCorrect) || 0,
    });

    return {
      totalRawScore: res.totalRawScore,
      varcScore: res.varcScore,
      dilrScore: res.dilrScore,
      qaScore: res.qaScore,
      chartData: {
        type: 'stacked',
        labels: ['Sectional Contribution'],
        series: [
          { name: 'VARC Score', color: '#3b82f6', values: [Math.max(0, res.varcScore)] },
          { name: 'DILR Score', color: '#10b981', values: [Math.max(0, res.dilrScore)] },
          { name: 'QA Score', color: '#f59e0b', values: [Math.max(0, res.qaScore)] },
        ],
      },
    };
  },
  table(values) {
    const res = calculateCatRawScore({
      varcMcqCorrect: Number(values.varcMcqCorrect) || 0,
      varcMcqWrong: Number(values.varcMcqWrong) || 0,
      varcTitaCorrect: Number(values.varcTitaCorrect) || 0,
      dilrMcqCorrect: Number(values.dilrMcqCorrect) || 0,
      dilrMcqWrong: Number(values.dilrMcqWrong) || 0,
      dilrTitaCorrect: Number(values.dilrTitaCorrect) || 0,
      qaMcqCorrect: Number(values.qaMcqCorrect) || 0,
      qaMcqWrong: Number(values.qaMcqWrong) || 0,
      qaTitaCorrect: Number(values.qaTitaCorrect) || 0,
    });

    return {
      columns: [
        { key: 'section', label: 'Section', format: 'text' },
        { key: 'score', label: 'Raw Score Obtained', format: 'number' },
        { key: 'maxMarks', label: 'Max Marks', format: 'number' },
      ],
      rows: [
        { section: 'VARC (Verbal Ability & Reading Comprehension)', score: res.varcScore, maxMarks: 72 },
        { section: 'DILR (Data Interpretation & Logical Reasoning)', score: res.dilrScore, maxMarks: 60 },
        { section: 'QA (Quantitative Ability)', score: res.qaScore, maxMarks: 66 },
        { section: 'Total CAT Raw Score', score: res.totalRawScore, maxMarks: 198 },
      ],
    };
  },
  chart: 'stacked',
};

export default config;
