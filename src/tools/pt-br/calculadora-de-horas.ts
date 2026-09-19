import type { ToolConfig } from '../../lib/engine/types';
import { sumSubtractTimes } from '../../lib/dates';

export interface CalculadoraDeHorasInput {
  hora1: string;
  op1: '+' | '-';
  hora2: string;
  op2?: '+' | '-';
  hora3?: string;
  conversaoDecimal?: number;
}

export function calcularHoras(input: CalculadoraDeHorasInput) {
  const entries: Array<{ time: string; op: '+' | '-' }> = [];

  if (input.hora1) {
    entries.push({ time: input.hora1, op: '+' });
  }
  if (input.hora2) {
    entries.push({ time: input.hora2, op: input.op1 || '+' });
  }
  if (input.hora3) {
    entries.push({ time: input.hora3, op: input.op2 || '+' });
  }

  const sumRes = sumSubtractTimes(entries);

  // Conversion of decimal input to HH:MM:SS
  const decVal = Number(input.conversaoDecimal || 0);
  const decSec = Math.round(decVal * 3600);
  const decH = Math.floor(decSec / 3600);
  const decM = Math.floor((decSec % 3600) / 60);
  const decS = decSec % 60;
  const decFormatted = `${String(decH).padStart(2, '0')}:${String(decM).padStart(2, '0')}:${String(decS).padStart(2, '0')}`;

  return {
    resultadoHhMm: sumRes.formattedHhMm,
    resultadoHhMmSs: sumRes.formattedHhMmSs,
    resultadoDecimal: sumRes.decimalHours,
    decimalConvertido: decFormatted,
    segundosTotais: sumRes.totalSeconds,
  };
}

export const calculadoraDeHorasConfig: ToolConfig = {
  id: 'calculadora-de-horas',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'hora1',
      label: 'Primeiro Período de Horas (HH:MM ou HH:MM:SS)',
      type: 'text',
      default: '04:30',
      help: 'Exemplo: 04:30 para 4 horas e 30 minutos',
    },
    {
      key: 'op1',
      label: 'Operação com o segundo valor',
      type: 'select',
      default: '+',
      options: [
        { label: 'Somar (+)', value: '+' },
        { label: 'Subtrair (-)', value: '-' },
      ],
    },
    {
      key: 'hora2',
      label: 'Segundo Período de Horas (HH:MM)',
      type: 'text',
      default: '02:45',
    },
    {
      key: 'op2',
      label: 'Operação com o terceiro valor (opcional)',
      type: 'select',
      default: '+',
      options: [
        { label: 'Somar (+)', value: '+' },
        { label: 'Subtrair (-)', value: '-' },
      ],
    },
    {
      key: 'hora3',
      label: 'Terceiro Período de Horas (opcional)',
      type: 'text',
      default: '01:15',
    },
    {
      key: 'conversaoDecimal',
      label: 'Converter Horas Decimais para HH:MM:SS (Ex: 7.75)',
      type: 'number',
      min: 0,
      max: 100000,
      step: 0.01,
      default: 7.75,
      help: 'Exemplo: 7,75 horas decimais = 07:45:00',
    },
  ],
  compute: (values) => {
    const res = calcularHoras({
      hora1: String(values.hora1 || '04:30'),
      op1: values.op1 as any,
      hora2: String(values.hora2 || '02:45'),
      op2: values.op2 as any,
      hora3: String(values.hora3 || ''),
      conversaoDecimal: Number(values.conversaoDecimal || 7.75),
    });

    return {
      resultadoHhMm: `${res.resultadoHhMm} (${res.resultadoDecimal}h decimais)`,
      resultadoHhMmSs: res.resultadoHhMmSs,
      conversaoDecimalFormatada: `${values.conversaoDecimal || 7.75}h = ${res.decimalConvertido}`,
      segundosTotais: res.segundosTotais,
      resultadoDecimal: res.resultadoDecimal,
    };
  },
  outputs: [
    { key: 'resultadoHhMm', label: 'Resultado da Soma/Subtração (HH:MM)', format: 'text', highlight: true },
    { key: 'resultadoHhMmSs', label: 'Resultado com Segundos (HH:MM:SS)', format: 'text' },
    { key: 'conversaoDecimalFormatada', label: 'Conversão Decimal -> Horas:Min:Seg', format: 'text' },
    { key: 'resultadoDecimal', label: 'Valor em Horas Decimais', format: 'number' },
    { key: 'segundosTotais', label: 'Total em Segundos', format: 'number' },
  ],
};
