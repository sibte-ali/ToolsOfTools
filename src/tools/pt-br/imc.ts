import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import { calculateBmi, getHealthyWeightRange } from '../../lib/health/bmi';

export interface ImcInputPtBr {
  peso: number;
  altura: number;
  idade: number;
  sexo: 'male' | 'female';
}

export const CATEGORIAS_IMC_PT: Array<{ nome: string; min: number; max: number; desc: string }> = [
  { nome: 'Abaixo do peso', min: 0, max: 18.49, desc: 'Abaixo do limiar de massa corporal considerado saudável.' },
  { nome: 'Peso normal', min: 18.5, max: 24.99, desc: 'Peso saudável e adequado para a estatura informada.' },
  { nome: 'Sobrepeso (Pré-obesidade)', min: 25.0, max: 29.99, desc: 'Massa corporal elevada com risco cardiometabólico inicial.' },
  { nome: 'Obesidade Grau I', min: 30.0, max: 34.99, desc: 'Obesidade moderada segundo critérios da Organização Mundial da Saúde.' },
  { nome: 'Obesidade Grau II', min: 35.0, max: 39.99, desc: 'Obesidade severa com indicação de acompanhamento multidisciplinar.' },
  { nome: 'Obesidade Grau III (Mórbida)', min: 40.0, max: 150, desc: 'Obesidade muito severa com elevado risco à saúde.' }
];

export function calcularImcPtBr(input: ImcInputPtBr) {
  const imc = calculateBmi(input.peso, input.altura);
  const faixa = getHealthyWeightRange(input.altura);

  let categoria = CATEGORIAS_IMC_PT[1].nome;
  let descricao = CATEGORIAS_IMC_PT[1].desc;

  for (const c of CATEGORIAS_IMC_PT) {
    if (imc >= c.min && imc <= c.max) {
      categoria = c.nome;
      descricao = c.desc;
      break;
    }
  }

  // Diferença em relação ao peso saudável máximo (IMC 24.9)
  let diferencaPeso = 0;
  let mensagemAjuste = '';
  if (input.peso > faixa.maxKg) {
    diferencaPeso = roundHalfAwayFromZero(input.peso - faixa.maxKg, 1);
    mensagemAjuste = `Para atingir um IMC normal (24,9), você precisa eliminar aproximadamente ${diferencaPeso} kg.`;
  } else if (input.peso < faixa.minKg) {
    diferencaPeso = roundHalfAwayFromZero(faixa.minKg - input.peso, 1);
    mensagemAjuste = `Para atingir o peso mínimo saudável (18,5), você precisa ganhar cerca de ${diferencaPeso} kg.`;
  } else {
    mensagemAjuste = 'Seu peso atual encontra-se dentro da faixa recomendada pela Organização Mundial da Saúde.';
  }

  return {
    imc,
    classificacao: categoria,
    faixaSaudavel: `${faixa.minKg} a ${faixa.maxKg} kg`,
    diferencaPeso,
    mensagemAjuste,
    descricaoClinica: descricao
  };
}

const config: ToolConfig = {
  id: 'imc',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'peso',
      label: 'Seu Peso Atual',
      type: 'number',
      min: 30,
      max: 300,
      step: 0.5,
      default: 70,
      unit: 'kg'
    },
    {
      key: 'altura',
      label: 'Sua Altura',
      type: 'number',
      min: 100,
      max: 230,
      step: 0.5,
      default: 175,
      unit: 'cm'
    },
    {
      key: 'idade',
      label: 'Idade (Adultos a partir de 18 anos)',
      type: 'number',
      min: 18,
      max: 120,
      step: 1,
      default: 28,
      unit: 'anos'
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
    }
  ],
  compute(values) {
    const peso = Number(values.peso) || 70;
    const altura = Number(values.altura) || 175;
    const idade = Number(values.idade) || 28;
    const sexo = (values.sexo as any) || 'male';

    return calcularImcPtBr({ peso, altura, idade, sexo });
  },
  outputs: [
    { key: 'imc', label: 'Índice de Massa Corporal (IMC)', format: 'number', highlight: true },
    { key: 'classificacao', label: 'Classificação OMS / Ministério da Saúde', format: 'text', highlight: true },
    { key: 'faixaSaudavel', label: 'Faixa de Peso Saudável Ideal', format: 'text' },
    { key: 'mensagemAjuste', label: 'Recomendação de Peso', format: 'text' },
    { key: 'descricaoClinica', label: 'Avaliação Clínica', format: 'text' }
  ],
  chart: 'stacked'
};

export default config;
