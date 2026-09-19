import type { ToolConfig } from '../../lib/engine/types';
import { convertTimezone, type ConvertedTimeResult } from '../../lib/dates';

export interface GmtToIstInput {
  time: string;
}

export function calculate10amGmtToIst(input: GmtToIstInput): ConvertedTimeResult {
  const timeStr = input.time || '10:00';
  // Fixed reference date as GMT/UTC is fixed at +00:00 year-round
  return convertTimezone('2024-01-15', timeStr, 'UTC', 'Asia/Kolkata');
}

export const tenAmGmtToIstConfig: ToolConfig = {
  id: '10am-gmt-to-ist',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'time',
      label: 'Enter GMT / UTC Time (HH:MM)',
      type: 'text',
      default: '10:00',
      help: 'Standard Greenwich Mean Time (UTC+0). Default is 10:00 AM.',
    },
  ],
  compute: (values) => {
    const res = calculate10amGmtToIst({
      time: String(values.time || '10:00'),
    });

    return {
      convertedIstTime: res.targetTime,
      offsetInfo: 'IST is always exactly 5 hours and 30 minutes ahead of GMT/UTC',
      gmtZone: 'Greenwich Mean Time (UTC+00:00)',
      istZone: 'India Standard Time (UTC+05:30)',
      bstWarning: 'Note: The UK observes British Summer Time (BST, UTC+1) in summer. GMT itself never changes.',
    };
  },
  outputs: [
    { key: 'convertedIstTime', label: 'Equivalent India Standard Time (IST)', format: 'text', highlight: true },
    { key: 'offsetInfo', label: 'Time Offset Difference', format: 'text' },
    { key: 'gmtZone', label: 'GMT Zone Definition', format: 'text' },
    { key: 'istZone', label: 'IST Zone Definition', format: 'text' },
    { key: 'bstWarning', label: 'GMT vs UK BST Notice', format: 'text' },
  ],
  table: (values) => {
    const res = calculate10amGmtToIst({
      time: String(values.time || '10:00'),
    });

    return {
      columns: [
        { key: 'gmt', label: 'Greenwich Mean Time (GMT)' },
        { key: 'ist', label: 'India Standard Time (IST)' },
        { key: 'period', label: 'Relative Period' },
      ],
      rows: res.hourlyTable.map((row) => ({
        gmt: row.sourceHour,
        ist: row.targetHour,
        period: parseInt(row.targetHour.split(':')[0], 10) >= 18 ? 'Evening / Night' : 'Morning / Afternoon',
      })),
    };
  },
};
