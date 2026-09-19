import type { ToolConfig } from '../../lib/engine/types';
import { calculateBodyweightMacros, splitMacrosAcrossMeals } from '../../lib/health/macros';

export interface MacrosInputPtBr {
  caloriasTotais: number;
  pesoKg: number;
  proteinaGPorKg: number;
  gorduraPct: number;
  refeicoesAoDia: number;
}

export function calcularMacrosPtBr(input: MacrosInputPtBr) {
  const { caloriasTotais, pesoKg, proteinaGPorKg, gorduraPct, refeicoesAoDia } = input;

  const macros = calculateBodyweightMacros(caloriasTotais, pesoKg, proteinaGPorKg, gorduraPct);
  const refeicoes = splitMacrosAcrossMeals(macros, refeicoesAoDia);

  return {
    proteinasTotais: macros.proteinGrams,
    carboidratosTotais: macros.carbGrams,
    gordurasTotais: macros.fatGrams,
    proteinasKcal: macros.proteinKcal,
    carboidratosKcal: macros.carbKcal,
    gordurasKcal: macros.fatKcal,
    proteinaPorRefeicao: refeicoes[0]?.proteinGrams || 0,
    carboidratoPorRefeicao: refeicoes[0]?.carbGrams || 0,
    gorduraPorRefeicao: refeicoes[0]?.fatGrams || 0,
    caloriasPorRefeicao: refeicoes[0]?.calories || 0,
    refeicoes
  };
}

const config: ToolConfig = {
  id: 'calculadora-de-macros',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'caloriasTotais',
      label: 'Meta de Calorias Diárias (kcal)',
      type: 'number',
      min: 1000,
      max: 6000,
      step: 50,
      default: 2200,
      unit: 'kcal',
      help: 'Sua ingestão calórica diária total planejada.'
    },
    {
      key: 'pesoKg',
      label: 'Peso Corporal Atual',
      type: 'number',
      min: 30,
      max: 250,
      step: 0.5,
      default: 75,
      unit: 'kg'
    },
    {
      key: 'proteinaGPorKg',
      label: 'Meta de Proteína por Quilo',
      type: 'select',
      default: '2.0',
      options: [
        { label: '1,6 g/kg (Manutenção / Sedentário)', value: '1.6' },
        { label: '1,8 g/kg (Treinamento moderado)', value: '1.8' },
        { label: '2,0 g/kg (Hipertrofia / Musculação padrão)', value: '2.0' },
        { label: '2,2 g/kg (Cutting / Definição com preservação muscular)', value: '2.2' }
      ]
    },
    {
      key: 'gorduraPct',
      label: 'Gorduras da Dieta (% do total calórico)',
      type: 'select',
      default: '25',
      options: [
        { label: '20% (Dieta mais baixa em gorduras)', value: '20' },
        { label: '25% (Equilibrado para saúde hormonal)', value: '25' },
        { label: '30% (Dieta rica em ácidos graxos bons)', value: '30' }
      ]
    },
    {
      key: 'refeicoesAoDia',
      label: 'Número de Refeições Diárias',
      type: 'select',
      default: '4',
      options: [
        { label: '3 refeições ao dia (Café, Almoço, Jantar)', value: '3' },
        { label: '4 refeições ao dia (Café, Almoço, Lanche, Jantar)', value: '4' },
        { label: '5 refeições ao dia', value: '5' },
        { label: '6 refeições ao dia', value: '6' }
      ]
    }
  ],
  compute(values) {
    const caloriasTotais = Number(values.caloriasTotais) || 2200;
    const pesoKg = Number(values.pesoKg) || 75;
    const proteinaGPorKg = Number(values.proteinaGPorKg) || 2.0;
    const gorduraPct = Number(values.gorduraPct) || 25;
    const refeicoesAoDia = Number(values.refeicoesAoDia) || 4;

    return calcularMacrosPtBr({ caloriasTotais, pesoKg, proteinaGPorKg, gorduraPct, refeicoesAoDia });
  },
  table(values) {
    const res = calcularMacrosPtBr(values as any);
    return res.refeicoes.map(r => ({
      'Refeição': `Refeição ${r.mealNumber}`,
      'Proteína (g)': `${r.proteinGrams} g`,
      'Carboidrato (g)': `${r.carbGrams} g`,
      'Gordura (g)': `${r.fatGrams} g`,
      'Calorias (kcal)': `${r.calories} kcal`
    }));
  },
  outputs: [
    { key: 'proteinasTotais', label: 'Proteínas Diárias (g)', format: 'number', highlight: true },
    { key: 'carboidratosTotais', label: 'Carboidratos Diários (g)', format: 'number', highlight: true },
    { key: 'gordurasTotais', label: 'Gorduras Diárias (g)', format: 'number', highlight: true },
    { key: 'proteinaPorRefeicao', label: 'Proteína por Refeição (g)', format: 'number' },
    { key: 'carboidratoPorRefeicao', label: 'Carboidrato por Refeição (g)', format: 'number' },
    { key: 'gorduraPorRefeicao', label: 'Gordura por Refeição (g)', format: 'number' },
    { key: 'caloriasPorRefeicao', label: 'Calorias por Prato (kcal)', format: 'number' }
  ],
  chart: 'stacked'
};

export default config;
