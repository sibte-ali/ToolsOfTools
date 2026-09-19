import type { ToolConfig } from '../../lib/engine/types';
import { convertTimezone, type ConvertedTimeResult } from '../../lib/dates';

export interface CstToIstInput {
  date: string;
  time: string;
  direction: 'cst_to_ist' | 'ist_to_cst';
}

export function calculateCstToIst(input: CstToIstInput): ConvertedTimeResult {
  const dateStr = input.date || '2024-03-15';
  const timeStr = input.time || '10:00';
  const isCstToIst = input.direction !== 'ist_to_cst';

  const fromZone = isCstToIst ? 'America/Chicago' : 'Asia/Kolkata';
  const toZone = isCstToIst ? 'Asia/Kolkata' : 'America/Chicago';

  return convertTimezone(dateStr, timeStr, fromZone, toZone);
}

export const cstToIstConfig: ToolConfig = {
  id: 'cst-to-ist-converter',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'date',
      label: 'Select Date (observes CST/CDT daylight changes)',
      type: 'date',
      default: '2024-03-15',
      help: 'Dates between second Sunday in March and first Sunday in November use CDT (UTC-5); others use CST (UTC-6).',
    },
    {
      key: 'time',
      label: 'Enter Time (HH:MM)',
      type: 'text',
      default: '10:00',
      help: '24-hour time format (e.g. 10:00 or 15:30)',
    },
    {
      key: 'direction',
      label: 'Conversion Direction',
      type: 'select',
      default: 'cst_to_ist',
      options: [
        { label: 'Central Time (CST/CDT) -> India Standard Time (IST)', value: 'cst_to_ist' },
        { label: 'India Standard Time (IST) -> Central Time (CST/CDT)', value: 'ist_to_cst' },
      ],
    },
  ],
  compute: (values) => {
    const res = calculateCstToIst({
      date: String(values.date || '2024-03-15'),
      time: String(values.time || '10:00'),
      direction: values.direction as any,
    });

    const dstNotice = res.isSourceDst || res.isTargetDst
      ? 'Daylight Saving Active (CDT: UTC-5, 10.5 hours behind IST)'
      : 'Standard Time Active (CST: UTC-6, 11.5 hours behind IST)';

    return {
      targetTime: res.targetTime,
      targetDate: res.targetDate,
      timeDifference: `${Math.abs(res.differenceHours)} hours ${res.differenceHours >= 0 ? 'ahead' : 'behind'}`,
      dstStatus: dstNotice,
      sourceZoneInfo: `${res.sourceZone} (${res.sourceOffset})`,
      targetZoneInfo: `${res.targetZone} (${res.targetOffset})`,
    };
  },
  outputs: [
    { key: 'targetTime', label: 'Converted Time', format: 'text', highlight: true },
    { key: 'targetDate', label: 'Converted Date', format: 'text' },
    { key: 'timeDifference', label: 'Time Offset Difference', format: 'text' },
    { key: 'dstStatus', label: 'DST Status (CST vs CDT)', format: 'text' },
    { key: 'sourceZoneInfo', label: 'Source Timezone & Offset', format: 'text' },
    { key: 'targetZoneInfo', label: 'Target Timezone & Offset', format: 'text' },
  ],
  table: (values) => {
    const res = calculateCstToIst({
      date: String(values.date || '2024-03-15'),
      time: String(values.time || '10:00'),
      direction: values.direction as any,
    });

    const isCstToIst = values.direction !== 'ist_to_cst';
    const sHeader = isCstToIst ? 'US Central Time' : 'India Time (IST)';
    const tHeader = isCstToIst ? 'India Time (IST)' : 'US Central Time';

    return {
      columns: [
        { key: 'source', label: sHeader },
        { key: 'target', label: tHeader },
        { key: 'dayOffset', label: 'Day Offset' },
      ],
      rows: res.hourlyTable.map((row) => ({
        source: row.sourceHour,
        target: row.targetHour,
        dayOffset: row.targetDayOffset,
      })),
    };
  },
};
