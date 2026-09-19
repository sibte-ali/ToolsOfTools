import { describe, it, expect } from 'vitest';
import { expectClose } from '../lib/engine/test-utils';

// Import Batch B calculation functions
import { calculateAttendance } from './en/attendance-calculator';
import { calculateCatRawScore } from './en/cat-score-calculator';
import { calculateCgpaToPercentage } from './en/how-to-calculate-cgpa-to-percentage';
import { calculateMarksPercentage } from './en/marks-percentage-calculator';
import { calculateVitGpa } from './en/vit-cgpa-calculator';
import { convertPercentageToCgpa } from './en/percentage-to-cgpa';
import { calculateJeeMainScore } from './en/jee-marks-calculator';
import { calculateSgpaToCgpa } from './en/sgpa-to-cgpa';
import { calculateSrmGpa } from './en/srm-cgpa-calculator';
import { convertSgpaToPercentage } from './en/how-to-convert-sgpa-into-percentage';
import jeeAdvConfig, { calculateJeeAdvPaper } from './en/jee-advanced-marks-calculator';
import { calculateIeltsBands, roundIeltsOverallBand } from './en/ielts-band-calculator';
import { calculateWeightedExamGrade } from './en/mark-calculator-exam';
import { calculateGateMarks } from './en/gate-calculator';

function runCompute(config: { compute: (v: any) => any }, values: Record<string, any>): Record<string, any> {
  const res = config.compute(values);
  if (res instanceof Error) throw res;
  return res as Record<string, any>;
}

