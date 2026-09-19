import type { ToolConfig } from '../../lib/engine/types';
import {
  daysBetween,
  businessDaysBetween,
  addPeriod,
  calendarDiff,
  getWeekdayInfo,
} from '../../lib/dates';

export interface DayCalcInput {
  mode: 'diff' | 'add_sub' | 'weekday';
  startDate: string;
  endDate?: string;
  countType?: 'calendar' | 'business';
  inclusive?: 'yes' | 'no';
  op?: 'add' | 'sub';
  addDays?: number;
  addWeeks?: number;
  addMonths?: number;
  addYears?: number;
}

export function calculateDayCalculator(input: DayCalcInput) {
  const start = input.startDate || '2024-01-01';
  const end = input.endDate || '2024-12-31';
  const isInclusive = input.inclusive === 'yes';

  if (input.mode === 'weekday') {
    const info = getWeekdayInfo(start, 'en');
    return {
      mode: 'weekday',
      resultMain: info.name,
      resultSecondary: `Day index: ${info.index} (0=Sunday, 6=Saturday)`,
      detailCalendarDays: 0,
      detailBusinessDays: 0,
      detailBreakdown: `Calculated for UTC date ${start}`,
    };
  }

  if (input.mode === 'add_sub') {
    const sign = input.op === 'sub' ? -1 : 1;
    const targetDate = addPeriod(start, {
      days: (input.addDays || 0) * sign,
      weeks: (input.addWeeks || 0) * sign,
      months: (input.addMonths || 0) * sign,
      years: (input.addYears || 0) * sign,
    });
    const weekday = getWeekdayInfo(targetDate, 'en');

    return {
      mode: 'add_sub',
      resultMain: targetDate,
      resultSecondary: `Falls on a ${weekday.name}`,
      detailCalendarDays: Math.abs(daysBetween(start, targetDate)),
      detailBusinessDays: Math.abs(businessDaysBetween(start, targetDate)),
      detailBreakdown: `${input.op === 'sub' ? 'Subtracted' : 'Added'} period from ${start}`,
    };
  }

  // Default: diff between two dates
  const totalDays = daysBetween(start, end, isInclusive);
  const bizDays = businessDaysBetween(start, end, isInclusive);
  const diff = calendarDiff(start, end);

  return {
    mode: 'diff',
    resultMain: `${Math.abs(totalDays)} calendar days`,
    resultSecondary: `${Math.abs(bizDays)} business days (Mon-Fri)`,
    detailCalendarDays: Math.abs(totalDays),
    detailBusinessDays: Math.abs(bizDays),
    detailBreakdown: `${Math.abs(diff.years)} years, ${Math.abs(diff.months)} months, ${Math.abs(diff.days)} days`,
  };
}

export const dayCalculatorConfig: ToolConfig = {
  id: 'day-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'mode',
      label: 'Calculator Mode',
      type: 'select',
      default: 'diff',
      options: [
        { label: 'Count Days Between Two Dates', value: 'diff' },
        { label: 'Add or Subtract Days / Weeks / Months', value: 'add_sub' },
        { label: 'Find Day of the Week', value: 'weekday' },
      ],
    },
    {
      key: 'startDate',
      label: 'Start Date (or Primary Date)',
      type: 'date',
      default: '2024-01-01',
    },
    {
      key: 'endDate',
      label: 'End Date (for date difference)',
      type: 'date',
      default: '2024-12-31',
    },
    {
      key: 'inclusive',
      label: 'Include End Date in Count?',
      type: 'select',
      default: 'no',
      options: [
        { label: 'Exclusive (default)', value: 'no' },
        { label: 'Inclusive (count both boundary days)', value: 'yes' },
      ],
    },
    {
      key: 'op',
      label: 'Operation (for Add/Subtract mode)',
      type: 'select',
      default: 'add',
      options: [
        { label: 'Add to Start Date (+)', value: 'add' },
        { label: 'Subtract from Start Date (-)', value: 'sub' },
      ],
    },
    {
      key: 'addDays',
      label: 'Days to Add/Subtract',
      type: 'number',
      min: 0,
      max: 100000,
      default: 30,
    },
    {
      key: 'addWeeks',
      label: 'Weeks to Add/Subtract',
      type: 'number',
      min: 0,
      max: 10000,
      default: 0,
    },
    {
      key: 'addMonths',
      label: 'Months to Add/Subtract',
      type: 'number',
      min: 0,
      max: 1200,
      default: 0,
    },
  ],
  compute: (values) => {
    const res = calculateDayCalculator({
      mode: values.mode as any,
      startDate: String(values.startDate || '2024-01-01'),
      endDate: String(values.endDate || '2024-12-31'),
      inclusive: values.inclusive as any,
      op: values.op as any,
      addDays: Number(values.addDays || 0),
      addWeeks: Number(values.addWeeks || 0),
      addMonths: Number(values.addMonths || 0),
    });

    return {
      resultMain: res.resultMain,
      resultSecondary: res.resultSecondary,
      detailBreakdown: res.detailBreakdown,
      calendarDays: res.detailCalendarDays,
      businessDays: res.detailBusinessDays,
    };
  },
  outputs: [
    { key: 'resultMain', label: 'Primary Result', format: 'text', highlight: true },
    { key: 'resultSecondary', label: 'Secondary Result', format: 'text' },
    { key: 'detailBreakdown', label: 'Detailed Breakdown', format: 'text' },
    { key: 'calendarDays', label: 'Total Calendar Days', format: 'number' },
    { key: 'businessDays', label: 'Total Business Days', format: 'number' },
  ],
};
