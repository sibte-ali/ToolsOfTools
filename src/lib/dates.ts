/**
 * Comprehensive UTC Date, Time, and Timezone Utilities.
 * All calendar math is performed in UTC to prevent daylight saving time (DST) off-by-one errors.
 * Timezone conversions use IANA zones via native Intl.DateTimeFormat.
 */

export interface CalendarDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  isNegative: boolean;
}

export interface PeriodAddOptions {
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
}

export interface ConvertedTimeResult {
  sourceDate: string;
  sourceTime: string;
  sourceZone: string;
  sourceOffset: string;
  targetDate: string;
  targetTime: string;
  targetZone: string;
  targetOffset: string;
  differenceHours: number; // target - source in hours
  isSourceDst: boolean;
  isTargetDst: boolean;
  hourlyTable: Array<{
    sourceHour: string;
    targetHour: string;
    targetDayOffset: string; // "+1 day", "same day", "-1 day"
  }>;
}

export interface WorkShift {
  entry: string; // HH:MM
  exit: string;  // HH:MM
  breakMinutes?: number;
}

export interface WorkHoursResult {
  totalMinutes: number;
  totalHhMm: string;
  totalDecimal: number;
  regularMinutes: number;
  regularHhMm: string;
  regularDecimal: number;
  overtimeMinutes: number;
  overtimeHhMm: string;
  overtimeDecimal: number;
}

export interface JobExperience {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD or empty for today
  title?: string;
}

export interface ExperienceResult {
  jobs: Array<{
    start: string;
    end: string;
    years: number;
    months: number;
    days: number;
    totalDays: number;
    decimalYears: number;
  }>;
  totalYears: number;
  totalMonths: number;
  totalDays: number;
  overallTotalDays: number;
  overallDecimalYears: number;
}

export interface ShelfLifeResult {
  manufactureDate: string;
  expiryDate: string;
  daysTotal: number;
  daysRemaining: number;
  percentageUsed: number;
  status: 'fresh' | 'expiring_soon' | 'expired';
  statusLabel: string;
}

/**
 * Checks if a given year is a leap year in the Gregorian calendar.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the number of days in a given month (1-indexed month: 1 = Jan, 12 = Dec).
 */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Parses a YYYY-MM-DD string into UTC year, month (1-12), and day (1-31).
 */
