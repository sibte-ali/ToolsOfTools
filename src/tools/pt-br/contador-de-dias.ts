import type { ToolConfig } from '../../lib/engine/types';
import {
  daysBetween,
  businessDaysBetween,
  addPeriod,
  calendarDiff,
  getWeekdayInfo,
} from '../../lib/dates';

export interface ContadorDeDiasInput {
  modo: 'entre_datas' | 'contagem_regressiva' | 'somar_subtrair';
  dataInicio: string;
  dataFim?: string;
  incluirUltimoDia: 'sim' | 'nao';
  operacao?: 'somar' | 'subtrair';
  diasParaModificar?: number;
}

export function calcularContadorDeDias(input: ContadorDeDiasInput) {
  const dInicio = input.dataInicio || '2024-01-01';
  const isInclusive = input.incluirUltimoDia === 'sim';

  if (input.modo === 'somar_subtrair') {
    const qtd = Number(input.diasParaModificar || 30);
    const sign = input.operacao === 'subtrair' ? -1 : 1;
    const dataCalculada = addPeriod(dInicio, { days: qtd * sign });
    const diaSemana = getWeekdayInfo(dataCalculada, 'pt-br');

    return {
      modo: 'somar_subtrair',
      resultadoPrincipal: dataCalculada,
      detalhe: `Cai em uma ${diaSemana.name}`,
      diasCorridos: qtd,
      diasUteis: Math.abs(businessDaysBetween(dInicio, dataCalculada)),
      resumo: `${input.operacao === 'subtrair' ? 'Subtraídos' : 'Somados'} ${qtd} dias da data inicial`,
    };
  }

  const dFim = input.dataFim || '2024-12-31';
  const diasCorridos = Math.abs(daysBetween(dInicio, dFim, isInclusive));
  const diasUteis = Math.abs(businessDaysBetween(dInicio, dFim, isInclusive));
  const diff = calendarDiff(dInicio, dFim);

  if (input.modo === 'contagem_regressiva') {
    return {
      modo: 'contagem_regressiva',
      resultadoPrincipal: `${diasCorridos} dias restantes`,
      detalhe: `${diasUteis} dias úteis até a data limite`,
      diasCorridos,
      diasUteis,
      resumo: `Equivale a ${Math.abs(diff.months)} meses e ${Math.abs(diff.days)} dias`,
    };
  }

  return {
    modo: 'entre_datas',
    resultadoPrincipal: `${diasCorridos} dias corridos`,
    detalhe: `${diasUteis} dias úteis (segunda a sexta)`,
    diasCorridos,
    diasUteis,
    resumo: `${Math.abs(diff.years)} anos, ${Math.abs(diff.months)} meses e ${Math.abs(diff.days)} dias`,
  };
}

export const contadorDeDiasConfig: ToolConfig = {
  id: 'contador-de-dias',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'modo',
      label: 'Finalidade do Cálculo',
      type: 'select',
      default: 'entre_datas',
      options: [
        { label: 'Dias entre duas datas', value: 'entre_datas' },
        { label: 'Contagem regressiva até data futura', value: 'contagem_regressiva' },
        { label: 'Somar ou subtrair dias de uma data', value: 'somar_subtrair' },
      ],
    },
    {
      key: 'dataInicio',
      label: 'Data Inicial (ou Data Base)',
      type: 'date',
      default: '2024-01-01',
    },
    {
      key: 'dataFim',
      label: 'Data Final (para intervalo ou contagem)',
      type: 'date',
      default: '2024-12-31',
    },
    {
      key: 'incluirUltimoDia',
      label: 'Incluir a data final no cálculo?',
      type: 'select',
      default: 'nao',
      options: [
        { label: 'Não (exclusivo - contagem padrão)', value: 'nao' },
        { label: 'Sim (inclusivo - conta o primeiro e o último dia)', value: 'sim' },
      ],
    },
    {
      key: 'operacao',
      label: 'Operação (ao somar/subtrair)',
      type: 'select',
      default: 'somar',
      options: [
        { label: 'Somar dias (+)', value: 'somar' },
        { label: 'Subtrair dias (-)', value: 'subtrair' },
      ],
    },
    {
      key: 'diasParaModificar',
      label: 'Quantidade de dias a adicionar/remover',
      type: 'number',
      min: 0,
      max: 100000,
      default: 30,
    },
  ],
  compute: (values) => {
    const res = calcularContadorDeDias({
      modo: values.modo as any,
      dataInicio: String(values.dataInicio || '2024-01-01'),
      dataFim: String(values.dataFim || '2024-12-31'),
      incluirUltimoDia: values.incluirUltimoDia as any,
      operacao: values.operacao as any,
      diasParaModificar: Number(values.diasParaModificar || 30),
    });

    return {
      resultadoPrincipal: res.resultadoPrincipal,
      detalhe: res.detalhe,
      resumo: res.resumo,
      diasCorridos: res.diasCorridos,
      diasUteis: res.diasUteis,
    };
  },
  outputs: [
    { key: 'resultadoPrincipal', label: 'Resultado Principal', format: 'text', highlight: true },
    { key: 'detalhe', label: 'Detalhe do Intervalo', format: 'text' },
    { key: 'resumo', label: 'Resumo por Extenso', format: 'text' },
    { key: 'diasCorridos', label: 'Total de Dias Corridos', format: 'number' },
    { key: 'diasUteis', label: 'Total de Dias Úteis', format: 'number' },
  ],
};
