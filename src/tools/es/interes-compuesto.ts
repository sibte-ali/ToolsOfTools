import type { ToolConfig } from '../../lib/engine/types';
import { calculateCompoundInterest } from '../../lib/finance/compound';

export const interesCompuestoConfig: ToolConfig = {
  id: 'interes-compuesto',
  lang: 'es',
  numberLocale: 'es-ES',
  currency: 'EUR',
  inputs: [
    {
      key: 'capital',
      label: 'Capital inicial (€)',
      type: 'number',
      min: 0, max: 1_000_000_000, step: 100, default: 10000,
      unit: '€',
    },
    {
      key: 'tasa',
      label: 'Tasa de interés anual (%)',
      type: 'number',
      min: 0.1, max: 50, step: 0.1, default: 6,
      unit: '%',
    },
    {
      key: 'anos',
      label: 'Período (años)',
      type: 'number',
      min: 1, max: 50, step: 1, default: 10,
      unit: 'años',
    },
    {
      key: 'periodicidad',
      label: 'Periodicidad de capitalización',
      type: 'select',
      default: 'annual',
      options: [
        { label: 'Anual (1 vez/año)', value: 'annual' },
        { label: 'Semestral (2 veces/año)', value: 'semi-annual' },
        { label: 'Trimestral (4 veces/año)', value: 'quarterly' },
        { label: 'Mensual (12 veces/año)', value: 'monthly' },
        { label: 'Diaria (365 veces/año)', value: 'daily' },
      ],
    },
    {
      key: 'aportacionMensual',
      label: 'Aportación mensual adicional (€)',
      type: 'number',
      min: 0, max: 1_000_000, step: 50, default: 0,
      unit: '€',
      help: 'Importe que aportas cada mes de forma adicional al capital inicial.',
    },
  ],
  compute(values) {
    const capital = Number(values.capital) || 10000;
    const tasa = Number(values.tasa) || 6;
    const anos = Number(values.anos) || 10;
    const periodicidad = String(values.periodicidad || 'annual');
    const aportacion = Number(values.aportacionMensual) || 0;

    const res = calculateCompoundInterest(capital, tasa, anos, periodicidad, aportacion);
    return {
      capitalFinal: res.futureValue,
      interesesGenerados: res.totalInterestEarned,
      totalInvertido: capital + res.totalContributions,
      rentabilidad: res.totalInterestEarned / (capital + res.totalContributions) * 100,
    };
  },
  outputs: [
    { key: 'capitalFinal', label: 'Capital final acumulado (€)', format: 'currency', highlight: true },
    { key: 'interesesGenerados', label: 'Intereses generados (€)', format: 'currency', highlight: true },
    { key: 'totalInvertido', label: 'Total invertido (€)', format: 'currency' },
    { key: 'rentabilidad', label: 'Rentabilidad total (%)', format: 'percent' },
  ],
  table(values) {
    const capital = Number(values.capital) || 10000;
    const tasa = Number(values.tasa) || 6;
    const anos = Number(values.anos) || 10;
    const periodicidad = String(values.periodicidad || 'annual');
    const aportacion = Number(values.aportacionMensual) || 0;
    const res = calculateCompoundInterest(capital, tasa, anos, periodicidad, aportacion);
    return {
      columns: [
        { key: 'year', label: 'Año', format: 'number' },
        { key: 'openingBalance', label: 'Saldo inicial (€)', format: 'currency' },
        { key: 'interestEarned', label: 'Intereses del año (€)', format: 'currency' },
        { key: 'closingBalance', label: 'Saldo final (€)', format: 'currency' },
      ],
      rows: res.yearlyRows,
    };
  },
  chart: 'line',
};

export default interesCompuestoConfig;
