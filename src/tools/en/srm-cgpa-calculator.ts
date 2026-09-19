import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export const SRM_GRADE_POINTS: Record<string, number> = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  F: 0,
  Ab: 0,
};

export interface SrmCourseEntry {
  course: string;
  credits: number;
  grade: string;
}

export function calculateSrmGpa(courses: SrmCourseEntry[], prevCredits = 0, prevCgpa = 0) {
  let semPoints = 0;
  let semCredits = 0;

  for (const c of courses) {
    const cr = Number(c.credits) || 0;
    const gradeKey = String(c.grade || 'A').toUpperCase().trim();
    const gp = SRM_GRADE_POINTS[gradeKey] ?? 0;

    semPoints += cr * gp;
    semCredits += cr;
  }

  const semesterGpa =
    semCredits > 0 ? roundHalfAwayFromZero(semPoints / semCredits, 2) : 0;

  const totalCredits = prevCredits + semCredits;
  const totalPoints = prevCredits * prevCgpa + semPoints;
  const cumulativeCgpa =
    totalCredits > 0 ? roundHalfAwayFromZero(totalPoints / totalCredits, 2) : semesterGpa;

  // SRMIST conversion rule: Percentage = CGPA * 10
  const percentage = roundHalfAwayFromZero(cumulativeCgpa * 10, 2);

  return {
    semesterGpa,
    cumulativeCgpa,
    semCredits,
    totalCredits,
    percentage,
  };
}

export const config: ToolConfig = {
  id: 'srm-cgpa-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'courses',
      label: 'Semester Registered Courses (Credits & SRM Grade)',
      type: 'rows',
      default: [
        { course: 'Advanced Calculus & Linear Algebra', credits: 4, grade: 'O' },
        { course: 'Data Structures using C++', credits: 4, grade: 'A+' },
        { course: 'Digital Electronics', credits: 3, grade: 'A' },
        { course: 'Database Management Systems', credits: 3, grade: 'B+' },
        { course: 'Soft Skills & Aptitude', credits: 2, grade: 'O' },
      ],
      options: [
        { label: 'Course Title', value: 'course' },
        { label: 'Credits (1 to 5)', value: 'credits' },
        { label: 'Grade (O, A+, A, B+, B, C, F)', value: 'grade' },
      ],
      help: 'Official SRMIST grade scale: O=10, A+=9, A=8, B+=7, B=6, C=5, F/Ab=0',
    },
    {
      key: 'previousCredits',
      label: 'Prior Cumulative Credits Completed',
      type: 'number',
      min: 0,
      max: 200,
      step: 1,
      default: 45,
      help: 'Total credits earned across all earlier semesters (0 for 1st sem)',
    },
    {
      key: 'previousCgpa',
      label: 'Prior Cumulative CGPA',
      type: 'number',
      min: 0,
      max: 10,
      step: 0.01,
      default: 8.7,
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
      label: 'Cumulative CGPA',
      format: 'number',
      highlight: true,
    },
    {
      key: 'percentage',
      label: 'SRM Equivalent Percentage',
      format: 'percent',
    },
    {
      key: 'totalCredits',
      label: 'Total Earned Credits',
      format: 'number',
    },
  ],
  compute(values) {
    let courses: SrmCourseEntry[] = [];
    if (Array.isArray(values.courses)) {
      courses = values.courses.map((c: any) => ({
        course: String(c.course || 'Course'),
        credits: Number(c.credits) || 3,
        grade: String(c.grade || 'A').toUpperCase(),
      }));
    }

    if (courses.length === 0) {
      courses = [
        { course: 'Course 1', credits: 4, grade: 'O' },
        { course: 'Course 2', credits: 4, grade: 'A+' },
      ];
    }

    const prevCredits = Number(values.previousCredits) || 0;
    const prevCgpa = Number(values.previousCgpa) || 0;

    const res = calculateSrmGpa(courses, prevCredits, prevCgpa);

    return {
      semesterGpa: res.semesterGpa,
      cumulativeCgpa: res.cumulativeCgpa,
      percentage: res.percentage,
      totalCredits: res.totalCredits,
    };
  },
  table(values) {
    let courses: SrmCourseEntry[] = [];
    if (Array.isArray(values.courses)) {
      courses = values.courses.map((c: any) => ({
        course: String(c.course || 'Course'),
        credits: Number(c.credits) || 3,
        grade: String(c.grade || 'A').toUpperCase(),
      }));
    }
    if (courses.length === 0) {
      courses = [{ course: 'Course 1', credits: 4, grade: 'O' }];
    }

    return {
      columns: [
        { key: 'course', label: 'Course', format: 'text' },
        { key: 'credits', label: 'Credits', format: 'number' },
        { key: 'grade', label: 'SRM Grade', format: 'text' },
        { key: 'gp', label: 'Grade Points', format: 'number' },
        { key: 'pts', label: 'Credit Points', format: 'number' },
      ],
      rows: courses.map((c) => {
        const gp = SRM_GRADE_POINTS[c.grade] ?? 0;
        return {
          course: c.course,
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
