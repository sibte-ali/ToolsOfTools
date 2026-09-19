import { describe, it, expect } from 'vitest';
import { calculateEstToIst, estToIstConfig } from './en/est-to-ist';
import { calculateCstToIst, cstToIstConfig } from './en/cst-to-ist-converter';
import { calculate10amGmtToIst, tenAmGmtToIstConfig } from './en/10am-gmt-to-ist';
import { calculateDayCalculator, dayCalculatorConfig } from './en/day-calculator';
import { calculateDob, dobCalculatorConfig } from './en/dob-calculator';
import { calculateWorkExperience, experienceCalculatorConfig } from './en/experience-calculator';
import { calculateProductShelfLife, shelfLifeCalculatorConfig } from './en/shelf-life-calculator';

import { calcularContadorDeDias, contadorDeDiasConfig } from './pt-br/contador-de-dias';
import { calcularHorasTrabalhadas, calculadoraDeHorasTrabalhadasConfig } from './pt-br/calculadora-de-horas-trabalhadas';
import { calcularEntreDatas, calculadoraEntreDatasConfig } from './pt-br/calculadora-entre-datas';
import { calcularHoras, calculadoraDeHorasConfig } from './pt-br/calculadora-de-horas';

function runCompute(config: any, inputOverrides: Record<string, any> = {}) {
  const inputs: Record<string, any> = {};
  for (const inp of config.inputs) {
    inputs[inp.key] = inp.default;
  }
  return config.compute({ ...inputs, ...inputOverrides });
}

