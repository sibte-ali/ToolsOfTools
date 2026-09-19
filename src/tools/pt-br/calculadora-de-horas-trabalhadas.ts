import type { ToolConfig } from '../../lib/engine/types';
import { calculateWorkHours, type WorkShift } from '../../lib/dates';

export interface HorasTrabalhadasInput {
  entrada1: string;
  saida1: string;
  intervalo1: number;
  entrada2?: string;
  saida2?: string;
  intervalo2?: number;
  jornadaPadrao: number;
  diasNoPeriodo: number;
}

export function calcularHorasTrabalhadas(input: HorasTrabalhadasInput) {
  const shifts: WorkShift[] = [];

  const hasSecondShift = Boolean(input.entrada2 && input.saida2 && input.entrada2.trim() !== '' && input.saida2.trim() !== '');

  if (input.entrada1 && input.saida1) {
    // If there is a second shift (e.g. 08:00-12:00 and 13:00-18:00), the lunch break is already between 12:00 and 13:00.
    // If only one shift is entered (e.g. 08:00 to 18:00), intervalo1 is the lunch break.
    const breakMins = hasSecondShift ? Number(input.intervalo1 || 0) : Number(input.intervalo1 || 0);
    shifts.push({
      entry: input.entrada1,
      exit: input.saida1,
      breakMinutes: hasSecondShift ? 0 : breakMins,
    });
  }

  if (hasSecondShift && input.entrada2 && input.saida2) {
    shifts.push({
      entry: input.entrada2,
      exit: input.saida2,
      breakMinutes: Number(input.intervalo2 || 0),
    });
  }

  const jornada = Number(input.jornadaPadrao || 8);
  const dias = Number(input.diasNoPeriodo || 1);

  // Daily calculation
  const res = calculateWorkHours(shifts, jornada);

  // Scaled for multi-day period (e.g. week of 5 days or month of 22 days)
  const totalMinsPeriod = res.totalMinutes * dias;
  const regularMinsPeriod = Math.min(totalMinsPeriod, jornada * 60 * dias);
  const extraMinsPeriod = Math.max(0, totalMinsPeriod - regularMinsPeriod);

  const toHhMm = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return {
    diaTotalHhMm: res.totalHhMm,
    diaTotalDecimal: res.totalDecimal,
    diaNormalHhMm: res.regularHhMm,
    diaExtraHhMm: res.overtimeHhMm,
    diaExtraDecimal: res.overtimeDecimal,
    periodoTotalHhMm: toHhMm(totalMinsPeriod),
    periodoTotalDecimal: Math.round((totalMinsPeriod / 60) * 100) / 100,
    periodoExtraHhMm: toHhMm(extraMinsPeriod),
    periodoExtraDecimal: Math.round((extraMinsPeriod / 60) * 100) / 100,
  };
}

export const calculadoraDeHorasTrabalhadasConfig: ToolConfig = {
  id: 'calculadora-de-horas-trabalhadas',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'entrada1',
      label: 'Entrada Turno 1 (HH:MM)',
      type: 'text',
      default: '08:00',
    },
    {
      key: 'saida1',
      label: 'Saída Turno 1 (HH:MM)',
      type: 'text',
      default: '12:00',
    },
    {
      key: 'intervalo1',
      label: 'Almoço / Intervalo entre turnos (minutos)',
      type: 'number',
      min: 0,
      max: 300,
      default: 60,
    },
    {
      key: 'entrada2',
      label: 'Entrada Turno 2 (HH:MM)',
      type: 'text',
      default: '13:00',
    },
    {
      key: 'saida2',
      label: 'Saída Turno 2 (HH:MM)',
      type: 'text',
      default: '18:00',
    },
    {
      key: 'jornadaPadrao',
      label: 'Jornada diária contratual CLT (horas)',
      type: 'number',
      min: 1,
      max: 12,
      default: 8,
      help: 'Padrão CLT: 8 horas diárias e 44 horas semanais.',
    },
    {
      key: 'diasNoPeriodo',
      label: 'Repetir para quantos dias (1=dia único, 5=semana, 22=mês)?',
      type: 'number',
      min: 1,
      max: 31,
      default: 1,
    },
  ],
  compute: (values) => {
    const res = calcularHorasTrabalhadas({
      entrada1: String(values.entrada1 || '08:00'),
      saida1: String(values.saida1 || '12:00'),
      intervalo1: Number(values.intervalo1 || 60),
      entrada2: String(values.entrada2 || '13:00'),
      saida2: String(values.saida2 || '18:00'),
      jornadaPadrao: Number(values.jornadaPadrao || 8),
      diasNoPeriodo: Number(values.diasNoPeriodo || 1),
    });

    return {
      totalDiario: `${res.diaTotalHhMm} (${res.diaTotalDecimal}h decimais)`,
      horasExtras: `${res.diaExtraHhMm} (${res.diaExtraDecimal}h extras)`,
      horasNormais: res.diaNormalHhMm,
      totalPeriodo: `${res.periodoTotalHhMm} (${res.periodoTotalDecimal}h totais)`,
      extraPeriodo: `${res.periodoExtraHhMm} (${res.periodoExtraDecimal}h extras)`,
    };
  },
  outputs: [
    { key: 'totalDiario', label: 'Horas Trabalhadas no Dia', format: 'text', highlight: true },
    { key: 'horasExtras', label: 'Horas Extras no Dia', format: 'text', highlight: true },
    { key: 'horasNormais', label: 'Horas Normais (Jornada Padrão)', format: 'text' },
    { key: 'totalPeriodo', label: 'Total Acumulado no Período', format: 'text' },
    { key: 'extraPeriodo', label: 'Total de Horas Extras no Período', format: 'text' },
  ],
};
