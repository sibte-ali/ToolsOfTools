import { describe, it, expect } from 'vitest';
import {
  daysBetween,
  businessDaysBetween,
  addPeriod,
  calendarDiff,
  getWeekdayInfo,
  convertTimezone,
  isDst,
  calculateWorkHours,
  sumSubtractTimes,
  calculateExperience,
  calculateShelfLife,
} from './dates';

describe('Date & Time Utilities (src/lib/dates.ts)', () => {
  describe('Leap Year and Day Counting', () => {
    it('accurately counts days across a leap day (2024-02-28 to 2024-03-01)', () => {
      // 2024 is a leap year; 2024-02-28 -> 2024-02-29 (1 day) -> 2024-03-01 (2 days)
      const diffLeap = daysBetween('2024-02-28', '2024-03-01');
      expect(diffLeap).toBe(2);

      const diffLeapInclusive = daysBetween('2024-02-28', '2024-03-01', true);
      expect(diffLeapInclusive).toBe(3); // 28th, 29th, 1st

      // 2023 is a non-leap year; 2023-02-28 -> 2023-03-01 (1 day)
      const diffNonLeap = daysBetween('2023-02-28', '2023-03-01');
      expect(diffNonLeap).toBe(1);
    });

    it('counts business days excluding weekends', () => {
      // 2024-05-03 is Friday, 2024-05-06 is Monday
      // Exclusive: Friday only (1 day)
      expect(businessDaysBetween('2024-05-03', '2024-05-06', false)).toBe(1);
      // Inclusive: Friday and Monday (2 days)
      expect(businessDaysBetween('2024-05-03', '2024-05-06', true)).toBe(2);
    });
  });

  describe('End-of-Month Addition (Clipping)', () => {
    it('handles end-of-month addition: Jan 31 + 1 month clips to Feb 28 on regular year', () => {
      const result2023 = addPeriod('2023-01-31', { months: 1 });
      expect(result2023).toBe('2023-02-28');
    });

    it('handles end-of-month addition: Jan 31 + 1 month clips to Feb 29 on leap year', () => {
      const result2024 = addPeriod('2024-01-31', { months: 1 });
      expect(result2024).toBe('2024-02-29');
    });

    it('handles addition of weeks and days correctly', () => {
      const res = addPeriod('2024-01-01', { weeks: 2, days: 3 });
      // 2 weeks (14 days) + 3 days = 17 days -> 2024-01-18
      expect(res).toBe('2024-01-18');
    });
  });

  describe('Calendar Difference & Age / Birthday', () => {
    it('computes exact years, months, and days', () => {
      const diff = calendarDiff('1990-05-15', '2024-07-20');
      expect(diff.years).toBe(34);
      expect(diff.months).toBe(2);
      expect(diff.days).toBe(5);
      expect(diff.totalDays).toBeGreaterThan(12000);
      expect(diff.isNegative).toBe(false);
    });

    it('determines day of the week', () => {
      // 2000-01-01 was a Saturday (index 6)
      const infoEn = getWeekdayInfo('2000-01-01', 'en');
      expect(infoEn.index).toBe(6);
      expect(infoEn.name.toLowerCase()).toBe('saturday');

      const infoPt = getWeekdayInfo('2000-01-01', 'pt-br');
      expect(infoPt.index).toBe(6);
      expect(infoPt.name.toLowerCase()).toContain('sábado');
    });
  });

  describe('DST Spring-Forward & Timezone Conversion (EST vs EDT to IST)', () => {
    it('detects DST active status for America/New_York across spring-forward', () => {
      // US DST 2024: Started March 10, 2024, ended November 3, 2024
      expect(isDst('2024-01-15', 'America/New_York')).toBe(false); // Standard Time (EST)
      expect(isDst('2024-07-15', 'America/New_York')).toBe(true);  // Daylight Time (EDT)
    });

    it('converts EST (winter, UTC-5) to IST (UTC+5:30) with 10.5 hr difference', () => {
      // In winter (Jan 15), New York is UTC-5, IST is UTC+5:30 -> difference is +10:30
      // 10:00 AM EST -> 10:00 + 10:30 = 20:30 IST (8:30 PM same day)
      const res = convertTimezone('2024-01-15', '10:00', 'America/New_York', 'Asia/Kolkata');
      expect(res.sourceOffset).toBe('UTC-05:00');
      expect(res.targetOffset).toBe('UTC+05:30');
      expect(res.differenceHours).toBe(10.5);
      expect(res.targetDate).toBe('2024-01-15');
      expect(res.targetTime).toBe('20:30');
      expect(res.isSourceDst).toBe(false);
    });

    it('converts EDT (summer, UTC-4) to IST (UTC+5:30) with 9.5 hr difference', () => {
      // In summer (July 15), New York is UTC-4, IST is UTC+5:30 -> difference is +9:30
      // 10:00 AM EDT -> 10:00 + 09:30 = 19:30 IST (7:30 PM same day)
      const res = convertTimezone('2024-07-15', '10:00', 'America/New_York', 'Asia/Kolkata');
      expect(res.sourceOffset).toBe('UTC-04:00');
      expect(res.targetOffset).toBe('UTC+05:30');
      expect(res.differenceHours).toBe(9.5);
      expect(res.targetDate).toBe('2024-07-15');
      expect(res.targetTime).toBe('19:30');
      expect(res.isSourceDst).toBe(true);
    });

    it('handles CST vs CDT to IST (America/Chicago)', () => {
      // Winter CST (UTC-6) -> IST (UTC+5:30) difference is +11:30
      const resCst = convertTimezone('2024-01-15', '10:00', 'America/Chicago', 'Asia/Kolkata');
      expect(resCst.sourceOffset).toBe('UTC-06:00');
      expect(resCst.differenceHours).toBe(11.5);
      expect(resCst.targetTime).toBe('21:30');

      // Summer CDT (UTC-5) -> IST (UTC+5:30) difference is +10:30
      const resCdt = convertTimezone('2024-07-15', '10:00', 'America/Chicago', 'Asia/Kolkata');
      expect(resCdt.sourceOffset).toBe('UTC-05:00');
      expect(resCdt.differenceHours).toBe(10.5);
      expect(resCdt.targetTime).toBe('20:30');
    });

    it('converts 10am GMT (UTC+0) to IST (UTC+5:30)', () => {
      const res = convertTimezone('2024-01-15', '10:00', 'UTC', 'Asia/Kolkata');
      expect(res.sourceOffset).toBe('UTC (+00:00)');
      expect(res.targetOffset).toBe('UTC+05:30');
      expect(res.differenceHours).toBe(5.5);
      expect(res.targetTime).toBe('15:30'); // 3:30 PM
    });
  });

  describe('Work Hours & Brazilian CLT Overtime', () => {
    it('calculates standard 8h day with 1h lunch and overtime', () => {
      // 08:00 to 18:00 with 60 min lunch = 9 hours worked.
      // Standard is 8h -> 8h regular, 1h overtime.
      const res = calculateWorkHours([
        { entry: '08:00', exit: '18:00', breakMinutes: 60 },
      ], 8);

      expect(res.totalMinutes).toBe(540); // 9h
      expect(res.totalHhMm).toBe('09:00');
      expect(res.totalDecimal).toBe(9.0);
      expect(res.regularHhMm).toBe('08:00');
      expect(res.overtimeHhMm).toBe('01:00');
      expect(res.overtimeDecimal).toBe(1.0);
    });

    it('sums and subtracts time intervals', () => {
      const res = sumSubtractTimes([
        { time: '04:30', op: '+' },
        { time: '02:15', op: '+' },
        { time: '01:00', op: '-' },
      ]);
      // 4h30 + 2h15 - 1h = 5h45
      expect(res.formattedHhMm).toBe('05:45');
      expect(res.decimalHours).toBe(5.75);
    });
  });

  describe('Experience Calculator', () => {
    it('calculates experience with overlapping jobs deduplicated', () => {
      const jobs = [
        { start: '2020-01-01', end: '2022-01-01' }, // 2 years (~731 days)
        { start: '2021-01-01', end: '2023-01-01' }, // Overlaps 2021-2022
      ];

      const deduplicated = calculateExperience(jobs, true, '2024-01-01');
      // Merged range is 2020-01-01 to 2023-01-01 = 3 years (1096 days)
      expect(deduplicated.totalYears).toBe(3);

      const nonDeduplicated = calculateExperience(jobs, false, '2024-01-01');
      // 2 years + 2 years = 4 years
      expect(nonDeduplicated.totalYears).toBe(4);
    });
  });

  describe('Shelf Life Calculator', () => {
    it('computes expiry date and remaining days', () => {
      // Mfg: 2024-01-01, Shelf life: 6 months -> Exp: 2024-07-01
      // Ref: 2024-04-01 -> ~91 days remaining, ~50% used
      const res = calculateShelfLife('2024-01-01', 6, 'months', '2024-04-01');
      expect(res.expiryDate).toBe('2024-07-01');
      expect(res.daysRemaining).toBe(91);
      expect(res.status).toBe('fresh');

      // After expiry
      const expired = calculateShelfLife('2024-01-01', 1, 'months', '2024-03-01');
      expect(expired.status).toBe('expired');
    });
  });
});