describe('Batch D: Date & Time Tools (Vitest Known-Answer Tests)', () => {
  // 1. EST to IST
  describe('est-to-ist', () => {
    // Benchmark: IANA Time Zone Database (tzdb 2024b).
    // In winter standard time (EST, UTC-5), difference to IST (UTC+5:30) is +10:30.
    // 10:00 AM EST -> 20:30 IST (8:30 PM).
    it('accurately converts 10:00 AM EST (winter) to 20:30 IST (benchmark: IANA tzdb)', () => {
      const res = calculateEstToIst({
        date: '2024-01-15',
        time: '10:00',
        direction: 'est_to_ist',
      });
      expect(res.targetTime).toBe('20:30');
      expect(res.differenceHours).toBe(10.5);
      expect(res.isSourceDst).toBe(false);

      const computed = runCompute(estToIstConfig, { date: '2024-01-15', time: '10:00' });
      expect(computed.targetTime).toBe('20:30');
    });

    // Benchmark: IANA tzdb 2024b. In summer daylight time (EDT, UTC-4), difference to IST is +9:30.
    // 14:00 (2:00 PM) EDT -> 23:30 IST (11:30 PM).
    it('accurately converts 14:00 EDT (summer) to 23:30 IST (benchmark: IANA tzdb)', () => {
      const res = calculateEstToIst({
        date: '2024-07-20',
        time: '14:00',
        direction: 'est_to_ist',
      });
      expect(res.targetTime).toBe('23:30');
      expect(res.differenceHours).toBe(9.5);
      expect(res.isSourceDst).toBe(true);
    });
  });

  // 2. CST to IST
  describe('cst-to-ist-converter', () => {
    // Benchmark: IANA tzdb 2024b.
    // In winter standard time (CST, UTC-6), difference to IST (UTC+5:30) is +11:30.
    // 09:00 AM CST -> 20:30 IST (8:30 PM).
    it('converts winter 09:00 AM CST to 20:30 IST (benchmark: IANA tzdb)', () => {
      const res = calculateCstToIst({
        date: '2024-02-10',
        time: '09:00',
        direction: 'cst_to_ist',
      });
      expect(res.targetTime).toBe('20:30');
      expect(res.differenceHours).toBe(11.5);
      expect(res.isSourceDst).toBe(false);
    });

    // Benchmark: IANA tzdb 2024b. In summer daylight time (CDT, UTC-5), difference to IST is +10:30.
    // 10:00 AM CDT -> 20:30 IST (8:30 PM).
    it('converts summer 10:00 AM CDT to 20:30 IST (benchmark: IANA tzdb)', () => {
      const res = calculateCstToIst({
        date: '2024-08-15',
        time: '10:00',
        direction: 'cst_to_ist',
      });
      expect(res.targetTime).toBe('20:30');
      expect(res.differenceHours).toBe(10.5);
      expect(res.isSourceDst).toBe(true);
    });
  });

  // 3. 10am GMT to IST
  describe('10am-gmt-to-ist', () => {
    // Benchmark: Greenwich Mean Time standard UTC+0 to India Standard Time UTC+5:30.
    // 10:00 AM GMT -> 15:30 (3:30 PM) IST.
    it('converts 10:00 GMT to 15:30 IST (benchmark: BIPM UTC standard)', () => {
      const res = calculate10amGmtToIst({ time: '10:00' });
      expect(res.targetTime).toBe('15:30');
      expect(res.differenceHours).toBe(5.5);

      const computed = runCompute(tenAmGmtToIstConfig, { time: '10:00' });
      expect(computed.convertedIstTime).toBe('15:30');
    });

    // Benchmark: 22:30 GMT -> +5:30 -> 04:00 (+1 day) IST
    it('converts late evening GMT to next morning IST with day roll', () => {
      const res = calculate10amGmtToIst({ time: '22:30' });
      expect(res.targetTime).toBe('04:00');
    });
  });

  // 4. Day Calculator
  describe('day-calculator', () => {
    // Benchmark: US Naval Observatory calendar reckoning.
    // Leap year 2024: 2024-01-01 to 2024-12-31 has 365 days (exclusive) or 366 days (inclusive).
    it('counts 366 days for full leap year 2024 inclusive (benchmark: USNO calendar)', () => {
      const resExclusive = calculateDayCalculator({
        mode: 'diff',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        inclusive: 'no',
      });
      expect(resExclusive.detailCalendarDays).toBe(365);

      const resInclusive = calculateDayCalculator({
        mode: 'diff',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        inclusive: 'yes',
      });
      expect(resInclusive.detailCalendarDays).toBe(366);
    });

    // Benchmark: ISO weekday reckoning. 2000-01-01 was Saturday.
    it('identifies weekday of given historical date correctly', () => {
      const res = calculateDayCalculator({
        mode: 'weekday',
        startDate: '2000-01-01',
      });
      expect(res.resultMain.toLowerCase()).toBe('saturday');
    });
  });

  // 5. DOB Calculator
  describe('dob-calculator', () => {
    // Benchmark: Exactly 24 years, 5 months, 0 days from 2000-01-01 to 2024-06-01.
    it('calculates exact age breakdown and weekday of birth (benchmark: Gregorian calendar)', () => {
      const res = calculateDob({
        dob: '2000-01-01',
        asOfDate: '2024-06-01',
      });
      expect(res.years).toBe(24);
      expect(res.months).toBe(5);
      expect(res.days).toBe(0);
      expect(res.dayOfWeekBorn.toLowerCase()).toBe('saturday');
    });

    // Benchmark: Next birthday countdown from 2024-06-01 to 2025-01-01 is 214 days.
    it('calculates days remaining until next birthday', () => {
      const res = calculateDob({
        dob: '2000-01-01',
        asOfDate: '2024-06-01',
      });
      expect(res.nextBirthdayDays).toBe(214);
      expect(res.nextBirthdayDate).toBe('2025-01-01');
    });
  });

  // 6. Experience Calculator
  describe('experience-calculator', () => {
    // Benchmark: Role 1: 2019-01-01 to 2020-01-01 (1 year); Role 2: 2020-01-01 to 2021-01-01 (1 year).
    // Total contiguous experience = 2.0 years.
    it('calculates multi-role experience without gaps (benchmark: standard HR tenure calculation)', () => {
      const res = calculateWorkExperience({
        job1Start: '2019-01-01',
        job1End: '2020-01-01',
        job2Start: '2020-01-01',
        job2End: '2021-01-01',
        deduplicateOverlaps: 'yes',
      });
      expect(res.totalYears).toBe(2);
      expect(res.totalMonths).toBe(0);
      expect(res.overallDecimalYears).toBeCloseTo(2.0, 1);
    });

    // Benchmark: Overlapping roles. Role 1 (2020-2022 = 2y), Role 2 (2021-2023 = 2y).
    // Deduplicated span is 2020 to 2023 = 3 years. Non-deduplicated is 4 years.
    it('deduplicates overlapping employment spans', () => {
      const dedup = calculateWorkExperience({
        job1Start: '2020-01-01',
        job1End: '2022-01-01',
        job2Start: '2021-01-01',
        job2End: '2023-01-01',
        deduplicateOverlaps: 'yes',
      });
      expect(dedup.totalYears).toBe(3);

      const nonDedup = calculateWorkExperience({
        job1Start: '2020-01-01',
        job1End: '2022-01-01',
        job2Start: '2021-01-01',
        job2End: '2023-01-01',
        deduplicateOverlaps: 'no',
      });
      expect(nonDedup.totalYears).toBe(4);
    });
  });

  // 7. Shelf Life Calculator
  describe('shelf-life-calculator', () => {
    // Benchmark: Mfg 2024-01-01 + 12 months = Expiry 2025-01-01. As of 2024-06-01 -> 214 days left.
    it('computes expiry date and remaining days (benchmark: FDA/USDA shelf life guide)', () => {
      const res = calculateProductShelfLife({
        mfgDate: '2024-01-01',
        shelfVal: 12,
        shelfUnit: 'months',
        asOfDate: '2024-06-01',
      });
      expect(res.expiryDate).toBe('2025-01-01');
      expect(res.daysRemaining).toBe(214);
      expect(res.status).toBe('fresh');
    });

    // Benchmark: Expired product detection
    it('flags product as expired when reference date exceeds expiry date', () => {
      const res = calculateProductShelfLife({
        mfgDate: '2023-01-01',
        shelfVal: 6,
        shelfUnit: 'months',
        asOfDate: '2024-01-01',
      });
      expect(res.expiryDate).toBe('2023-07-01');
      expect(res.daysRemaining).toBeLessThan(0);
      expect(res.status).toBe('expired');
    });
  });

  // 8. Contador de Dias (pt-br)
  describe('contador-de-dias (pt-br)', () => {
    // Benchmark: Dias entre 01/01/2024 e 15/01/2024. Exclusivo = 14 dias, Inclusivo = 15 dias.
    it('calcula dias corridos e úteis entre duas datas (benchmark: calendário gregoriano)', () => {
      const res = calcularContadorDeDias({
        modo: 'entre_datas',
        dataInicio: '2024-01-01',
        dataFim: '2024-01-15',
        incluirUltimoDia: 'nao',
      });
      expect(res.diasCorridos).toBe(14);
      expect(res.diasUteis).toBe(10);
    });

    // Benchmark: Somar 45 dias a 2024-01-01 resulta em 2024-02-15.
    it('soma dias a uma data base com precisão de calendário', () => {
      const res = calcularContadorDeDias({
        modo: 'somar_subtrair',
        dataInicio: '2024-01-01',
        operacao: 'somar',
        diasParaModificar: 45,
        incluirUltimoDia: 'nao',
      });
      expect(res.resultadoPrincipal).toBe('2024-02-15');
    });
  });

  // 9. Calculadora de Horas Trabalhadas (pt-br)
  describe('calculadora-de-horas-trabalhadas (pt-br)', () => {
    // Benchmark: CLT Art. 58 e 59 (Brasil).
    // Turno 1: 08:00 - 12:00 (4h) | Almoço: 1h | Turno 2: 13:00 - 18:00 (5h) = 9h totais.
    // Jornada padrão de 8h -> 8h normais e 1h extra.
    it('calcula horas normais e horas extras conforme CLT Brasil (Art. 58/59)', () => {
      const res = calcularHorasTrabalhadas({
        entrada1: '08:00',
        saida1: '12:00',
        intervalo1: 60,
        entrada2: '13:00',
        saida2: '18:00',
        jornadaPadrao: 8,
        diasNoPeriodo: 1,
      });
      expect(res.diaTotalHhMm).toBe('09:00');
      expect(res.diaTotalDecimal).toBe(9.0);
      expect(res.diaNormalHhMm).toBe('08:00');
      expect(res.diaExtraHhMm).toBe('01:00');
      expect(res.diaExtraDecimal).toBe(1.0);
    });

    // Benchmark: Semana completa de 5 dias idênticos: 45h totais, 40h normais, 5h extras.
    it('projeta acúmulo semanal com horas extras consolidadas', () => {
      const res = calcularHorasTrabalhadas({
        entrada1: '08:00',
        saida1: '12:00',
        intervalo1: 60,
        entrada2: '13:00',
        saida2: '18:00',
        jornadaPadrao: 8,
        diasNoPeriodo: 5,
      });
      expect(res.periodoTotalHhMm).toBe('45:00');
      expect(res.periodoTotalDecimal).toBe(45.0);
      expect(res.periodoExtraHhMm).toBe('05:00');
    });
  });

  // 10. Calculadora Entre Datas (pt-br)
  describe('calculadora-entre-datas (pt-br)', () => {
    // Benchmark: 2023-01-01 até 2024-07-15 = 1 ano, 6 meses, 14 dias (561 dias corridos).
    it('desmembra intervalo exato em anos, meses e dias (benchmark: calendário gregoriano)', () => {
      const res = calcularEntreDatas({
        operacao: 'diferenca',
        data1: '2023-01-01',
        data2: '2024-07-15',
      });
      expect(res.anos).toBe(1);
      expect(res.meses).toBe(6);
      expect(res.dias).toBe(14);
      expect(res.totalDias).toBe(561);
    });

    // Benchmark: Subtrair 1 ano, 2 meses e 5 dias de 2024-05-15 resulta em 2023-03-10.
    it('subtrai período de anos, meses e dias com exatidão', () => {
      const res = calcularEntreDatas({
        operacao: 'subtrair',
        data1: '2024-05-15',
        anos: 1,
        meses: 2,
        dias: 5,
      });
      expect(res.resultadoPrincipal).toBe('2023-03-10');
    });
  });

  // 11. Calculadora de Horas (pt-br)
  describe('calculadora-de-horas (pt-br)', () => {
    // Benchmark: 04:30 + 02:45 - 01:15 = 06:00 (6.00 horas decimais).
    it('soma e subtrai múltiplos blocos de horas e minutos com precisão', () => {
      const res = calcularHoras({
        hora1: '04:30',
        op1: '+',
        hora2: '02:45',
        op2: '-',
        hora3: '01:15',
        conversaoDecimal: 7.75,
      });
      expect(res.resultadoHhMm).toBe('06:00');
      expect(res.resultadoDecimal).toBe(6.0);
    });

    // Benchmark: Conversão decimal: 7,75 horas = 7 horas e 45 minutos (07:45:00).
    it('converte horas decimais em formato sexagesimal HH:MM:SS', () => {
      const res = calcularHoras({
        hora1: '01:00',
        op1: '+',
        hora2: '01:00',
        conversaoDecimal: 7.75,
      });
      expect(res.decimalConvertido).toBe('07:45:00');
    });
  });
});
