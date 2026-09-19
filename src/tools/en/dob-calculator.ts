import type { ToolConfig } from '../../lib/engine/types';
import {
  calendarDiff,
  daysBetween,
  getWeekdayInfo,
  parseDateParts,
  daysInMonth,
} from '../../lib/dates';

export interface DobCalcInput {
  dob: string;
  asOfDate?: string;
}

export function calculateDob(input: DobCalcInput) {
  const birthStr = input.dob || '2000-01-01';
  const targetStr = input.asOfDate || '2024-06-01';

  const diff = calendarDiff(birthStr, targetStr);
  const weekdayBirth = getWeekdayInfo(birthStr, 'en');

  // Next birthday calculation relative to target date
  const birthParts = parseDateParts(birthStr);
  const targetParts = parseDateParts(targetStr);

  let nextBdayYear = targetParts.year;
  const isFeb29 = birthParts.month === 2 && birthParts.day === 29;

  const getBdayDate = (y: number) => {
    const d = isFeb29 ? Math.min(29, daysInMonth(y, 2)) : birthParts.day;
    return `${y}-${String(birthParts.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  let nextBdayStr = getBdayDate(nextBdayYear);
  if (nextBdayStr < targetStr) {
    nextBdayYear += 1;
    nextBdayStr = getBdayDate(nextBdayYear);
  }

  const daysToNextBirthday = Math.max(0, daysBetween(targetStr, nextBdayStr));
  const nextBdayWeekday = getWeekdayInfo(nextBdayStr, 'en');

  return {
    years: Math.max(0, diff.years),
    months: Math.max(0, diff.months),
    days: Math.max(0, diff.days),
    totalDays: Math.max(0, diff.totalDays),
    totalWeeks: Math.max(0, diff.totalWeeks),
    totalMonths: Math.max(0, diff.totalMonths),
    totalHours: Math.max(0, diff.totalHours),
    dayOfWeekBorn: weekdayBirth.name,
    nextBirthdayDays: daysToNextBirthday,
    nextBirthdayWeekday: nextBdayWeekday.name,
    nextBirthdayDate: nextBdayStr,
  };
}

export const dobCalculatorConfig: ToolConfig = {
  id: 'dob-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'dob',
      label: 'Date of Birth (DOB)',
      type: 'date',
      default: '2000-01-01',
      help: 'Select your birth date',
    },
    {
      key: 'asOfDate',
      label: 'Calculate Age As Of Date',
      type: 'date',
      default: '2024-06-01',
      help: 'Default is current period; change to calculate age at any specific point in time.',
    },
  ],
  compute: (values) => {
    const res = calculateDob({
      dob: String(values.dob || '2000-01-01'),
      asOfDate: String(values.asOfDate || '2024-06-01'),
    });

    return {
      ageExact: `${res.years} years, ${res.months} months, ${res.days} days`,
      dayBorn: `Born on a ${res.dayOfWeekBorn}`,
      nextBirthday: `${res.nextBirthdayDays} days left (${res.nextBirthdayWeekday}, ${res.nextBirthdayDate})`,
      totalDaysLived: res.totalDays,
      totalWeeksLived: res.totalWeeks,
      totalMonthsLived: res.totalMonths,
      totalHoursLived: res.totalHours,
    };
  },
  outputs: [
    { key: 'ageExact', label: 'Current Age', format: 'text', highlight: true },
    { key: 'nextBirthday', label: 'Countdown to Next Birthday', format: 'text' },
    { key: 'dayBorn', label: 'Day of Week of Birth', format: 'text' },
    { key: 'totalDaysLived', label: 'Total Days Lived', format: 'number' },
    { key: 'totalWeeksLived', label: 'Total Weeks Lived', format: 'number' },
    { key: 'totalMonthsLived', label: 'Total Months Lived', format: 'number' },
    { key: 'totalHoursLived', label: 'Total Hours Lived', format: 'number' },
  ],
};
