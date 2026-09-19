import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export interface GradeComponent {
  name: string;
  weightPct: number;
  scorePct: number;
}

export function calculateWeightedExamGrade(
  components: GradeComponent[],
  targetGradePct = 85
) {
  let currentWeightedSum = 0;
  let totalCompletedWeight = 0;

  for (const c of components) {
    const w = Number(c.weightPct) || 0;
    const s = Number(c.scorePct) || 0;
    currentWeightedSum += (s * w) / 100;
    totalCompletedWeight += w;
  }

  const currentAverage =
    totalCompletedWeight > 0
      ? roundHalfAwayFromZero((currentWeightedSum / totalCompletedWeight) * 100, 2)
      : 0;

  // Required score on remaining component to reach targetGradePct
  // currentWeightedSum + (requiredScore * remainingWeight / 100) = targetGradePct
  const remainingWeight = Math.max(0, 100 - totalCompletedWeight);
  let requiredScore = 0;
  let feasibilityStatus = '';

  if (remainingWeight <= 0) {
    feasibilityStatus =
      currentWeightedSum >= targetGradePct
        ? 'Target achieved with completed coursework!'
        : 'All coursework completed; target grade was not reached.';
    requiredScore = 0;
  } else {
    const deficit = targetGradePct - currentWeightedSum;
    requiredScore = roundHalfAwayFromZero((deficit / remainingWeight) * 100, 2);

    if (requiredScore <= 0) {
      feasibilityStatus = 'Target already secured! Even a 0% on the remaining component meets your goal.';
    } else if (requiredScore > 100) {
      feasibilityStatus = `Target unreachable: Requires ${requiredScore}% on the remaining exam (above 100%).`;
    } else {
      feasibilityStatus = `You need at least ${requiredScore}% on the remaining ${remainingWeight}% coursework to achieve ${targetGradePct}%.`;
    }
  }

  return {
    currentWeightedSum: roundHalfAwayFromZero(currentWeightedSum, 2),
    currentAverage,
    totalCompletedWeight,
    remainingWeight,
    requiredScore: Math.max(0, requiredScore),
    feasibilityStatus,
  };
}

export const config: ToolConfig = {
  id: 'mark-calculator-exam',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'components',
      label: 'Completed Assessment Components (Weight % & Score %)',
      type: 'rows',
      default: [
        { name: 'Homework & Assignments', weightPct: 20, scorePct: 90 },
        { name: 'Midterm Exam 1', weightPct: 25, scorePct: 82 },
        { name: 'Midterm Exam 2', weightPct: 25, scorePct: 78 },
      ],
      options: [
        { label: 'Assessment Name', value: 'name' },
        { label: 'Weight (%)', value: 'weightPct' },
        { label: 'Your Score (%)', value: 'scorePct' },
      ],
      help: 'Add components with their syllabus percentage weights and your scored percentages',
    },
    {
      key: 'targetGrade',
      label: 'Desired Target Final Grade (%)',
      type: 'number',
      min: 1,
      max: 100,
      step: 1,
      default: 85,
      unit: '%',
      help: 'The overall grade percentage you aim to achieve in this course (e.g., 85% for an A)',
    },
  ],
  outputs: [
    {
      key: 'requiredScore',
      label: 'Required Score on Remaining Exam',
      format: 'percent',
      highlight: true,
    },
    {
      key: 'currentWeightedScore',
      label: 'Current Accumulated Grade Points',
      format: 'percent',
    },
    {
      key: 'remainingWeight',
      label: 'Remaining Coursework Weight',
      format: 'percent',
    },
    {
      key: 'statusMessage',
      label: 'Goal Feasibility',
      format: 'text',
    },
  ],
  compute(values) {
    let list: GradeComponent[] = [];
    if (Array.isArray(values.components)) {
      list = values.components.map((c: any) => ({
        name: String(c.name || 'Assessment'),
        weightPct: Number(c.weightPct) || 0,
        scorePct: Number(c.scorePct) || 0,
      }));
    }

    if (list.length === 0) {
      list = [{ name: 'Midterm', weightPct: 50, scorePct: 80 }];
    }

    const targetGrade = Number(values.targetGrade) || 85;

    const res = calculateWeightedExamGrade(list, targetGrade);

    return {
      requiredScore: res.requiredScore,
      currentWeightedScore: res.currentWeightedSum,
      remainingWeight: res.remainingWeight,
      statusMessage: res.feasibilityStatus,
      chartData: {
        type: 'stacked',
        labels: ['Grade Composition'],
        series: [
          { name: 'Completed Weighted Points', color: '#10b981', values: [res.currentWeightedSum] },
          { name: 'Points Still Needed', color: '#f59e0b', values: [Math.max(0, targetGrade - res.currentWeightedSum)] },
        ],
      },
    };
  },
  table(values) {
    let list: GradeComponent[] = [];
    if (Array.isArray(values.components)) {
      list = values.components.map((c: any) => ({
        name: String(c.name || 'Assessment'),
        weightPct: Number(c.weightPct) || 0,
        scorePct: Number(c.scorePct) || 0,
      }));
    }
    if (list.length === 0) {
      list = [{ name: 'Midterm', weightPct: 50, scorePct: 80 }];
    }

    return {
      columns: [
        { key: 'name', label: 'Component', format: 'text' },
        { key: 'weight', label: 'Syllabus Weight', format: 'percent' },
        { key: 'score', label: 'Your Score', format: 'percent' },
        { key: 'contrib', label: 'Weighted Contribution', format: 'percent' },
      ],
      rows: list.map((c) => ({
        name: c.name,
        weight: c.weightPct,
        score: c.scorePct,
        contrib: roundHalfAwayFromZero((c.weightPct * c.scorePct) / 100, 2),
      })),
    };
  },
  chart: 'stacked',
};

export default config;
