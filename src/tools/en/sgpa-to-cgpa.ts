import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export interface SemesterEntry {
  semesterName: string;
  sgpa: number;
  credits?: number;
}

export function calculateSgpaToCgpa(semesters: SemesterEntry[]) {
  let totalWeightedScore = 0;
  let totalCredits = 0;
  let hasCredits = false;

  for (const s of semesters) {
    const cr = Number(s.credits) || 0;
    if (cr > 0) hasCredits = true;
  }

  const rowsWithProgress: {
    semesterName: string;
    sgpa: number;
    credits: number;
    weightedPoints: number;
    cumulativeCgpa: number;
  }[] = [];

  let runningPoints = 0;
  let runningCredits = 0;

  for (let i = 0; i < semesters.length; i++) {
    const s = semesters[i];
    const sgpa = Number(s.sgpa) || 0;
    const credits = hasCredits ? (Number(s.credits) || 20) : 1;

    const weighted = sgpa * credits;
    runningPoints += weighted;
    runningCredits += credits;
    totalWeightedScore += weighted;
    totalCredits += credits;

    const cumulativeCgpa =
      runningCredits > 0 ? roundHalfAwayFromZero(runningPoints / runningCredits, 2) : 0;

    rowsWithProgress.push({
      semesterName: s.semesterName || `Semester ${i + 1}`,
      sgpa,
      credits: hasCredits ? credits : 0,
      weightedPoints: roundHalfAwayFromZero(weighted, 2),
      cumulativeCgpa,
    });
  }

  const finalCgpa =
    totalCredits > 0 ? roundHalfAwayFromZero(totalWeightedScore / totalCredits, 2) : 0;
  const percentageApprox = roundHalfAwayFromZero(finalCgpa * 9.5, 2);

  return {
    finalCgpa,
    totalCredits: hasCredits ? totalCredits : semesters.length,
    percentageApprox,
    rowsWithProgress,
    hasCredits,
  };
}

export const config: ToolConfig = {
  id: 'sgpa-to-cgpa',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'semesters',
      label: 'Semester Scores (Add / Remove Semesters)',
      type: 'rows',
      default: [
        { semesterName: 'Semester 1', sgpa: 8.2, credits: 21 },
        { semesterName: 'Semester 2', sgpa: 8.5, credits: 22 },
        { semesterName: 'Semester 3', sgpa: 7.9, credits: 24 },
        { semesterName: 'Semester 4', sgpa: 8.8, credits: 23 },
      ],
      options: [
        { label: 'Semester Name', value: 'semesterName' },
        { label: 'SGPA (0.0 to 10.0)', value: 'sgpa' },
        { label: 'Credits (optional, default equal weight)', value: 'credits' },
      ],
      help: 'If your college credits differ per semester, enter credits for exact weighted CGPA',
    },
  ],
  outputs: [
    {
      key: 'finalCgpa',
      label: 'Cumulative CGPA (Overall)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'percentageApprox',
      label: 'Equivalent Percentage (CBSE / UGC Std)',
      format: 'percent',
      highlight: true,
    },
    {
      key: 'semestersEvaluated',
      label: 'Semesters Counted',
      format: 'number',
    },
  ],
  compute(values) {
    let list: SemesterEntry[] = [];
    if (Array.isArray(values.semesters)) {
      list = values.semesters.map((s: any, idx: number) => ({
        semesterName: String(s.semesterName || `Semester ${idx + 1}`),
        sgpa: Number(s.sgpa) || 0,
        credits: s.credits !== undefined && s.credits !== '' ? Number(s.credits) : undefined,
      }));
    }

    if (list.length === 0) {
      list = [
        { semesterName: 'Semester 1', sgpa: 8.0, credits: 20 },
        { semesterName: 'Semester 2', sgpa: 8.5, credits: 20 },
      ];
    }

    const res = calculateSgpaToCgpa(list);

    const labels = res.rowsWithProgress.map((r) => r.semesterName);
    const sgpaSeries = res.rowsWithProgress.map((r) => r.sgpa);
    const cgpaSeries = res.rowsWithProgress.map((r) => r.cumulativeCgpa);

    return {
      finalCgpa: res.finalCgpa,
      percentageApprox: res.percentageApprox,
      semestersEvaluated: list.length,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Semester SGPA', color: '#3b82f6', values: sgpaSeries },
          { name: 'Progressive CGPA', color: '#10b981', values: cgpaSeries },
        ],
      },
    };
  },
  table(values) {
    let list: SemesterEntry[] = [];
    if (Array.isArray(values.semesters)) {
      list = values.semesters.map((s: any, idx: number) => ({
        semesterName: String(s.semesterName || `Semester ${idx + 1}`),
        sgpa: Number(s.sgpa) || 0,
        credits: s.credits !== undefined && s.credits !== '' ? Number(s.credits) : undefined,
      }));
    }
    if (list.length === 0) {
      list = [{ semesterName: 'Semester 1', sgpa: 8.0, credits: 20 }];
    }

    const res = calculateSgpaToCgpa(list);

    return {
      columns: [
        { key: 'semesterName', label: 'Semester', format: 'text' },
        { key: 'sgpa', label: 'SGPA', format: 'number' },
        ...(res.hasCredits ? [{ key: 'credits', label: 'Credits', format: 'number' as const }] : []),
        { key: 'cumulativeCgpa', label: 'Progressive CGPA', format: 'number' },
      ],
      rows: res.rowsWithProgress,
    };
  },
  chart: 'line',
};

export default config;
