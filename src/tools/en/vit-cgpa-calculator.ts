import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export const VIT_GRADE_POINTS: Record<string, number> = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
  N: 0,
};

export interface CourseEntry {
  courseName: string;
  credits: number;
  grade: string;
}

export function calculateVitGpa(courses: CourseEntry[], prevCredits = 0, prevCgpa = 0) {
  let semCreditPoints = 0;
  let semCredits = 0;

  for (const c of courses) {
    const cr = Number(c.credits) || 0;
    const gradeKey = String(c.grade || 'A').toUpperCase().trim();
    const gp = VIT_GRADE_POINTS[gradeKey] ?? 0;

    semCreditPoints += cr * gp;
    semCredits += cr;
  }

  const semesterGpa =
    semCredits > 0 ? roundHalfAwayFromZero(semCreditPoints / semCredits, 2) : 0;

  const totalCredits = prevCredits + semCredits;
  const totalPoints = prevCredits * prevCgpa + semCreditPoints;
  const cumulativeCgpa =
    totalCredits > 0 ? roundHalfAwayFromZero(totalPoints / totalCredits, 2) : semesterGpa;

  return {
    semCredits,
    semesterGpa,
    totalCredits,
    cumulativeCgpa,
  };
}

export const config: ToolConfig = {
  id: 'vit-cgpa-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'courses',
      label: 'Semester Courses (Credits & Letter Grade)',
      type: 'rows',
      default: [
        { courseName: 'Engineering Calculus', credits: 4, grade: 'S' },
        { courseName: 'Data Structures & Algorithms', credits: 4, grade: 'A' },
        { courseName: 'Digital Logic Design', credits: 3, grade: 'B' },
        { courseName: 'Computer Architecture', credits: 3, grade: 'A' },
        { courseName: 'Technical Communication', credits: 2, grade: 'S' },
      ],
      options: [
        { label: 'Course Code / Name', value: 'courseName' },
        { label: 'Course Credits (1 to 5)', value: 'credits' },
        { label: 'VIT Grade (S, A, B, C, D, E, F)', value: 'grade' },
      ],
      help: 'Grades per VIT academic regulations: S=10, A=9, B=8, C=7, D=6, E=5, F/N=0',
    },
    {
      key: 'previousCredits',
      label: 'Cumulative Credits Completed (Before this Semester)',
      type: 'number',
      min: 0,
      max: 200,
      step: 1,
      default: 40,
      help: 'Leave as 0 if you are calculating for Semester 1',
    },
    {
      key: 'previousCgpa',
      label: 'Previous Cumulative CGPA',
      type: 'number',
      min: 0,
      max: 10,
      step: 0.01,
      default: 8.85,
      help: 'Your existing CGPA up to the previous semester',
    },
  ],
  outputs: [
    {
      key: 'semesterGpa',
      label: 'Semester GPA (SGPA)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'cumulativeCgpa',
      label: 'Updated Cumulative CGPA',
      format: 'number',
      highlight: true,
    },
    {
      key: 'semCredits',
      label: 'Credits Registered this Semester',
      format: 'number',
    },
    {
      key: 'totalCredits',
      label: 'Total Accumulated Credits',
      format: 'number',
    },
  ],
  compute(values) {
    let courses: CourseEntry[] = [];
    if (Array.isArray(values.courses)) {
      courses = values.courses.map((c: any) => ({
        courseName: String(c.courseName || 'Course'),
        credits: Number(c.credits) || 3,
        grade: String(c.grade || 'A').toUpperCase(),
      }));
    }

    if (courses.length === 0) {
      courses = [
        { courseName: 'Course 1', credits: 4, grade: 'S' },
        { courseName: 'Course 2', credits: 4, grade: 'A' },
      ];
    }

    const prevCredits = Number(values.previousCredits) || 0;
    const prevCgpa = Number(values.previousCgpa) || 0;

    const res = calculateVitGpa(courses, prevCredits, prevCgpa);

    return {
      semesterGpa: res.semesterGpa,
      cumulativeCgpa: res.cumulativeCgpa,
      semCredits: res.semCredits,
      totalCredits: res.totalCredits,
    };
  },
  table(values) {
    let courses: CourseEntry[] = [];
    if (Array.isArray(values.courses)) {
      courses = values.courses.map((c: any) => ({
        courseName: String(c.courseName || 'Course'),
        credits: Number(c.credits) || 3,
        grade: String(c.grade || 'A').toUpperCase(),
      }));
    }
    if (courses.length === 0) {
      courses = [{ courseName: 'Course 1', credits: 4, grade: 'S' }];
    }

    return {
      columns: [
        { key: 'courseName', label: 'Course', format: 'text' },
        { key: 'credits', label: 'Credits', format: 'number' },
        { key: 'grade', label: 'VIT Grade', format: 'text' },
        { key: 'gp', label: 'Grade Points', format: 'number' },
        { key: 'pts', label: 'Credit Points', format: 'number' },
      ],
      rows: courses.map((c) => {
        const gp = VIT_GRADE_POINTS[c.grade] ?? 0;
        return {
          courseName: c.courseName,
          credits: c.credits,
          grade: c.grade,
          gp,
          pts: c.credits * gp,
        };
      }),
    };
  },
};

export default config;
