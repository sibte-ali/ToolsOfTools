import type { ToolConfig } from '../../lib/engine/types';
import { convertTimezone, type ConvertedTimeResult } from '../../lib/dates';

export interface EstToIstInput {
  date: string;
  time: string;
  direction: 'est_to_ist' | 'ist_to_est';
}

export function calculateEstToIst(input: EstToIstInput): ConvertedTimeResult {
  const dateStr = input.date || '2024-03-15';
  const timeStr = input.time || '10:00';
  const isEstToIst = input.direction !== 'ist_to_est';

  const fromZone = isEstToIst ? 'America/New_York' : 'Asia/Kolkata';
  const toZone = isEstToIst ? 'Asia/Kolkata' : 'America/New_York';

  return convertTimezone(dateStr, timeStr, fromZone, toZone);
}

export const estToIstConfig: ToolConfig = {
  id: 'est-to-ist',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'date',
      label: 'Select Date (observes EST/EDT daylight changes)',
      type: 'date',
      default: '2024-03-15',
      help: 'Dates between second Sunday in March and first Sunday in November use EDT (UTC-4); others use EST (UTC-5).',
    },
    {
      key: 'time',
      label: 'Enter Time (HH:MM)',
      type: 'text',
      default: '10:00',
      help: '24-hour or standard morning/evening format (e.g. 10:00 or 14:30)',
    },
    {
      key: 'direction',
      label: 'Conversion Direction',
      type: 'select',
      default: 'est_to_ist',
      options: [
        { label: 'Eastern Time (EST/EDT) -> India Standard Time (IST)', value: 'est_to_ist' },
        { label: 'India Standard Time (IST) -> Eastern Time (EST/EDT)', value: 'ist_to_est' },
      ],
    },
  ],
  compute: (values) => {
    const res = calculateEstToIst({
      date: String(values.date || '2024-03-15'),
      time: String(values.time || '10:00'),
      direction: values.direction as any,
    });

    const dstNotice = res.isSourceDst || res.isTargetDst
      ? 'Daylight Saving Active (EDT: UTC-4, 9.5 hours behind IST)'
      : 'Standard Time Active (EST: UTC-5, 10.5 hours behind IST)';

    return {
      targetTime: res.targetTime,
      targetDate: res.targetDate,
      timeDifference: `${Math.abs(res.differenceHours)} hours ${res.differenceHours >= 0 ? 'ahead' : 'behind'}`,
      sourceZoneInfo: `${res.sourceZone} (${res.sourceOffset})`,
      targetZoneInfo: `${res.targetZone} (${res.targetOffset})`,
      dstStatus: dstNotice,
    };
  },
  outputs: [
    { key: 'targetTime', label: 'Converted Time', format: 'text', highlight: true },
    { key: 'targetDate', label: 'Converted Date', format: 'text' },
    { key: 'timeDifference', label: 'Time Offset Difference', format: 'text' },
    { key: 'dstStatus', label: 'DST Status (EST vs EDT)', format: 'text' },
    { key: 'sourceZoneInfo', label: 'Source Timezone & Offset', format: 'text' },
    { key: 'targetZoneInfo', label: 'Target Timezone & Offset', format: 'text' },
  ],
  table: (values) => {
    const res = calculateEstToIst({
      date: String(values.date || '2024-03-15'),
      time: String(values.time || '10:00'),
      direction: values.direction as any,
    });

    const isEstToIst = values.direction !== 'ist_to_est';
    const sHeader = isEstToIst ? 'US Eastern Time' : 'India Time (IST)';
    const tHeader = isEstToIst ? 'India Time (IST)' : 'US Eastern Time';

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
