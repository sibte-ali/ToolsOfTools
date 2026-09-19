import type { ToolConfig } from '../../lib/engine/types';
import { calculateMifflinStJeor, calculateHarrisBenedict, type Gender, type BmrFormula } from '../../lib/health/bmr';
import { calculateTdee, type ActivityLevel } from '../../lib/health/tdee';

export interface TdeeInputPtBr {
  formula: BmrFormula;
  sexo: Gender;
  peso: number;
  altura: number;
  idade: number;
  nivelAtividade: ActivityLevel;
}

export function calcularTdeePtBr(input: TdeeInputPtBr) {
  let tmb = 0;
  if (input.formula === 'harris_benedict') {
    tmb = calculateHarrisBenedict(input.sexo, input.peso, input.altura, input.idade);
  } else {
    tmb = calculateMifflinStJeor(input.sexo, input.peso, input.altura, input.idade);
  }

  const tdee = calculateTdee(tmb, input.nivelAtividade);

  return {
    tmb,
    tdee,
    metaPerdaLeve: Math.max(1200, tdee - 250),
    metaEmagrecer: Math.max(1200, tdee - 500),
    metaGanhoLeve: tdee + 250,
    metaHipertrofia: tdee + 500,
    formulaUtilizada: input.formula === 'harris_benedict' ? 'Harris-Benedict (1984)' : 'Mifflin-St Jeor (1990)'
  };
}

const config: ToolConfig = {
  id: 'tdee-calculator',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'formula',
      label: 'Fórmula de Taxa Metabólica',
      type: 'select',
      default: 'mifflin',
      options: [
        { label: 'Mifflin-St Jeor (Padrão ouro moderno)', value: 'mifflin' },
        { label: 'Harris-Benedict Revisada (Roza & Shizgal 1984)', value: 'harris_benedict' }
      ]
    },
    {
      key: 'sexo',
      label: 'Sexo Biológico',
      type: 'select',
      default: 'male',
      options: [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' }
      ]
    },
    {
      key: 'idade',
      label: 'Idade',
      type: 'number',
      min: 15,
      max: 100,
      step: 1,
      default: 30,
      unit: 'anos'
    },
    {
      key: 'peso',
      label: 'Peso Corporal',
      type: 'number',
      min: 30,
      max: 250,
      step: 0.5,
      default: 75,
      unit: 'kg'
    },
    {
      key: 'altura',
      label: 'Estatura',
      type: 'number',
      min: 100,
      max: 230,
      step: 0.5,
      default: 178,
      unit: 'cm'
    },
    {
      key: 'nivelAtividade',
      label: 'Frequência de Atividade Física Semanal',
      type: 'select',
      default: 'moderate',
      options: [
        { label: 'Sedentário (pouco ou nenhum exercício, trabalho sentado)', value: 'sedentary' },
        { label: 'Leve (1 a 3 dias de atividade moderada)', value: 'light' },
        { label: 'Moderado (3 a 5 dias de musculação ou aeróbio)', value: 'moderate' },
        { label: 'Muito ativo (6 a 7 dias de treinos intensos)', value: 'active' },
        { label: 'Extremamente ativo (atletas de elite ou dois treinos ao dia)', value: 'very_active' }
      ]
    }
  ],
  compute(values) {
    const formula = (values.formula as BmrFormula) || 'mifflin';
    const sexo = (values.sexo as Gender) || 'male';
    const idade = Number(values.idade) || 30;
    const peso = Number(values.peso) || 75;
    const altura = Number(values.altura) || 178;
    const nivelAtividade = (values.nivelAtividade as ActivityLevel) || 'moderate';

    return calcularTdeePtBr({ formula, sexo, idade, peso, altura, nivelAtividade });
  },
  outputs: [
    { key: 'tdee', label: 'TDEE / Gasto Energético Total Diário (kcal)', format: 'number', highlight: true },
    { key: 'tmb', label: 'Taxa Metabólica Basal (TMB / BMR)', format: 'number' },
    { key: 'metaEmagrecer', label: 'Meta de Déficit para Emagrecer (-500 kcal)', format: 'number' },
    { key: 'metaHipertrofia', label: 'Meta de Superávit para Ganhar Massa (+500 kcal)', format: 'number' },
    { key: 'formulaUtilizada', label: 'Equação de Referência Aplicada', format: 'text' }
  ],
  chart: 'none'
};

export default config;