export function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  const clean = dateStr.trim().slice(0, 10);
  const parts = clean.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid ISO date format (expected YYYY-MM-DD): ${dateStr}`);
  }
  return { year: parts[0], month: parts[1], day: parts[2] };
}

/**
 * Creates a UTC Date from a YYYY-MM-DD string with time set to 00:00:00.000Z.
 */
export function parseUtcDate(dateStr: string): Date {
  const { year, month, day } = parseDateParts(dateStr);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Formats a Date object to YYYY-MM-DD UTC string.
 */
export function formatUtcDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates absolute calendar days between two dates.
 * If inclusive is true, counts both boundary days.
 */
export function daysBetween(startStr: string, endStr: string, inclusive = false): number {
  const d1 = parseUtcDate(startStr);
  const d2 = parseUtcDate(endStr);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (inclusive) {
    return diffDays >= 0 ? diffDays + 1 : diffDays - 1;
  }
  return diffDays;
}

/**
 * Counts business days (Monday to Friday) between two dates.
 */
export function businessDaysBetween(startStr: string, endStr: string, inclusive = false): number {
  let d1 = parseUtcDate(startStr);
  let d2 = parseUtcDate(endStr);
  const isReversed = d1.getTime() > d2.getTime();
  if (isReversed) {
    const tmp = d1;
    d1 = d2;
    d2 = tmp;
  }

  let count = 0;
  const curr = new Date(d1.getTime());
  const endLimit = inclusive ? d2.getTime() : d2.getTime() - 86400000;

  while (curr.getTime() <= endLimit) {
    const dayOfWeek = curr.getUTCDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  return isReversed ? -count : count;
}

/**
 * Adds or subtracts years, months, weeks, and days to a UTC date.
 * Handles month-end clipping (e.g. Jan 31 + 1 month = Feb 28 or 29).
 */
export function addPeriod(dateStr: string, options: PeriodAddOptions): string {
  const { year, month, day } = parseDateParts(dateStr);
  const addYears = options.years || 0;
  const addMonths = options.months || 0;
  const addWeeks = options.weeks || 0;
  const addDays = (options.days || 0) + addWeeks * 7;

  let targetYear = year + addYears;
  let targetMonth = month + addMonths;

  // Normalize year and month
  while (targetMonth > 12) {
    targetYear += 1;
    targetMonth -= 12;
  }
  while (targetMonth < 1) {
    targetYear -= 1;
    targetMonth += 12;
  }

  // Clip day to max days in target month
  const maxDays = daysInMonth(targetYear, targetMonth);
  const targetDay = Math.min(day, maxDays);

  // Now apply day offset in UTC
  const intermediate = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay));
  intermediate.setUTCDate(intermediate.getUTCDate() + addDays);

  return formatUtcDate(intermediate);
}

/**
 * Computes exact breakdown of time between two calendar dates in years, months, and days.
 */
export function calendarDiff(startStr: string, endStr: string): CalendarDiffResult {
  const isNegative = startStr > endStr;
  const [sStr, eStr] = isNegative ? [endStr, startStr] : [startStr, endStr];

  const sParts = parseDateParts(sStr);
  const eParts = parseDateParts(eStr);

  let years = eParts.year - sParts.year;
  let months = eParts.month - sParts.month;
  let days = eParts.day - sParts.day;

  if (days < 0) {
    // Borrow days from previous month
    months -= 1;
    let prevMonth = eParts.month - 1;
    let prevYear = eParts.year;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const daysInPrev = daysInMonth(prevYear, prevMonth);
    days += daysInPrev;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const d1 = parseUtcDate(sStr);
  const d2 = parseUtcDate(eStr);
  const totalDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  return {
    years: isNegative ? -years : years,
    months: isNegative ? -months : months,
    days: isNegative ? -days : days,
    totalDays: isNegative ? -totalDays : totalDays,
    totalWeeks: isNegative ? -totalWeeks : totalWeeks,
    totalMonths: isNegative ? -totalMonths : totalMonths,
    totalHours: isNegative ? -totalHours : totalHours,
    isNegative,
  };
}

/**
 * Returns weekday information for a date (0 = Sunday, 1 = Monday, etc.).
 */
export function getWeekdayInfo(dateStr: string, locale = 'en'): { index: number; name: string } {
  const d = parseUtcDate(dateStr);
  const index = d.getUTCDay();
  const name = new Intl.DateTimeFormat(locale === 'pt-br' ? 'pt-BR' : 'en-US', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(d);
  return { index, name };
}

/**
 * Helper to get offset in minutes for an IANA timezone at an exact UTC timestamp.
 */
export function getTimezoneOffset(date: Date, timeZone: string): number {
  // Format the date in target timezone as year, month, day, hour, minute, second
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const find = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0);

  const y = find('year');
  const m = find('month');
  const d = find('day');
  let h = find('hour');
  if (h === 24) h = 0; // standard 24-hr normalization
  const min = find('minute');
  const s = find('second');

  // Local time represented as UTC milliseconds
  const localAsUtc = Date.UTC(y, m - 1, d, h, min, s);
  // Offset in minutes = (localAsUtc - date.getTime()) / 60000
  return Math.round((localAsUtc - date.getTime()) / 60000);
}

/**
 * Formats an offset in minutes to string like "+05:30", "-05:00", "UTC".
 */
export function formatOffsetMinutes(offsetMin: number): string {
  if (offsetMin === 0) return 'UTC (+00:00)';
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${h}:${m}`;
}

/**
 * Checks if Daylight Saving Time (DST) is active for an IANA timezone on a date.
 */
