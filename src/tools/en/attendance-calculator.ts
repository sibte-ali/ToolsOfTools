import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export function calculateAttendance(totalClasses: number, attendedClasses: number, targetPct = 75) {
  if (totalClasses <= 0) {
    return {
      currentPct: 0,
      classesToAttend: 0,
      classesCanMiss: 0,
      statusMessage: 'Please enter total classes held.',
      isTargetMet: false,
    };
  }

  const attended = Math.min(totalClasses, Math.max(0, attendedClasses));
  const currentPct = roundHalfAwayFromZero((attended / totalClasses) * 100, 2);
  const p = targetPct;
  const t = totalClasses;
  const a = attended;

  let classesToAttend = 0;
  let classesCanMiss = 0;
  let statusMessage = '';
  const isTargetMet = currentPct >= p;

  if (isTargetMet) {
    // Classes student can still miss: floor(100*a/p - t)
    classesCanMiss = Math.max(0, Math.floor((100 * a) / p - t));
    statusMessage =
      classesCanMiss > 0
        ? `Target met! You can miss up to ${classesCanMiss} upcoming classes and still maintain ${p}%.`
        : `Target met! However, missing even 1 more class will drop your attendance below ${p}%.`;
  } else {
    // Classes student must attend consecutively: ceil((p*t - 100*a)/(100 - p))
    if (p >= 100) {
      statusMessage = 'A 100% target is mathematically impossible once a class is missed.';
      classesToAttend = 0;
    } else {
      classesToAttend = Math.max(0, Math.ceil((p * t - 100 * a) / (100 - p)));
      statusMessage = `You need to attend the next ${classesToAttend} classes consecutively to reach ${p}%.`;
    }
  }

  return {
    currentPct,
    classesToAttend,
    classesCanMiss,
    statusMessage,
    isTargetMet,
  };
}

export const config: ToolConfig = {
  id: 'attendance-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'totalClasses',
      label: 'Total Classes Held So Far',
      type: 'number',
      min: 1,
      max: 2000,
      step: 1,
      default: 50,
      help: 'Total number of lectures or lab sessions conducted',
    },
    {
      key: 'attendedClasses',
      label: 'Classes You Attended',
      type: 'number',
      min: 0,
      max: 2000,
      step: 1,
      default: 34,
      help: 'Number of classes for which you were marked present',
    },
    {
      key: 'targetPct',
      label: 'Target Attendance Percentage (%)',
      type: 'number',
      min: 1,
      max: 100,
      step: 1,
      default: 75,
      unit: '%',
      help: 'Minimum mandatory college attendance requirement (typically 75% or 80%)',
    },
  ],
  outputs: [
    {
      key: 'currentPct',
      label: 'Current Attendance Rate',
      format: 'percent',
      highlight: true,
    },
    {
      key: 'classesToAttend',
      label: 'Classes Needed to Reach Target',
      format: 'number',
      highlight: true,
    },
    {
      key: 'classesCanMiss',
      label: 'Safe Bunks (Classes You Can Miss)',
      format: 'number',
    },
    {
      key: 'statusMessage',
      label: 'Academic Attendance Status',
      format: 'text',
    },
  ],
  compute(values) {
    const total = Number(values.totalClasses) || 50;
    const attended = Number(values.attendedClasses) || 34;
    const target = Number(values.targetPct) || 75;

    const res = calculateAttendance(total, attended, target);

    return {
      currentPct: res.currentPct,
      classesToAttend: res.classesToAttend,
      classesCanMiss: res.classesCanMiss,
      statusMessage: res.statusMessage,
      chartData: {
        type: 'stacked',
        labels: ['Attendance Overview'],
        series: [
          { name: 'Attended Classes', color: '#10b981', values: [attended] },
          { name: 'Missed Classes', color: '#ef4444', values: [Math.max(0, total - attended)] },
        ],
      },
    };
  },
  chart: 'stacked',
  table(values) {
    const total = Number(values.totalClasses) || 50;
    const attended = Number(values.attendedClasses) || 34;

    const targets = [
      { label: '65% (Medical Condonation)', pct: 65 },
      { label: '75% (Mandatory University Rule)', pct: 75 },
      { label: '80% (Lab / Strict College Norm)', pct: 80 },
      { label: '85% (Academic Honors / Good Standing)', pct: 85 },
      { label: '90% (Star Attendance / Exemption)', pct: 90 },
    ];

    const rows = targets.map((tgt) => {
      const res = calculateAttendance(total, attended, tgt.pct);
      return {
        targetLabel: tgt.label,
        status: res.isTargetMet ? '✓ Met' : '⚠ Below Target',
        classesNeeded: res.isTargetMet ? 0 : res.classesToAttend,
        safeBunks: res.isTargetMet ? res.classesCanMiss : 0,
      };
    });

    return {
      columns: [
        { key: 'targetLabel', label: 'Attendance Target', format: 'text' as const },
        { key: 'status', label: 'Status', format: 'text' as const },
        { key: 'classesNeeded', label: 'Classes to Attend', format: 'number' as const },
        { key: 'safeBunks', label: 'Safe Bunks (Can Miss)', format: 'number' as const },
      ],
      rows,
    };
  },
};

export default config;
