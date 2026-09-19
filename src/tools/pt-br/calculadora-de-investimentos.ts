import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import ratesData from '../../data/rates.json';

export function calculateInvestimentoBrasil(params: {
  aporteInicial: number;
  aporteMensal: number;
  taxa: number;
  tipoTaxa: 'aa' | 'am';
  prazoMeses: number;
  aplicarIr: boolean;
}) {
  const { aporteInicial, aporteMensal, taxa, tipoTaxa, prazoMeses, aplicarIr } = params;

  // Monthly rate
  const taxaMensalDecimal =
    tipoTaxa === 'aa'
      ? Math.pow(1 + taxa / 100, 1 / 12) - 1
      : taxa / 100;

  let saldo = aporteInicial;
  let totalInvestido = aporteInicial;
  const yearlyRows: {
    ano: number;
    totalInvestido: number;
    rendimentoBruto: number;
    saldoBruto: number;
  }[] = [];


  for (let m = 1; m <= prazoMeses; m++) {
    // Yield on existing balance
    saldo = saldo * (1 + taxaMensalDecimal);
    // Add monthly contribution
    saldo += aporteMensal;
    totalInvestido += aporteMensal;

    if (m % 12 === 0 || m === prazoMeses) {
      const ano = Math.ceil(m / 12);
      const saldoBruto = roundHalfAwayFromZero(saldo, 2);
      const investido = roundHalfAwayFromZero(totalInvestido, 2);
      yearlyRows.push({
        ano,
        totalInvestido: investido,
        rendimentoBruto: roundHalfAwayFromZero(saldoBruto - investido, 2),
        saldoBruto,
      });
    }
  }

  const saldoBruto = roundHalfAwayFromZero(saldo, 2);
  const totalAportado = roundHalfAwayFromZero(totalInvestido, 2);
  const lucroBruto = Math.max(0, roundHalfAwayFromZero(saldoBruto - totalAportado, 2));

  // Tabela Regressiva de IR
  // Até 180 dias (~6 meses): 22.5%
  // De 181 a 360 dias (~12 meses): 20%
  // De 361 a 720 dias (~24 meses): 17.5%
  // Acima de 720 dias (> 24 meses): 15%
  let aliquotaIr = 0;
  if (aplicarIr) {
    if (prazoMeses <= 6) aliquotaIr = 22.5;
    else if (prazoMeses <= 12) aliquotaIr = 20;
    else if (prazoMeses <= 24) aliquotaIr = 17.5;
    else aliquotaIr = 15;
  }

  const valorIr = roundHalfAwayFromZero((lucroBruto * aliquotaIr) / 100, 2);
  const saldoLiquido = roundHalfAwayFromZero(saldoBruto - valorIr, 2);
  const lucroLiquido = roundHalfAwayFromZero(saldoLiquido - totalAportado, 2);

  return {
    saldoBruto,
    saldoLiquido,
    totalAportado,
    lucroBruto,
    lucroLiquido,
    aliquotaIr,
    valorIr,
    yearlyRows,
  };
}