export function isDst(dateStr: string, timeZone: string): boolean {
  const { year } = parseDateParts(dateStr);
  // Compare offset in January (winter in northern hemisphere) vs July (summer in northern hemisphere)
  const dJan = new Date(Date.UTC(year, 0, 15, 12, 0, 0));
  const dJul = new Date(Date.UTC(year, 6, 15, 12, 0, 0));
  const offsetJan = getTimezoneOffset(dJan, timeZone);
  const offsetJul = getTimezoneOffset(dJul, timeZone);

  if (offsetJan === offsetJul) return false; // Zone does not observe DST

  const testDate = parseUtcDate(dateStr);
  testDate.setUTCHours(12);
  const currentOffset = getTimezoneOffset(testDate, timeZone);
  const standardOffset = Math.min(offsetJan, offsetJul);

  return currentOffset > standardOffset;
}

/**
 * Converts a specific date and time from one IANA timezone to another.
 */
export function convertTimezone(
  dateStr: string,
  timeStr: string,
  fromZone: string,
  toZone: string
): ConvertedTimeResult {
  const [hStr, mStr] = (timeStr || '10:00').split(':');
  const inHours = parseInt(hStr || '10', 10);
  const inMinutes = parseInt(mStr || '0', 10);

  // We need to find the exact UTC instant when local time in fromZone is (dateStr, timeStr)
  // Step 1: Guess UTC instant assuming local time was UTC
  const { year, month, day } = parseDateParts(dateStr);
  let guessUtc = new Date(Date.UTC(year, month - 1, day, inHours, inMinutes, 0));

  // Step 2: Refine guess using fromZone offset
  for (let i = 0; i < 3; i++) {
    const offset = getTimezoneOffset(guessUtc, fromZone);
    const targetLocalAsUtc = Date.UTC(year, month - 1, day, inHours, inMinutes, 0);
    const actualLocalAsUtc = guessUtc.getTime() + offset * 60000;
    const diff = targetLocalAsUtc - actualLocalAsUtc;
    if (diff === 0) break;
    guessUtc = new Date(guessUtc.getTime() + diff);
  }

  const sourceOffsetMin = getTimezoneOffset(guessUtc, fromZone);
  const targetOffsetMin = getTimezoneOffset(guessUtc, toZone);

  // Format target date and time
  const targetFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: toZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = targetFormatter.formatToParts(guessUtc);
  const findPart = (t: string) => parts.find((p) => p.type === t)?.value || '';

  const targetDate = `${findPart('year')}-${findPart('month')}-${findPart('day')}`;
  let tHour = findPart('hour');
  if (tHour === '24') tHour = '00';
  const targetTime = `${tHour}:${findPart('minute')}`;

  const diffMinutes = targetOffsetMin - sourceOffsetMin;
  const diffHours = diffMinutes / 60;

  // Build 24-hour comparative table
  const hourlyTable: ConvertedTimeResult['hourlyTable'] = [];
  for (let h = 0; h < 24; h++) {
    const sHourStr = `${String(h).padStart(2, '0')}:00`;
    // compute target hour
    const gUtc = new Date(Date.UTC(year, month - 1, day, h, 0, 0) - sourceOffsetMin * 60000);
    const tParts = targetFormatter.formatToParts(gUtc);
    const getTP = (t: string) => tParts.find((p) => p.type === t)?.value || '';
    const tH = getTP('hour') === '24' ? '00' : getTP('hour');
    const tHStr = `${tH}:${getTP('minute')}`;
    const tD = `${getTP('year')}-${getTP('month')}-${getTP('day')}`;

    let dayOffset = 'same day';
    if (tD > dateStr) dayOffset = '+1 day';
    else if (tD < dateStr) dayOffset = '-1 day';

    hourlyTable.push({
      sourceHour: sHourStr,
      targetHour: tHStr,
      targetDayOffset: dayOffset,
    });
  }

  return {
    sourceDate: dateStr,
    sourceTime: `${String(inHours).padStart(2, '0')}:${String(inMinutes).padStart(2, '0')}`,
    sourceZone: fromZone,
    sourceOffset: formatOffsetMinutes(sourceOffsetMin),
    targetDate,
    targetTime,
    targetZone: toZone,
    targetOffset: formatOffsetMinutes(targetOffsetMin),
    differenceHours: diffHours,
    isSourceDst: isDst(dateStr, fromZone),
    isTargetDst: isDst(targetDate, toZone),
    hourlyTable,
  };
}

