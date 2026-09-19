import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export interface SubjectMark {
  subject: string;
  obtained: number;
  max: number;
}

export function calculateMarksPercentage(subjects: SubjectMark[]) {
  let totalObtained = 0;
  let totalMax = 0;

  for (const s of subjects) {
    const ob = Number(s.obtained) || 0;
    const mx = Number(s.max) || 100;
    totalObtained += ob;
    totalMax += mx;
  }

  const percentage = totalMax > 0 ? roundHalfAwayFromZero((totalObtained / totalMax) * 100, 2) : 0;

  let gradeBand = 'F (Fail)';
  if (percentage >= 90) gradeBand = 'A+ (Outstanding)';
  else if (percentage >= 80) gradeBand = 'A (Excellent)';
  else if (percentage >= 70) gradeBand = 'B+ (Very Good)';
  else if (percentage >= 60) gradeBand = 'B (Good)';
  else if (percentage >= 50) gradeBand = 'C (Average)';
  else if (percentage >= 40) gradeBand = 'P (Pass)';

  return {
    totalObtained,
    totalMax,
    percentage,
    gradeBand,
  };
}

export const config: ToolConfig = {
  id: 'marks-percentage-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'subjects',
      label: 'Subject Marks (Add / Remove Rows)',
      type: 'rows',
      default: [
        { subject: 'English', obtained: 85, max: 100 },
        { subject: 'Mathematics', obtained: 92, max: 100 },
        { subject: 'Science / Physics', obtained: 78, max: 100 },
        { subject: 'Chemistry', obtained: 84, max: 100 },
        { subject: 'Social Studies / Computer', obtained: 89, max: 100 },
      ],
      options: [
        { label: 'Subject Name', value: 'subject' },
        { label: 'Marks Obtained', value: 'obtained' },
        { label: 'Max Marks', value: 'max' },
      ],
      help: 'Enter marks obtained and maximum possible marks for each academic course',
    },
  ],
  outputs: [
    {
      key: 'percentage',
      label: 'Overall Aggregate Percentage',
      format: 'percent',
      highlight: true,
    },
    {
      key: 'gradeBand',
      label: 'Standard Academic Grade Band',
      format: 'text',
      highlight: true,
    },
    {
      key: 'totalScore',
      label: 'Total Marks Obtained',
      format: 'number',
    },
    {
      key: 'totalMax',
      label: 'Total Maximum Possible Marks',
      format: 'number',
    },
  ],
  compute(values) {
    let list: SubjectMark[] = [];
    if (Array.isArray(values.subjects)) {
      list = values.subjects.map((s: any) => ({
        subject: String(s.subject || 'Subject'),
        obtained: Number(s.obtained) || 0,
        max: Number(s.max) || 100,
      }));
    }

    if (list.length === 0) {
      list = [
        { subject: 'Subject 1', obtained: 85, max: 100 },
        { subject: 'Subject 2', obtained: 92, max: 100 },
      ];
    }

    const res = calculateMarksPercentage(list);

    return {
      percentage: res.percentage,
      gradeBand: res.gradeBand,
      totalScore: res.totalObtained,
      totalMax: res.totalMax,
      chartData: {
        type: 'stacked',
        labels: ['Marks Aggregate'],
        series: [
          { name: 'Marks Obtained', color: '#10b981', values: [res.totalObtained] },
          { name: 'Marks Lost', color: '#ef4444', values: [Math.max(0, res.totalMax - res.totalObtained)] },
        ],
      },
    };
  },
  table(values) {
    let list: SubjectMark[] = [];
    if (Array.isArray(values.subjects)) {
      list = values.subjects.map((s: any) => ({
        subject: String(s.subject || 'Subject'),
        obtained: Number(s.obtained) || 0,
        max: Number(s.max) || 100,
      }));
    }
    if (list.length === 0) {
      list = [{ subject: 'Subject 1', obtained: 85, max: 100 }];
    }

    return {
      columns: [
        { key: 'subject', label: 'Subject', format: 'text' },
        { key: 'obtained', label: 'Marks Obtained', format: 'number' },
        { key: 'max', label: 'Maximum Marks', format: 'number' },
        { key: 'pct', label: 'Subject %', format: 'percent' },
      ],
      rows: list.map((s) => ({
        subject: s.subject,
        obtained: s.obtained,
        max: s.max,
        pct: s.max > 0 ? roundHalfAwayFromZero((s.obtained / s.max) * 100, 1) : 0,
      })),
    };
  },
  chart: 'stacked',
};

export default config;
