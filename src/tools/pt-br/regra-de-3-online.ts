import type { ToolConfig } from '../../lib/engine/types';

// Regra de três (Rule of Three) — pt-BR
// Simples direta: a/b = c/x → x = b*c/a
// Simples inversa: a*b = c*x → x = a*b/c

export function calcularRegraDeTres(
  tipo: 'direta' | 'inversa',
  a: number, b: number, c: number
): {
  x: number;
  formula: string;
  passos: string[];
  tipo: string;
} {
  if (a === 0) throw new Error('O valor A não pode ser zero');
  const passos: string[] = [];

  if (tipo === 'direta') {
    // A está para B assim como C está para X
    // A/B = C/X  →  X = B × C / A
    passos.push(`Regra de três simples direta:`);
    passos.push(`A está para B assim como C está para X`);
    passos.push(`${a} → ${b}`);
    passos.push(`${c} → X`);
    passos.push(`X = (${b} × ${c}) ÷ ${a}`);
    const x = (b * c) / a;
    passos.push(`X = ${b * c} ÷ ${a} = ${x.toFixed(6)}`);
    return {
      x,
      formula: `X = (B × C) ÷ A = (${b} × ${c}) ÷ ${a}`,
      passos,
      tipo: 'Regra de três simples direta',
    };
  } else {
    // Inversa: quanto mais A, menos X  →  A × B = C × X  →  X = A × B / C
    if (c === 0) throw new Error('O valor C não pode ser zero na regra inversa');
    passos.push(`Regra de três simples inversa:`);
    passos.push(`(grandezas inversamente proporcionais)`);
    passos.push(`${a} → ${b}`);
    passos.push(`${c} → X`);
    passos.push(`A × B = C × X`);
    passos.push(`X = (${a} × ${b}) ÷ ${c}`);
    const x = (a * b) / c;
    passos.push(`X = ${a * b} ÷ ${c} = ${x.toFixed(6)}`);
    return {
      x,
      formula: `X = (A × B) ÷ C = (${a} × ${b}) ÷ ${c}`,
      passos,
      tipo: 'Regra de três simples inversa',
    };
  }
}

const config: ToolConfig = {
  id: 'regra-de-3-online',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'tipo',
      label: 'Tipo de proporcionalidade',
      type: 'select',
      default: 'direta',
      options: [
        { label: 'Direta (mais A → mais X)', value: 'direta' },
        { label: 'Inversa (mais A → menos X)', value: 'inversa' },
      ],
    },
    {
      key: 'a',
      label: 'Valor A (primeira grandeza — referência)',
      type: 'number',
      min: -1e9, max: 1e9, step: 0.001, default: 5,
      help: 'Exemplo: 5 kg de produto',
    },
    {
      key: 'b',
      label: 'Valor B (segunda grandeza — referência)',
      type: 'number',
      min: -1e9, max: 1e9, step: 0.001, default: 20,
      help: 'Exemplo: R$ 20,00',
    },
    {
      key: 'c',
      label: 'Valor C (nova grandeza — desconhecido)',
      type: 'number',
      min: -1e9, max: 1e9, step: 0.001, default: 12,
      help: 'Exemplo: 12 kg → qual o preço?',
    },
  ],
  compute(values) {
    const tipo = String(values.tipo || 'direta') as 'direta' | 'inversa';
    const a = Number(values.a) || 5;
    const b = Number(values.b) || 20;
    const c = Number(values.c) || 12;
    try {
      const res = calcularRegraDeTres(tipo, a, b, c);
      return {
        x: +res.x.toFixed(6),
        formula: res.formula,
        passos: res.passos.join('\n'),
        tipo: res.tipo,
      };
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Erro de cálculo');
    }
  },
  outputs: [
    { key: 'x', label: 'Resultado (X)', format: 'number', highlight: true },
    { key: 'tipo', label: 'Tipo de regra', format: 'text' },
    { key: 'formula', label: 'Fórmula', format: 'text' },
    { key: 'passos', label: 'Passo a passo', format: 'text' },
  ],
};

export default config;
