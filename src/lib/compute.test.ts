import { describe, it, expect } from 'vitest';
import {
  computeSwp,
  computeBmi,
  computeAttendance,
  computeDiscount,
  computeDaysBetween,
  computePace,
} from './compute';

describe('Compute engines and worked example consistency checks', () => {
  it('SWP worked example matches compute output', () => {
    // Example: $100,000 investment, $800 monthly withdrawal, 8% expected return over 10 years
    const result = computeSwp(100000, 800, 8, 10);
    expect(result.totalWithdrawn).toBe(96000);
    expect(result.finalBalance).toBe(75607);
    expect(result.isExhausted).toBe(false);
  });

  it('BMI worked example matches compute output', () => {
    // Example: 70 kg, 175 cm
    const result = computeBmi(70, 175);
    expect(result.bmi).toBe(22.9);
    expect(result.category).toBe('Normal');

    // Example: 90 kg, 170 cm
    const obeseResult = computeBmi(90, 170);
    expect(obeseResult.bmi).toBe(31.1);
    expect(obeseResult.category).toBe('Obese');
  });

  it('Attendance worked example matches compute output', () => {
    // Example: 50 classes held, 30 attended, 75% target
    // currentPct = 60%
    // classesToAttend = ceil((75*50 - 3000)/25) = ceil(750/25) = 30
    const result = computeAttendance(50, 30, 75);
    expect(result.currentPct).toBe(60.0);
    expect(result.classesToAttend).toBe(30);
    expect(result.classesCanMiss).toBe(0);

    // Example: 50 classes held, 45 attended, 75% target
    // canMiss = floor(4500/75 - 50) = floor(60 - 50) = 10
    const goodResult = computeAttendance(50, 45, 75);
    expect(goodResult.currentPct).toBe(90.0);
    expect(goodResult.classesToAttend).toBe(0);
    expect(goodResult.classesCanMiss).toBe(10);
  });

  it('Discount worked example matches compute output', () => {
    // Example: $120 item, 25% discount
    const result = computeDiscount(120, 25);
    expect(result.savings).toBe(30.0);
    expect(result.finalPrice).toBe(90.0);
  });

  it('Days between worked example matches compute output', () => {
    // Example: 2026-01-01 to 2026-01-31
    const result = computeDaysBetween('2026-01-01', '2026-01-31');
    expect(result.days).toBe(30);
  });

  it('Pace worked example matches compute output', () => {
    // Example: 10 km in 50 minutes -> 5:00 /km
    const result = computePace(10, 50);
    expect(result.paceMinutes).toBe(5);
    expect(result.paceSeconds).toBe(0);
    expect(result.formattedPace).toBe('5:00 /km');
  });

  it('verifies markdown frontmatter example numbers match compute output', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. SWP markdown check
    const swpPath = path.resolve(__dirname, '../content/tools/en/swp-calculator.md');
    const swpContent = fs.readFileSync(swpPath, 'utf8');
    const swpMatch = swpContent.match(/example:\s*"([^"]+)"/);
    expect(swpMatch).not.toBeNull();
    const swpRes = computeSwp(100000, 800, 8, 10);
    expect(swpMatch![1]).toContain(String(swpRes.totalWithdrawn.toLocaleString('en-US')));
    expect(swpMatch![1]).toContain(String(swpRes.finalBalance.toLocaleString('en-US')));

    // 2. BMI markdown check
    const bmiPath = path.resolve(__dirname, '../content/tools/en/bmi-calculator.md');
    const bmiContent = fs.readFileSync(bmiPath, 'utf8');
    const bmiMatch = bmiContent.match(/example:\s*"([^"]+)"/);
    expect(bmiMatch).not.toBeNull();
    const bmiRes = computeBmi(70, 175);
    expect(bmiMatch![1]).toContain(String(bmiRes.bmi));
    expect(bmiMatch![1]).toContain(bmiRes.category);

    // 3. Attendance markdown check
    const attPath = path.resolve(__dirname, '../content/tools/en/attendance-calculator.md');
    const attContent = fs.readFileSync(attPath, 'utf8');
    const attMatch = attContent.match(/example:\s*"([^"]+)"/);
    expect(attMatch).not.toBeNull();
    const attRes = computeAttendance(50, 30, 75);
    expect(attMatch![1]).toContain(String(attRes.currentPct));
    expect(attMatch![1]).toContain(String(attRes.classesToAttend));

    // 4. Discount markdown check
    const discPath = path.resolve(__dirname, '../content/tools/en/discount-calculator.md');
    const discContent = fs.readFileSync(discPath, 'utf8');
    const discMatch = discContent.match(/example:\s*"([^"]+)"/);
    expect(discMatch).not.toBeNull();
    const discRes = computeDiscount(120, 25);
    expect(discMatch![1]).toContain(String(discRes.savings.toFixed(2)));
    expect(discMatch![1]).toContain(String(discRes.finalPrice.toFixed(2)));

    // 5. Days between markdown check
    const dayPath = path.resolve(__dirname, '../content/tools/en/day-calculator.md');
    const dayContent = fs.readFileSync(dayPath, 'utf8');
    const dayMatch = dayContent.match(/example:\s*"([^"]+)"/);
    expect(dayMatch).not.toBeNull();
    const dayRes = computeDaysBetween('2026-01-01', '2026-01-31');
    expect(dayMatch![1]).toContain(String(dayRes.days));

    // 6. Pace markdown check
    const pacePath = path.resolve(__dirname, '../content/tools/en/pace-calculator.md');
    const paceContent = fs.readFileSync(pacePath, 'utf8');
    const paceMatch = paceContent.match(/example:\s*"([^"]+)"/);
    expect(paceMatch).not.toBeNull();
    const paceRes = computePace(10, 50);
    expect(paceMatch![1]).toContain(paceRes.formattedPace);
  });
});
