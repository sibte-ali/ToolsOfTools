import type { ToolConfig } from '../../lib/engine/types';
import { gcd } from '../../lib/math/fractions';

// Frações: operações e simplificação passo a passo (pt-BR)
export type FracaoOperacao = 'adicao' | 'subtracao' | 'multiplicacao' | 'divisao' | 'simplificar';

export function calcularFracao(
  operacao: FracaoOperacao,
  num1: number, den1: number,
  num2: number, den2: number
): {
  resultado: string;
  decimal: number;
  passos: string[];
  numeradorFinal: number;
  denominadorFinal: number;
} {
  if (den1 === 0 || (operacao !== 'simplificar' && den2 === 0)) {
    throw new Error('O denominador não pode ser zero');
  }

  let resNum: number;
  let resDen: number;
  const passos: string[] = [];

  switch (operacao) {
    case 'simplificar': {
      passos.push(`Fração original: ${num1}/${den1}`);
      const d = gcd(Math.abs(num1), Math.abs(den1));
      passos.push(`MMC de ${Math.abs(num1)} e ${Math.abs(den1)} = ${d}`);
      resNum = num1 / d;
      resDen = den1 / d;
      if (resDen < 0) { resNum = -resNum; resDen = -resDen; }
      passos.push(`Resultado simplificado: ${resNum}/${resDen}`);
      break;
    }
    case 'adicao': {
      passos.push(`${num1}/${den1} + ${num2}/${den2}`);
      const mmc = (Math.abs(den1 * den2)) / gcd(Math.abs(den1), Math.abs(den2));
      resNum = num1 * (mmc / den1) + num2 * (mmc / den2);
      resDen = mmc;
      passos.push(`MMC(${den1}, ${den2}) = ${mmc}`);
      passos.push(`= ${num1 * (mmc / den1)} + ${num2 * (mmc / den2)} = ${resNum}/${resDen}`);
      const dA = gcd(Math.abs(resNum), Math.abs(resDen));
      resNum /= dA; resDen /= dA;
      passos.push(`Simplificado: ${resNum}/${resDen}`);
      break;
    }
    case 'subtracao': {
      passos.push(`${num1}/${den1} - ${num2}/${den2}`);
      const mmc = (Math.abs(den1 * den2)) / gcd(Math.abs(den1), Math.abs(den2));
      resNum = num1 * (mmc / den1) - num2 * (mmc / den2);
      resDen = mmc;
      passos.push(`MMC(${den1}, ${den2}) = ${mmc}`);
      passos.push(`= ${num1 * (mmc / den1)} - ${num2 * (mmc / den2)} = ${resNum}/${resDen}`);
      const dS = gcd(Math.abs(resNum), Math.abs(resDen));
      resNum /= dS; resDen /= dS;
      passos.push(`Simplificado: ${resNum}/${resDen}`);
      break;
    }
    case 'multiplicacao': {
      passos.push(`${num1}/${den1} × ${num2}/${den2}`);
      resNum = num1 * num2;
      resDen = den1 * den2;
      passos.push(`= ${resNum}/${resDen}`);
      const dM = gcd(Math.abs(resNum), Math.abs(resDen));
      resNum /= dM; resDen /= dM;
      passos.push(`Simplificado: ${resNum}/${resDen}`);
      break;
    }
    case 'divisao': {
      if (num2 === 0) throw new Error('Não é possível dividir por zero (numerador da segunda fração)');
      passos.push(`${num1}/${den1} ÷ ${num2}/${den2}`);
      passos.push(`= ${num1}/${den1} × ${den2}/${num2} (inverso)`);
      resNum = num1 * den2;
      resDen = den1 * num2;
      passos.push(`= ${resNum}/${resDen}`);
      const dD = gcd(Math.abs(resNum), Math.abs(resDen));
      resNum /= dD; resDen /= dD;
      if (resDen < 0) { resNum = -resNum; resDen = -resDen; }
      passos.push(`Simplificado: ${resNum}/${resDen}`);
      break;
    }
  }

  const resultado = resDen === 1 ? String(resNum) : `${resNum}/${resDen}`;
  return {
    resultado,
    decimal: resNum / resDen,
    passos,
    numeradorFinal: resNum,
    denominadorFinal: resDen,
  };
}

const config: ToolConfig = {
  id: 'calculadora-de-fracao',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'operacao',
      label: 'Operação',
      type: 'select',
      default: 'adicao',
      options: [
        { label: 'Adição (a/b + c/d)', value: 'adicao' },
        { label: 'Subtração (a/b − c/d)', value: 'subtracao' },
        { label: 'Multiplicação (a/b × c/d)', value: 'multiplicacao' },
        { label: 'Divisão (a/b ÷ c/d)', value: 'divisao' },
        { label: 'Simplificar fração', value: 'simplificar' },
      ],
    },
    { key: 'num1', label: 'Numerador A', type: 'number', min: -9999, max: 9999, step: 1, default: 3 },
    { key: 'den1', label: 'Denominador A', type: 'number', min: -9999, max: 9999, step: 1, default: 4 },
    { key: 'num2', label: 'Numerador B', type: 'number', min: -9999, max: 9999, step: 1, default: 1 },
    { key: 'den2', label: 'Denominador B', type: 'number', min: -9999, max: 9999, step: 1, default: 2 },
  ],
  compute(values) {
    const operacao = String(values.operacao || 'adicao') as FracaoOperacao;
    const num1 = Math.round(Number(values.num1) || 3);
    const den1 = Math.round(Number(values.den1) || 4);
    const num2 = Math.round(Number(values.num2) || 1);
    const den2 = Math.round(Number(values.den2) || 2);
    try {
      const res = calcularFracao(operacao, num1, den1, num2, den2);
      return {
        resultado: res.resultado,
        decimal: +res.decimal.toFixed(8),
        passos: res.passos.join(' → '),
        numeradorFinal: res.numeradorFinal,
        denominadorFinal: res.denominadorFinal,
      };
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Erro de cálculo');
    }
  },
  outputs: [
    { key: 'resultado', label: 'Resultado (fração simplificada)', format: 'text', highlight: true },
    { key: 'decimal', label: 'Equivalente decimal', format: 'number' },
    { key: 'passos', label: 'Passo a passo', format: 'text' },
  ],
};

export const calcularFracaoPtBr = calcularFracao;
export default config;