export const config: ToolConfig = {
  id: 'calculadora-de-investimentos',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  currency: 'BRL',
  inputs: [
    {
      key: 'aporteInicial',
      label: 'Aporte Inicial (R$)',
      type: 'number',
      min: 0,
      max: 100000000,
      step: 100,
      default: 5000,
      unit: 'R$',
      help: 'Capital inicial aplicado no primeiro dia',
    },
    {
      key: 'aporteMensal',
      label: 'Aporte Mensal (R$)',
      type: 'number',
      min: 0,
      max: 10000000,
      step: 50,
      default: 500,
      unit: 'R$',
      help: 'Depósito programado todo mês',
    },
    {
      key: 'taxaReferencia',
      label: 'Taxa de Referência do Mercado',
      type: 'select',
      default: 'cdi',
      options: [
        {
          label: `CDI Atual (${ratesData.brazil.cdi.rate}% a.a.)`,
          value: 'cdi',
        },
        {
          label: `Selic Meta (${ratesData.brazil.selic.rate}% a.a.)`,
          value: 'selic',
        },
        {
          label: `Poupança (~${ratesData.brazil.poupanca.annual_equivalent}% a.a.)`,
          value: 'poupanca',
        },
        { label: 'Taxa Personalizada', value: 'custom' },
      ],
      help: 'Taxas oficiais do Banco Central e B3',
    },
    {
      key: 'taxa',
      label: 'Taxa de Juros (%)',
      type: 'number',
      min: 0.1,
      max: 100,
      step: 0.05,
      default: ratesData.brazil.cdi.rate,
      unit: '%',
      help: 'Taxa nominal anual ou mensal informada',
    },
    {
      key: 'tipoTaxa',
      label: 'Periodicidade da Taxa',
      type: 'select',
      default: 'aa',
      options: [
        { label: 'ao ano (% a.a.)', value: 'aa' },
        { label: 'ao mês (% a.m.)', value: 'am' },
      ],
    },
    {
      key: 'prazoMeses',
      label: 'Prazo do Investimento (Meses)',
      type: 'number',
      min: 1,
      max: 600,
      step: 1,
      default: 36,
      unit: 'meses',
      help: 'Duração total em meses (ex: 36 meses = 3 anos)',
    },
    {
      key: 'aplicarIr',
      label: 'Deduzir Imposto de Renda Regressivo?',
      type: 'select',
      default: 'sim',
      options: [
        { label: 'Sim (CDB, Tesouro Direto, LC)', value: 'sim' },
        { label: 'Não (LCI, LCA, Poupança, CRI/CRA isentos)', value: 'nao' },
      ],
      help: 'Aplica a tabela regressiva de 22,5% a 15% sobre os rendimentos',
    },
  ],
  outputs: [
    {
      key: 'saldoLiquido',
      label: 'Valor Total Líquido (no resgate)',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalAportado',
      label: 'Total Investido (Do seu bolso)',
      format: 'currency',
    },
    {
      key: 'lucroLiquido',
      label: 'Rendimento Líquido Ganho',
      format: 'currency',
    },
    {
      key: 'valorIr',
      label: 'Imposto de Renda Retido',
      format: 'currency',
    },
  ],
  compute(values) {
    const aporteInicial = Number(values.aporteInicial) || 0;
    const aporteMensal = Number(values.aporteMensal) || 0;
    const prazoMeses = Number(values.prazoMeses) || 36;
    const tipoTaxa = values.tipoTaxa === 'am' ? 'am' : 'aa';
    const aplicarIr = values.aplicarIr !== 'nao';

    let taxa = Number(values.taxa) || ratesData.brazil.cdi.rate;
    if (values.taxaReferencia === 'selic') taxa = ratesData.brazil.selic.rate;
    else if (values.taxaReferencia === 'cdi') taxa = ratesData.brazil.cdi.rate;
    else if (values.taxaReferencia === 'poupanca') taxa = ratesData.brazil.poupanca.annual_equivalent;

    const res = calculateInvestimentoBrasil({
      aporteInicial,
      aporteMensal,
      taxa,
      tipoTaxa,
      prazoMeses,
      aplicarIr,
    });

    const labels = res.yearlyRows.map((r) => `Ano ${r.ano}`);
    const saldoSeries = res.yearlyRows.map((r) => r.saldoBruto);
    const aporteSeries = res.yearlyRows.map((r) => r.totalInvestido);

    return {
      saldoLiquido: res.saldoLiquido,
      totalAportado: res.totalAportado,
      lucroLiquido: res.lucroLiquido,
      valorIr: res.valorIr,
      chartData: {
        type: 'line',
        labels,
        series: [
          { name: 'Patrimônio Bruto', color: '#10b981', values: saldoSeries },
          { name: 'Total Aportado', color: '#3b82f6', values: aporteSeries },
        ],
      },
    };
  },
  table(values) {
    const aporteInicial = Number(values.aporteInicial) || 0;
    const aporteMensal = Number(values.aporteMensal) || 0;
    const prazoMeses = Number(values.prazoMeses) || 36;
    const tipoTaxa = values.tipoTaxa === 'am' ? 'am' : 'aa';
    const aplicarIr = values.aplicarIr !== 'nao';

    let taxa = Number(values.taxa) || ratesData.brazil.cdi.rate;
    if (values.taxaReferencia === 'selic') taxa = ratesData.brazil.selic.rate;
    else if (values.taxaReferencia === 'cdi') taxa = ratesData.brazil.cdi.rate;
    else if (values.taxaReferencia === 'poupanca') taxa = ratesData.brazil.poupanca.annual_equivalent;

    const res = calculateInvestimentoBrasil({
      aporteInicial,
      aporteMensal,
      taxa,
      tipoTaxa,
      prazoMeses,
      aplicarIr,
    });

    return {
      columns: [
        { key: 'ano', label: 'Ano', format: 'number' },
        { key: 'totalInvestido', label: 'Total Aportado', format: 'currency' },
        { key: 'rendimentoBruto', label: 'Juros Brutos', format: 'currency' },
        { key: 'saldoBruto', label: 'Saldo Acumulado', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default config;
