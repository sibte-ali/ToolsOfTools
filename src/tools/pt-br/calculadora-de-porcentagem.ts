import type { ToolConfig } from '../../lib/engine/types';

export function calcularPorcentagemPtBr(mode: string, a: number, b: number) {
  switch (mode) {
    case 'xPorcentDeY': {
      const result = (a / 100) * b;
      return {
        resultado: result,
        formula: `${a}% de ${b} = (${a} ÷ 100) × ${b} = ${result.toFixed(4)}`,
        modo: 'X% de Y',
      };
    }
    case 'xEQuePctDeY': {
      if (b === 0) throw new Error('O valor Y não pode ser zero');
      const pct = (a / b) * 100;
      return {
        resultado: pct,
        formula: `${a} é (${a} ÷ ${b}) × 100 = ${pct.toFixed(4)}% de ${b}`,
        modo: 'X é quantos % de Y',
      };
    }
    case 'aumento': {
      const result = a * (1 + b / 100);
      return {
        resultado: result,
        diferenca: result - a,
        formula: `${a} + ${b}% = ${a} × (1 + ${b}/100) = ${result.toFixed(4)}`,
        modo: 'Aumento %',
      };
    }
    case 'desconto': {
      const result = a * (1 - b / 100);
      return {
        resultado: result,
        diferenca: a - result,
        formula: `${a} − ${b}% = ${a} × (1 − ${b}/100) = ${result.toFixed(4)}`,
        modo: 'Desconto %',
      };
    }
    case 'variacao': {
      if (a === 0) throw new Error('O valor inicial não pode ser zero');
      const pct = ((b - a) / Math.abs(a)) * 100;
      return {
        resultado: pct,
        formula: `((${b} − ${a}) ÷ |${a}|) × 100 = ${pct.toFixed(4)}%`,
        modo: 'Variação percentual',
      };
    }
    default:
      throw new Error('Modo não reconhecido');
  }
}

const config: ToolConfig = {
  id: 'calculadora-de-porcentagem',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'mode',
      label: 'Tipo de cálculo',
      type: 'select',
      default: 'xPorcentDeY',
      options: [
        { label: 'X% de Y (qual o valor de X% de Y?)', value: 'xPorcentDeY' },
        { label: 'X é quantos % de Y?', value: 'xEQuePctDeY' },
        { label: 'Aumentar X em Y%', value: 'aumento' },
        { label: 'Desconto de Y% sobre X', value: 'desconto' },
        { label: 'Variação percentual de X para Y', value: 'variacao' },
      ],
    },
    { key: 'a', label: 'Valor A (X)', type: 'number', min: -1e9, max: 1e9, step: 0.01, default: 15 },
    { key: 'b', label: 'Valor B (Y ou %)', type: 'number', min: -1e9, max: 1e9, step: 0.01, default: 200 },
  ],
  compute(values) {
    const mode = String(values.mode || 'xPorcentDeY');
    const a = Number(values.a) || 15;
    const b = Number(values.b) || 200;
    try {
      return calcularPorcentagemPtBr(mode, a, b);
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Erro de cálculo');
    }
  },
  outputs: [
    { key: 'resultado', label: 'Resultado', format: 'number', highlight: true },
    { key: 'formula', label: 'Fórmula (passo a passo)', format: 'text' },
    { key: 'modo', label: 'Tipo de cálculo', format: 'text' },
    { key: 'diferenca', label: 'Diferença / Desconto', format: 'number' },
  ],
};

export default config;
