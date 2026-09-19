import type { ToolConfig } from '../../lib/engine/types';
import {
  calendarDiff,
  daysBetween,
  businessDaysBetween,
  addPeriod,
  getWeekdayInfo,
} from '../../lib/dates';

export interface CalculadoraEntreDatasInput {
  operacao: 'diferenca' | 'adicionar' | 'subtrair';
  data1: string;
  data2?: string;
  anos?: number;
  meses?: number;
  dias?: number;
}

export function calcularEntreDatas(input: CalculadoraEntreDatasInput) {
  const d1 = input.data1 || '2024-01-01';

  if (input.operacao === 'adicionar' || input.operacao === 'subtrair') {
    const sign = input.operacao === 'subtrair' ? -1 : 1;
    const a = Number(input.anos || 0) * sign;
    const m = Number(input.meses || 0) * sign;
    const d = Number(input.dias || 0) * sign;

    const dataFinal = addPeriod(d1, { years: a, months: m, days: d });
    const diaSemana = getWeekdayInfo(dataFinal, 'pt-br');

    return {
      operacao: input.operacao,
      resultadoPrincipal: dataFinal,
      resumo: `Cai em uma ${diaSemana.name}`,
      anos: Math.abs(Number(input.anos || 0)),
      meses: Math.abs(Number(input.meses || 0)),
      dias: Math.abs(Number(input.dias || 0)),
      totalDias: Math.abs(daysBetween(d1, dataFinal)),
      totalSemanas: Math.floor(Math.abs(daysBetween(d1, dataFinal)) / 7),
    };
  }

  const d2 = input.data2 || '2025-06-15';
  const diff = calendarDiff(d1, d2);
  const diasCorridos = Math.abs(diff.totalDays);
  const semanas = Math.abs(diff.totalWeeks);
  const diasUteis = Math.abs(businessDaysBetween(d1, d2));

  return {
    operacao: 'diferenca',
    resultadoPrincipal: `${Math.abs(diff.years)} anos, ${Math.abs(diff.months)} meses e ${Math.abs(diff.days)} dias`,
    resumo: `${diasCorridos} dias corridos (${semanas} semanas completas)`,
    anos: Math.abs(diff.years),
    meses: Math.abs(diff.months),
    dias: Math.abs(diff.days),
    totalDias: diasCorridos,
    totalSemanas: semanas,
    diasUteis,
  };
}

export const calculadoraEntreDatasConfig: ToolConfig = {
  id: 'calculadora-entre-datas',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'operacao',
      label: 'Operação Desejada',
      type: 'select',
      default: 'diferenca',
      options: [
        { label: 'Calcular diferença entre duas datas', value: 'diferenca' },
        { label: 'Adicionar período a uma data (+)', value: 'adicionar' },
        { label: 'Subtrair período de uma data (-)', value: 'subtrair' },
      ],
    },
    {
      key: 'data1',
      label: 'Data Inicial / Data Base',
      type: 'date',
      default: '2024-01-01',
    },
    {
      key: 'data2',
      label: 'Data Final (para diferença entre datas)',
      type: 'date',
      default: '2025-06-15',
    },
    {
      key: 'anos',
      label: 'Anos a somar/subtrair',
      type: 'number',
      min: 0,
      max: 1000,
      default: 1,
    },
    {
      key: 'meses',
      label: 'Meses a somar/subtrair',
      type: 'number',
      min: 0,
      max: 1200,
      default: 6,
    },
    {
      key: 'dias',
      label: 'Dias a somar/subtrair',
      type: 'number',
      min: 0,
      max: 100000,
      default: 15,
    },
  ],
  compute: (values) => {
    const res = calcularEntreDatas({
      operacao: values.operacao as any,
      data1: String(values.data1 || '2024-01-01'),
      data2: String(values.data2 || '2025-06-15'),
      anos: Number(values.anos || 0),
      meses: Number(values.meses || 0),
      dias: Number(values.dias || 0),
    });

    return {
      resultadoPrincipal: res.resultadoPrincipal,
      resumo: res.resumo,
      totalDias: res.totalDias,
      totalSemanas: res.totalSemanas,
    };
  },
  outputs: [
    { key: 'resultadoPrincipal', label: 'Resultado do Período', format: 'text', highlight: true },
    { key: 'resumo', label: 'Total de Dias e Semanas', format: 'text' },
    { key: 'totalDias', label: 'Total em Dias Corridos', format: 'number' },
    { key: 'totalSemanas', label: 'Total em Semanas Corridas', format: 'number' },
  ],
};
