import type { ToolConfig } from '../../lib/engine/types';
import { calculateMifflinStJeor, type Gender } from '../../lib/health/bmr';
import { calculateTdee, type ActivityLevel } from '../../lib/health/tdee';
import { calculateBodyweightMacros } from '../../lib/health/macros';

export interface CaloriasInputPtBr {
  sexo: Gender;
  idade: number;
  peso: number;
  altura: number;
  nivelAtividade: ActivityLevel;
  objetivo: 'manter' | 'perda_leve' | 'emagrecer' | 'perda_rapida' | 'ganho_leve' | 'hipertrofia';
}

export function calcularCaloriasPtBr(input: CaloriasInputPtBr) {
  const tmb = calculateMifflinStJeor(input.sexo, input.peso, input.altura, input.idade);
  const get = calculateTdee(tmb, input.nivelAtividade);

  let metaCalorica = get;
  let descricaoObjetivo = 'Manutenção do Peso Atual';

  switch (input.objetivo) {
    case 'perda_leve':
      metaCalorica = Math.max(1200, get - 250);
      descricaoObjetivo = 'Emagrecimento Leve (-0,25 kg/semana)';
      break;
    case 'emagrecer':
      metaCalorica = Math.max(1200, get - 500);
      descricaoObjetivo = 'Perda de Gordura Padrão (-0,5 kg/semana)';
      break;
    case 'perda_rapida':
      metaCalorica = Math.max(1000, get - 1000);
      descricaoObjetivo = 'Déficit Agressivo (-1,0 kg/semana)';
      break;
    case 'ganho_leve':
      metaCalorica = get + 250;
      descricaoObjetivo = 'Ganho de Massa Gradual (+0,25 kg/semana)';
      break;
    case 'hipertrofia':
      metaCalorica = get + 500;
      descricaoObjetivo = 'Hipertrofia Muscular (+0,5 kg/semana)';
      break;
    default:
      metaCalorica = get;
      descricaoObjetivo = 'Manutenção do Peso Atual';
      break;
  }

  // Divisão de macronutrientes padrão no Brasil (2g/kg proteína, 25% gordura, restante carboidrato)
  const macros = calculateBodyweightMacros(metaCalorica, input.peso, 2.0, 25);

  return {
    tmb,
    get,
    metaCalorica,
    descricaoObjetivo,
    proteinasG: macros.proteinGrams,
    carboidratosG: macros.carbGrams,
    gordurasG: macros.fatGrams,
    proteinasKcal: macros.proteinKcal,
    carboidratosKcal: macros.carbKcal,
    gordurasKcal: macros.fatKcal
  };
}

const config: ToolConfig = {
  id: 'calculadora-de-calorias',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
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
      default: 28,
      unit: 'anos'
    },
    {
      key: 'peso',
      label: 'Peso Atual',
      type: 'number',
      min: 30,
      max: 250,
      step: 0.5,
      default: 72,
      unit: 'kg'
    },
    {
      key: 'altura',
      label: 'Altura',
      type: 'number',
      min: 100,
      max: 230,
      step: 0.5,
      default: 175,
      unit: 'cm'
    },
    {
      key: 'nivelAtividade',
      label: 'Nível de Atividade Física',
      type: 'select',
      default: 'moderate',
      options: [
        { label: 'Sedentário (trabalho de escritório, quase nenhum exercício)', value: 'sedentary' },
        { label: 'Leve (treinos leves 1 a 3 dias por semana)', value: 'light' },
        { label: 'Moderado (exercícios moderados 3 a 5 dias por semana)', value: 'moderate' },
        { label: 'Intenso (treinos pesados 6 a 7 dias por semana)', value: 'active' },
        { label: 'Muito Intenso (atleta profissional ou trabalho braçal pesado)', value: 'very_active' }
      ]
    },
    {
      key: 'objetivo',
      label: 'Objetivo Corporal',
      type: 'select',
      default: 'emagrecer',
      options: [
        { label: 'Manter o peso atual', value: 'manter' },
        { label: 'Emagrecimento suave (-250 kcal/dia)', value: 'perda_leve' },
        { label: 'Queima de gordura padrão (-500 kcal/dia)', value: 'emagrecer' },
        { label: 'Déficit calórico acelerado (-1000 kcal/dia)', value: 'perda_rapida' },
        { label: 'Ganho limpo de peso (+250 kcal/dia)', value: 'ganho_leve' },
        { label: 'Hipertrofia muscular (+500 kcal/dia)', value: 'hipertrofia' }
      ]
    }
  ],
  compute(values) {
    const sexo = (values.sexo as Gender) || 'male';
    const idade = Number(values.idade) || 28;
    const peso = Number(values.peso) || 72;
    const altura = Number(values.altura) || 175;
    const nivelAtividade = (values.nivelAtividade as ActivityLevel) || 'moderate';
    const objetivo = (values.objetivo as any) || 'emagrecer';

    return calcularCaloriasPtBr({ sexo, idade, peso, altura, nivelAtividade, objetivo });
  },
  outputs: [
    { key: 'metaCalorica', label: 'Meta Calórica Diária Recomendada (kcal)', format: 'number', highlight: true },
    { key: 'get', label: 'Gasto Energético Total Diário (GET / TDEE)', format: 'number' },
    { key: 'tmb', label: 'Taxa Metabólica Basal (TMB)', format: 'number' },
    { key: 'descricaoObjetivo', label: 'Estratégia Selecionada', format: 'text' },
    { key: 'proteinasG', label: 'Proteínas Sugeridas (g/dia)', format: 'number' },
    { key: 'carboidratosG', label: 'Carboidratos Sugeridos (g/dia)', format: 'number' },
    { key: 'gordurasG', label: 'Gorduras Boas (g/dia)', format: 'number' }
  ],
  chart: 'stacked'
};

export default config;