/**
 * Work hours and Brazilian CLT overtime calculator.
 * Daily threshold default: 8 hours (480 minutes).
 */
export function calculateWorkHours(
  shifts: WorkShift[],
  dailyStandardHours = 8
): WorkHoursResult {
  let totalMinutes = 0;

  for (const shift of shifts) {
    if (!shift.entry || !shift.exit) continue;
    const [eH, eM] = shift.entry.split(':').map(Number);
    const [sH, sM] = shift.exit.split(':').map(Number);
    if (isNaN(eH) || isNaN(eM) || isNaN(sH) || isNaN(sM)) continue;

    let startMin = eH * 60 + eM;
    let endMin = sH * 60 + sM;
    // Handle overnight shifts if end is earlier than start
    if (endMin < startMin) {
      endMin += 24 * 60;
    }

    const breakMin = shift.breakMinutes || 0;
    const workedMin = Math.max(0, endMin - startMin - breakMin);
    totalMinutes += workedMin;
  }

  const standardMinutes = dailyStandardHours * 60;
  const regularMinutes = Math.min(totalMinutes, standardMinutes);
  const overtimeMinutes = Math.max(0, totalMinutes - standardMinutes);

  const toHhMm = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return {
    totalMinutes,
    totalHhMm: toHhMm(totalMinutes),
    totalDecimal: Math.round((totalMinutes / 60) * 100) / 100,
    regularMinutes,
    regularHhMm: toHhMm(regularMinutes),
    regularDecimal: Math.round((regularMinutes / 60) * 100) / 100,
    overtimeMinutes,
    overtimeHhMm: toHhMm(overtimeMinutes),
    overtimeDecimal: Math.round((overtimeMinutes / 60) * 100) / 100,
  };
}

/**
 * Sums and subtracts a sequence of time entries formatted as HH:MM or HH:MM:SS.
 */
export function sumSubtractTimes(
  entries: Array<{ time: string; op: '+' | '-' }>
): {
  totalSeconds: number;
  formattedHhMm: string;
  formattedHhMmSs: string;
  decimalHours: number;
} {
  let totalSeconds = 0;

  for (const item of entries) {
    if (!item.time) continue;
    const parts = item.time.split(':').map(Number);
    if (parts.some(isNaN)) continue;

    let s = 0;
    if (parts.length === 3) {
      s = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      s = parts[0] * 3600 + parts[1] * 60;
    } else if (parts.length === 1) {
      s = parts[0] * 3600;
    }

    if (item.op === '-') {
      totalSeconds -= s;
    } else {
      totalSeconds += s;
    }
  }

  const isNeg = totalSeconds < 0;
  const absSec = Math.abs(totalSeconds);
  const h = Math.floor(absSec / 3600);
  const m = Math.floor((absSec % 3600) / 60);
  const s = absSec % 60;

  const prefix = isNeg ? '-' : '';
  const formattedHhMm = `${prefix}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  const formattedHhMmSs = `${prefix}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const decimalHours = Math.round((totalSeconds / 3600) * 1000) / 1000;

  return {
    totalSeconds,
    formattedHhMm,
    formattedHhMmSs,
    decimalHours,
  };
}

/**
 * Calculates work experience across multiple jobs, with optional overlap deduplication.
 */