describe('Batch B Education Tools Unit Tests', () => {
  // 1. Attendance Calculator
  describe('attendance-calculator', () => {
    it('calculates required classes to reach 75% attendance', () => {
      // Source: Formula ceil((p*t - 100*a) / (100 - p))
      // 50 classes held, 34 attended -> 68%. Target 75%: ceil((75*50 - 3400)/25) = ceil(350/25) = 14
      const res = calculateAttendance(50, 34, 75);
      expect(res.currentPct).toBe(68);
      expect(res.classesToAttend).toBe(14);
      expect(res.isTargetMet).toBe(false);
      expect(res.statusMessage).toContain('attend the next 14 classes');
    });

    it('calculates safe bunks when attendance is well above target', () => {
      // 50 classes held, 45 attended -> 90%. Target 75%: floor((4500/75) - 50) = 60 - 50 = 10
      const res = calculateAttendance(50, 45, 75);
      expect(res.currentPct).toBe(90);
      expect(res.classesCanMiss).toBe(10);
      expect(res.isTargetMet).toBe(true);
      expect(res.statusMessage).toContain('miss up to 10 upcoming classes');
    });
  });

  // 2. CAT Score Calculator
  describe('cat-score-calculator', () => {
    it('computes section-wise and total raw scores (+3 / -1 / 0 TITA) (IIM CAT official rules)', () => {
      // Source: IIM CAT official marking scheme (+3 correct, -1 wrong MCQ, 0 wrong TITA)
      // VARC: 14 MCQ correct, 3 wrong, 2 TITA correct -> 14*3 - 3 + 2*3 = 45
      // DILR: 10 MCQ correct, 2 wrong, 2 TITA correct -> 30 - 2 + 6 = 34
      // QA: 11 MCQ correct, 2 wrong, 3 TITA correct -> 33 - 2 + 9 = 40
      // Total: 45 + 34 + 40 = 119 / 198
      const res = calculateCatRawScore({
        varcMcqCorrect: 14,
        varcMcqWrong: 3,
        varcTitaCorrect: 2,
        dilrMcqCorrect: 10,
        dilrMcqWrong: 2,
        dilrTitaCorrect: 2,
        qaMcqCorrect: 11,
        qaMcqWrong: 2,
        qaTitaCorrect: 3,
      });
      expect(res.varcScore).toBe(45);
      expect(res.dilrScore).toBe(34);
      expect(res.qaScore).toBe(40);
      expect(res.totalRawScore).toBe(119);
      expect(res.maxPossible).toBe(198);
    });

    it('handles negative section score if penalties exceed correct marks', () => {
      const res = calculateCatRawScore({
        varcMcqCorrect: 2,
        varcMcqWrong: 10,
        varcTitaCorrect: 0,
        dilrMcqCorrect: 0,
        dilrMcqWrong: 0,
        dilrTitaCorrect: 0,
        qaMcqCorrect: 0,
        qaMcqWrong: 0,
        qaTitaCorrect: 0,
      });
      expect(res.varcScore).toBe(-4); // 2*3 - 10 = -4
      expect(res.totalRawScore).toBe(-4);
    });
  });

  // 3. How to Calculate CGPA to Percentage
  describe('how-to-calculate-cgpa-to-percentage', () => {
    it('converts CBSE CGPA to percentage using 9.5 multiplier (CBSE official circular)', () => {
      // Source: CBSE official Class X conversion circular (Percentage = CGPA * 9.5)
      // 8.4 CGPA * 9.5 = 79.8%
      const res = calculateCgpaToPercentage({
        mode: 'cgpaToPct',
        value: 8.4,
        rule: 'cbse',
      });
      expect(res.calculatedPercentage).toBe(79.8);
      expect(res.formulaWithNumbers).toContain('8.4 × 9.5 = 79.8%');
    });

    it('converts VTU engineering CGPA using (CGPA - 0.75) * 10 formula', () => {
      // Source: VTU academic regulations (Percentage = (CGPA - 0.75) * 10)
      // (8.0 - 0.75) * 10 = 72.5%
      const res = calculateCgpaToPercentage({
        mode: 'cgpaToPct',
        value: 8.0,
        rule: 'vtu',
      });
      expect(res.calculatedPercentage).toBe(72.5);
    });
  });

  // 4. Marks Percentage Calculator
  describe('marks-percentage-calculator', () => {
    it('calculates aggregate percentage and assigns grade band', () => {
      // 5 subjects: 85, 92, 78, 84, 89 out of 100 -> total 428/500 = 85.6% -> Grade A
      const subjects = [
        { subject: 'English', obtained: 85, max: 100 },
        { subject: 'Mathematics', obtained: 92, max: 100 },
        { subject: 'Science', obtained: 78, max: 100 },
        { subject: 'Social', obtained: 84, max: 100 },
        { subject: 'Language', obtained: 89, max: 100 },
      ];
      const res = calculateMarksPercentage(subjects);
      expect(res.totalObtained).toBe(428);
      expect(res.totalMax).toBe(500);
      expect(res.percentage).toBe(85.6);
      expect(res.gradeBand).toContain('A (Excellent)');
    });

    it('handles mixed max marks across subjects (e.g. 50 and 100 max)', () => {
      const subjects = [
        { subject: 'Lab 1', obtained: 45, max: 50 },
        { subject: 'Theory 1', obtained: 80, max: 100 },
      ];
      const res = calculateMarksPercentage(subjects);
      expect(res.totalObtained).toBe(125);
      expect(res.totalMax).toBe(150);
      expectClose(res.percentage, 83.33, 0.01);
    });
  });

  // 5. VIT CGPA Calculator
  describe('vit-cgpa-calculator', () => {
    it('calculates semester GPA using VIT 10-point grade system (S=10, A=9, B=8, C=7, D=6, E=5, F=0)', () => {
      // Source: VIT academic handbook
      // 4cr S(10), 4cr A(9), 3cr B(8), 3cr A(9), 2cr S(10) -> 16 credits
      // Points: 40 + 36 + 24 + 27 + 20 = 147 -> SGPA = 147 / 16 = 9.19
      const courses = [
        { courseName: 'Course 1', credits: 4, grade: 'S' },
        { courseName: 'Course 2', credits: 4, grade: 'A' },
        { courseName: 'Course 3', credits: 3, grade: 'B' },
        { courseName: 'Course 4', credits: 3, grade: 'A' },
        { courseName: 'Course 5', credits: 2, grade: 'S' },
      ];
      const res = calculateVitGpa(courses, 0, 0);
      expect(res.semCredits).toBe(16);
      expect(res.semesterGpa).toBe(9.19);
      expect(res.cumulativeCgpa).toBe(9.19);
    });

    it('updates cumulative CGPA across prior semesters', () => {
      // 40 prior credits with 8.85 CGPA + 16 new credits with 147 points
      // Total points: 40 * 8.85 + 147 = 354 + 147 = 501 / 56 credits = 8.95
      const courses = [
        { courseName: 'Course 1', credits: 4, grade: 'S' },
        { courseName: 'Course 2', credits: 4, grade: 'A' },
        { courseName: 'Course 3', credits: 3, grade: 'B' },
        { courseName: 'Course 4', credits: 3, grade: 'A' },
        { courseName: 'Course 5', credits: 2, grade: 'S' },
      ];
      const res = calculateVitGpa(courses, 40, 8.85);
      expect(res.totalCredits).toBe(56);
      expect(res.cumulativeCgpa).toBe(8.95);
    });
  });

  // 6. Percentage to CGPA
  describe('percentage-to-cgpa', () => {
    it('converts percentage to CBSE CGPA (divide by 9.5)', () => {
      // 85.5% / 9.5 = 9.00 CGPA
      const res = convertPercentageToCgpa({
        percentage: 85.5,
        rule: 'cbse',
      });
      expect(res.cgpa).toBe(9.0);
      expect(res.formulaDisplay).toContain('85.5 / 9.5 = 9');
    });

    it('converts percentage to VTU CGPA ((Percentage / 10) + 0.75)', () => {
      // 72.5% -> (72.5 / 10) + 0.75 = 7.25 + 0.75 = 8.00 CGPA
      const res = convertPercentageToCgpa({
        percentage: 72.5,
        rule: 'vtu',
      });
      expect(res.cgpa).toBe(8.0);
    });
  });

  // 7. JEE Marks Calculator
  describe('jee-marks-calculator', () => {
    it('computes JEE Main score with negative marking on numericals (NTA latest rule)', () => {
      // Source: NTA JEE Main Information Bulletin (+4 correct, -1 wrong MCQ & Numerical)
      // Physics: 15 MCQ correct, 3 wrong, 3 Num correct, 1 wrong -> 15*4 - 3 + 3*4 - 1 = 68
      // Chemistry: 16 MCQ correct, 2 wrong, 4 Num correct, 0 wrong -> 16*4 - 2 + 4*4 = 78
      // Mathematics: 12 MCQ correct, 4 wrong, 2 Num correct, 1 wrong -> 12*4 - 4 + 2*4 - 1 = 51
      // Total = 68 + 78 + 51 = 197 / 300
      const res = calculateJeeMainScore({
        phyMcqCorrect: 15,
        phyMcqWrong: 3,
        phyNumCorrect: 3,
        phyNumWrong: 1,
        chemMcqCorrect: 16,
        chemMcqWrong: 2,
        chemNumCorrect: 4,
        chemNumWrong: 0,
        mathMcqCorrect: 12,
        mathMcqWrong: 4,
        mathNumCorrect: 2,
        mathNumWrong: 1,
      });
      expect(res.phyScore).toBe(68);
      expect(res.chemScore).toBe(78);
      expect(res.mathScore).toBe(51);
      expect(res.totalScore).toBe(197);
      expect(res.maxMarks).toBe(300);
    });

    it('handles perfect score (300/300)', () => {
      const res = calculateJeeMainScore({
        phyMcqCorrect: 20,
        phyMcqWrong: 0,
        phyNumCorrect: 5,
        phyNumWrong: 0,
        chemMcqCorrect: 20,
        chemMcqWrong: 0,
        chemNumCorrect: 5,
        chemNumWrong: 0,
        mathMcqCorrect: 20,
        mathMcqWrong: 0,
        mathNumCorrect: 5,
        mathNumWrong: 0,
      });
      expect(res.totalScore).toBe(300);
    });
  });

  // 8. SGPA to CGPA
  describe('sgpa-to-cgpa', () => {
    it('calculates credit-weighted cumulative CGPA across semesters', () => {
      // Sem 1: 8.2 (21cr) -> 172.2
      // Sem 2: 8.5 (22cr) -> 187.0
      // Sem 3: 7.9 (24cr) -> 189.6
      // Sem 4: 8.8 (23cr) -> 202.4
      // Total points = 751.2 / 90 credits = 8.35
      const sems = [
        { semesterName: 'Sem 1', sgpa: 8.2, credits: 21 },
        { semesterName: 'Sem 2', sgpa: 8.5, credits: 22 },
        { semesterName: 'Sem 3', sgpa: 7.9, credits: 24 },
        { semesterName: 'Sem 4', sgpa: 8.8, credits: 23 },
      ];
      const res = calculateSgpaToCgpa(sems);
      expect(res.finalCgpa).toBe(8.35);
      expect(res.totalCredits).toBe(90);
    });

    it('calculates simple average when credits are omitted', () => {
      const sems = [
        { semesterName: 'Sem 1', sgpa: 8.0 },
        { semesterName: 'Sem 2', sgpa: 9.0 },
      ];
      const res = calculateSgpaToCgpa(sems);
      expect(res.finalCgpa).toBe(8.5);
    });
  });

  // 9. SRM CGPA Calculator
  describe('srm-cgpa-calculator', () => {
    it('calculates SRMIST GPA using official grade scale (O=10, A+=9, A=8, B+=7, B=6, C=5, F=0)', () => {
      // Source: SRM Institute of Science and Technology academic regulations
      // 4cr O(10), 4cr A+(9), 3cr A(8), 3cr B+(7), 2cr O(10) -> 16 credits
      // Points: 40 + 36 + 24 + 21 + 20 = 141 / 16 = 8.81
      const courses = [
        { course: 'Math', credits: 4, grade: 'O' },
        { course: 'DS', credits: 4, grade: 'A+' },
        { course: 'DE', credits: 3, grade: 'A' },
        { course: 'DBMS', credits: 3, grade: 'B+' },
        { course: 'Soft Skills', credits: 2, grade: 'O' },
      ];
      const res = calculateSrmGpa(courses, 0, 0);
      expect(res.semesterGpa).toBe(8.81);
      expect(res.percentage).toBe(88.1); // SRM rule: CGPA * 10
    });

    it('updates cumulative CGPA with prior semester credits', () => {
      const courses = [{ course: 'Project', credits: 10, grade: 'O' }];
      const res = calculateSrmGpa(courses, 90, 8.5);
      // Points: 90*8.5 + 10*10 = 765 + 100 = 865 / 100 = 8.65
      expect(res.totalCredits).toBe(100);
      expect(res.cumulativeCgpa).toBe(8.65);
    });
  });

  // 10. How to Convert SGPA into Percentage
  describe('how-to-convert-sgpa-into-percentage', () => {
    it('converts standard UGC SGPA to percentage (SGPA * 10)', () => {
      // 8.6 * 10 = 86.0%
      const res = convertSgpaToPercentage({
        sgpa: 8.6,
        rule: 'standard',
      });
      expect(res.percentage).toBe(86.0);
      expect(res.formulaDisplay).toContain('8.6 × 10 = 86%');
    });

    it('converts VTU SGPA to percentage ((SGPA - 0.75) * 10)', () => {
      // (8.6 - 0.75) * 10 = 78.5%
      const res = convertSgpaToPercentage({
        sgpa: 8.6,
        rule: 'vtu',
      });
      expect(res.percentage).toBe(78.5);
    });
  });

  // 11. JEE Advanced Marks Calculator
  describe('jee-advanced-marks-calculator', () => {
    it('calculates Paper 1 score with partial marking (IIT JEE Advanced scheme)', () => {
      // Single: 8*3 - 2*1 = 22
      // Multi: 5*4 + 3*2 - 2*2 = 20 + 6 - 4 = 22
      // Numerical: 6*4 = 24
      // Total = 22 + 22 + 24 = 68
      const res = calculateJeeAdvPaper({
        singleCorrect: 8,
        singleWrong: 2,
        multiFullCorrect: 5,
        multiPartialCount: 3,
        multiWrong: 2,
        numericalCorrect: 6,
        numericalWrong: 0,
      });
      expect(res.single).toBe(22);
      expect(res.multi).toBe(22);
      expect(res.numerical).toBe(24);
      expect(res.totalPaperMarks).toBe(68);
    });

    it('computes combined Paper 1 and Paper 2 grand total via config', () => {
      const out = runCompute(jeeAdvConfig, {
        p1SingleCorrect: 8,
        p1SingleWrong: 2,
        p1MultiFullCorrect: 5,
        p1MultiPartial: 3,
        p1MultiWrong: 2,
        p1NumericalCorrect: 6,
        p2SingleCorrect: 7,
        p2SingleWrong: 3,
        p2MultiFullCorrect: 4,
        p2MultiPartial: 2,
        p2MultiWrong: 2,
        p2NumericalCorrect: 5,
      });
      expect(out.paper1Total).toBe(68);
      expect(out.paper2Total).toBeGreaterThan(0);
      expect(out.grandTotal).toBe(out.paper1Total + out.paper2Total);
    });
  });

  // 12. IELTS Band Calculator
  describe('ielts-band-calculator', () => {
    it('calculates IELTS overall band matching British Council official rounding', () => {
      // Listening 32/40 -> Band 7.5
      // Academic Reading 30/40 -> Band 7.0
      // Writing -> 6.5
      // Speaking -> 7.0
      // Mean: (7.5 + 7.0 + 6.5 + 7.0) / 4 = 28 / 4 = 7.0
      const res = calculateIeltsBands({
        listeningRaw: 32,
        readingRaw: 30,
        readingType: 'academic',
        writingBand: 6.5,
        speakingBand: 7.0,
      });
      expect(res.listeningBand).toBe(7.5);
      expect(res.readingBand).toBe(7.0);
      expect(res.overallBand).toBe(7.0);
    });

    it('adheres to official .25 and .75 round-up rules', () => {
      // Mean 6.25 -> rounds to 6.5
      expect(roundIeltsOverallBand(6.25)).toBe(6.5);
      // Mean 6.75 -> rounds to 7.0
      expect(roundIeltsOverallBand(6.75)).toBe(7.0);
      // Mean 6.125 -> rounds to 6.0
      expect(roundIeltsOverallBand(6.125)).toBe(6.0);
      // Mean 6.625 -> rounds to 6.5
      expect(roundIeltsOverallBand(6.625)).toBe(6.5);
    });
  });

  // 13. Mark Calculator Exam
  describe('mark-calculator-exam', () => {
    it('calculates weighted score and required mark on final exam to reach target', () => {
      // Coursework: 20% (scored 90) + 25% (scored 82) + 25% (scored 78) = 70% completed
      // Weighted sum: 18 + 20.5 + 19.5 = 58.0 points
      // Target: 85%. Deficit = 85 - 58 = 27 points needed from remaining 30%
      // Required = (27 / 30) * 100 = 90.0%
      const components = [
        { name: 'Homework', weightPct: 20, scorePct: 90 },
        { name: 'Midterm 1', weightPct: 25, scorePct: 82 },
        { name: 'Midterm 2', weightPct: 25, scorePct: 78 },
      ];
      const res = calculateWeightedExamGrade(components, 85);
      expect(res.currentWeightedSum).toBe(58.0);
      expect(res.remainingWeight).toBe(30);
      expect(res.requiredScore).toBe(90.0);
      expect(res.feasibilityStatus).toContain('need at least 90%');
    });

    it('flags when target grade is mathematically unattainable (> 100% required)', () => {
      const components = [{ name: 'Midterm', weightPct: 50, scorePct: 50 }];
      // 25 points earned. To get 90% overall, need 65 points from remaining 50% = 130%!
      const res = calculateWeightedExamGrade(components, 90);
      expect(res.requiredScore).toBe(130.0);
      expect(res.feasibilityStatus).toContain('Target unreachable');
    });
  });

  // 14. GATE Calculator
  describe('gate-calculator', () => {
    it('calculates GATE raw marks with negative marking on 1-mark & 2-mark MCQs (IIT GATE official rule)', () => {
      // 18 1-mark MCQ correct, 4 wrong -> 18 - 4/3 = 16.67
      // 16 2-mark MCQ correct, 3 wrong -> 32 - 2 = 30.00
      // 6 1-mark NAT correct (no negative) -> 6.00
      // 8 2-mark NAT correct (no negative) -> 16.00
      // Total = 16.67 + 30 + 6 + 16 = 68.67
      const res = calculateGateMarks({
        mcq1Correct: 18,
        mcq1Wrong: 4,
        mcq2Correct: 16,
        mcq2Wrong: 3,
        nat1Correct: 6,
        nat1Wrong: 2,
        nat2Correct: 8,
        nat2Wrong: 2,
        computeGateScore: true,
        mq: 25,
        mt: 75,
      });
      expect(res.rawMarks).toBe(68.67);
      expect(res.mcq1).toBe(16.67);
      expect(res.mcq2).toBe(30.0);
      expect(res.nat1).toBe(6);
      expect(res.nat2).toBe(16);
      // Normalized Score = 350 + (900-350)*(68.67-25)/(75-25) = 350 + 550*(43.67/50) = 350 + 480.37 = 830
      expect(res.normalizedGateScore).toBe(830);
    });

    it('handles zero correct answers without negative error', () => {
      const res = calculateGateMarks({
        mcq1Correct: 0,
        mcq1Wrong: 3,
        mcq2Correct: 0,
        mcq2Wrong: 0,
        nat1Correct: 0,
        nat1Wrong: 0,
        nat2Correct: 0,
        nat2Wrong: 0,
        computeGateScore: false,
      });
      expect(res.rawMarks).toBe(-1); // -3 * 1/3 = -1
    });
  });
});
