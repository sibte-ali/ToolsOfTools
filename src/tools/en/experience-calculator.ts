import type { ToolConfig } from '../../lib/engine/types';
import { calculateExperience, type JobExperience } from '../../lib/dates';

export interface ExpCalcInput {
  job1Start: string;
  job1End: string;
  job2Start?: string;
  job2End?: string;
  job3Start?: string;
  job3End?: string;
  deduplicateOverlaps: 'yes' | 'no';
}

export function calculateWorkExperience(input: ExpCalcInput) {
  const jobs: JobExperience[] = [];

  if (input.job1Start) {
    jobs.push({ start: input.job1Start, end: input.job1End || '2024-06-01' });
  }
  if (input.job2Start) {
    jobs.push({ start: input.job2Start, end: input.job2End || '2024-06-01' });
  }
  if (input.job3Start) {
    jobs.push({ start: input.job3Start, end: input.job3End || '2024-06-01' });
  }

  const isDeduplicate = input.deduplicateOverlaps !== 'no';
  return calculateExperience(jobs, isDeduplicate, '2024-06-01');
}

export const experienceCalculatorConfig: ToolConfig = {
  id: 'experience-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'job1Start',
      label: 'Role 1 - Start Date',
      type: 'date',
      default: '2019-01-01',
    },
    {
      key: 'job1End',
      label: 'Role 1 - End Date',
      type: 'date',
      default: '2021-06-30',
      help: 'Leave as end date or select current date',
    },
    {
      key: 'job2Start',
      label: 'Role 2 - Start Date',
      type: 'date',
      default: '2021-07-01',
    },
    {
      key: 'job2End',
      label: 'Role 2 - End Date',
      type: 'date',
      default: '2024-01-15',
    },
    {
      key: 'job3Start',
      label: 'Role 3 - Start Date (Optional)',
      type: 'date',
      default: '',
    },
    {
      key: 'job3End',
      label: 'Role 3 - End Date (Optional)',
      type: 'date',
      default: '',
    },
    {
      key: 'deduplicateOverlaps',
      label: 'Deduplicate Overlapping Dates?',
      type: 'select',
      default: 'yes',
      options: [
        { label: 'Yes - Merge overlapping periods (standard for HR/resumes)', value: 'yes' },
        { label: 'No - Simple cumulative sum across all roles', value: 'no' },
      ],
    },
  ],
  compute: (values) => {
    const res = calculateWorkExperience({
      job1Start: String(values.job1Start || '2019-01-01'),
      job1End: String(values.job1End || '2021-06-30'),
      job2Start: String(values.job2Start || ''),
      job2End: String(values.job2End || ''),
      job3Start: String(values.job3Start || ''),
      job3End: String(values.job3End || ''),
      deduplicateOverlaps: values.deduplicateOverlaps as any,
    });

    const summaryStr = `${res.totalYears} years, ${res.totalMonths} months, ${res.totalDays} days`;

    return {
      totalExperienceFormatted: summaryStr,
      decimalYears: res.overallDecimalYears,
      totalCalendarDays: res.overallTotalDays,
      rolesCalculatedCount: res.jobs.length,
    };
  },
  outputs: [
    { key: 'totalExperienceFormatted', label: 'Total Verified Work Experience', format: 'text', highlight: true },
    { key: 'decimalYears', label: 'Total Experience (Decimal Years)', format: 'number' },
    { key: 'totalCalendarDays', label: 'Total Calendar Days', format: 'number' },
    { key: 'rolesCalculatedCount', label: 'Number of Roles Counted', format: 'number' },
  ],
  table: (values) => {
    const res = calculateWorkExperience({
      job1Start: String(values.job1Start || '2019-01-01'),
      job1End: String(values.job1End || '2021-06-30'),
      job2Start: String(values.job2Start || ''),
      job2End: String(values.job2End || ''),
      job3Start: String(values.job3Start || ''),
      job3End: String(values.job3End || ''),
      deduplicateOverlaps: values.deduplicateOverlaps as any,
    });

    return {
      columns: [
        { key: 'role', label: 'Role #' },
        { key: 'period', label: 'Period (Start - End)' },
        { key: 'duration', label: 'Duration (Y-M-D)' },
        { key: 'totalDays', label: 'Total Days' },
        { key: 'decimalYears', label: 'Decimal Years' },
      ],
      rows: res.jobs.map((j, idx) => ({
        role: `Role ${idx + 1}`,
        period: `${j.start} to ${j.end}`,
        duration: `${j.years}y ${j.months}m ${j.days}d`,
        totalDays: String(j.totalDays),
        decimalYears: j.decimalYears.toFixed(2),
      })),
    };
  },
};