export function calculateExperience(
  jobs: JobExperience[],
  deduplicateOverlaps = true,
  referenceDateStr?: string
): ExperienceResult {
  const todayStr = referenceDateStr || formatUtcDate(new Date());

  const processedJobs = jobs.map((j) => {
    const s = j.start || todayStr;
    const e = j.end && j.end.trim() !== '' ? j.end : todayStr;
    const diff = calendarDiff(s, e);
    const totalDays = Math.max(0, diff.totalDays);
    const decimalYears = Math.round((totalDays / 365.25) * 100) / 100;
    return {
      start: s,
      end: e,
      years: Math.max(0, diff.years),
      months: Math.max(0, diff.months),
      days: Math.max(0, diff.days),
      totalDays,
      decimalYears,
    };
  });

  if (!deduplicateOverlaps) {
    let sumDays = 0;
    for (const pj of processedJobs) {
      sumDays += pj.totalDays;
    }
    const years = Math.floor(sumDays / 365.25);
    const remDays = sumDays - Math.floor(years * 365.25);
    const months = Math.floor(remDays / 30.4375);
    const days = Math.floor(remDays - months * 30.4375);

    return {
      jobs: processedJobs,
      totalYears: years,
      totalMonths: months,
      totalDays: days,
      overallTotalDays: sumDays,
      overallDecimalYears: Math.round((sumDays / 365.25) * 100) / 100,
    };
  }

  // Merge overlapping intervals [start, end]
  const intervals: Array<{ start: number; end: number }> = [];
  for (const pj of processedJobs) {
    const t1 = parseUtcDate(pj.start).getTime();
    const t2 = parseUtcDate(pj.end).getTime();
    if (t2 >= t1) {
      intervals.push({ start: t1, end: t2 });
    }
  }

  intervals.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const interval of intervals) {
    if (merged.length === 0) {
      merged.push({ ...interval });
    } else {
      const prev = merged[merged.length - 1];
      if (interval.start <= prev.end) {
        prev.end = Math.max(prev.end, interval.end);
      } else {
        merged.push({ ...interval });
      }
    }
  }

  let totalMergedDays = 0;
  for (const m of merged) {
    totalMergedDays += Math.round((m.end - m.start) / (1000 * 60 * 60 * 24));
  }

  const totalYears = Math.floor(totalMergedDays / 365.25);
  const remDays = totalMergedDays - Math.floor(totalYears * 365.25);
  const totalMonths = Math.floor(remDays / 30.4375);
  const finalDays = Math.floor(remDays - totalMonths * 30.4375);

  return {
    jobs: processedJobs,
    totalYears,
    totalMonths,
    totalDays: finalDays,
    overallTotalDays: totalMergedDays,
    overallDecimalYears: Math.round((totalMergedDays / 365.25) * 100) / 100,
  };
}

/**
 * Calculates shelf life, expiry date, days remaining, and freshness status.
 */
export function calculateShelfLife(
  manufactureDate: string,
  shelfLifeValue: number,
  shelfLifeUnit: 'days' | 'months' | 'years',
  referenceDateStr?: string
): ShelfLifeResult {
  const refDateStr = referenceDateStr || formatUtcDate(new Date());

  const periodOptions: PeriodAddOptions = {};
  if (shelfLifeUnit === 'days') periodOptions.days = shelfLifeValue;
  else if (shelfLifeUnit === 'months') periodOptions.months = shelfLifeValue;
  else if (shelfLifeUnit === 'years') periodOptions.years = shelfLifeValue;

  const expiryDate = addPeriod(manufactureDate, periodOptions);
  const daysTotal = Math.max(1, daysBetween(manufactureDate, expiryDate, false));
  const daysRemaining = daysBetween(refDateStr, expiryDate, false);

  let percentageUsed = Math.round(((daysTotal - daysRemaining) / daysTotal) * 100);
  percentageUsed = Math.max(0, Math.min(100, percentageUsed));

  let status: ShelfLifeResult['status'] = 'fresh';
  let statusLabel = 'Fresh / Valid';

  if (daysRemaining < 0) {
    status = 'expired';
    statusLabel = 'Expired';
  } else if (daysRemaining <= Math.max(3, daysTotal * 0.15)) {
    status = 'expiring_soon';
    statusLabel = 'Expiring Soon';
  }

  return {
    manufactureDate,
    expiryDate,
    daysTotal,
    daysRemaining,
    percentageUsed,
    status,
    statusLabel,
  };
}
