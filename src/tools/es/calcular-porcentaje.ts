import type { ToolConfig } from '../../lib/engine/types';

export function calcularPorcentajeEs(mode: string, a: number, b: number) {
  switch (mode) {
    case 'xPorcentDeY': {
      // X% de Y
      const result = (a / 100) * b;
      return {
        resultado: result,
        formula: `${a}% de ${b} = (${a} ÷ 100) × ${b} = ${result.toFixed(4)}`,
        modo: 'X% de Y',
      };
    }
    case 'xEsQuePctDeY': {
      // X es qué % de Y
      if (b === 0) throw new Error('El valor Y no puede ser cero');
      const pct = (a / b) * 100;
      return {
        resultado: pct,
        formula: `${a} es el (${a} ÷ ${b}) × 100 = ${pct.toFixed(4)}% de ${b}`,
        modo: 'X es qué % de Y',
      };
    }
    case 'aumento': {
      // Aumentar X en Y%
      const result = a * (1 + b / 100);
      const increase = result - a;
      return {
        resultado: result,
        aumento: increase,
        formula: `${a} + ${b}% = ${a} × (1 + ${b}/100) = ${result.toFixed(4)}`,
        modo: 'Aumento %',
      };
    }
    case 'descuento': {
      // Descuento de Y% sobre X
      const result = a * (1 - b / 100);
      const saving = a - result;
      return {
        resultado: result,
        ahorro: saving,
        formula: `${a} − ${b}% = ${a} × (1 − ${b}/100) = ${result.toFixed(4)}`,
        modo: 'Descuento %',
      };
    }
    case 'variacion': {
      // Variación porcentual de X a Y
      if (a === 0) throw new Error('El valor inicial no puede ser cero');
      const pct = ((b - a) / Math.abs(a)) * 100;
      const dir = pct >= 0 ? 'aumento' : 'disminución';
      return {
        resultado: pct,
        formula: `((${b} − ${a}) ÷ |${a}|) × 100 = ${pct.toFixed(4)}%`,
        modo: `Variación porcentual (${dir})`,
      };
    }
    default:
      throw new Error('Modo de cálculo no reconocido');
  }
}

const config: ToolConfig = {
  id: 'calcular-porcentaje',
  lang: 'es',
  numberLocale: 'es-ES',
  inputs: [
    {
      key: 'mode',
      label: 'Tipo de cálculo',
      type: 'select',
      default: 'xPorcentDeY',
      options: [
        { label: 'X% de Y (¿cuánto es el X% de Y?)', value: 'xPorcentDeY' },
        { label: 'X es qué % de Y', value: 'xEsQuePctDeY' },
        { label: 'Aumentar X en Y%', value: 'aumento' },
        { label: 'Descuento de Y% sobre X', value: 'descuento' },
        { label: 'Variación porcentual de X a Y', value: 'variacion' },
      ],
    },
    {
      key: 'a',
      label: 'Valor A (X o valor inicial)',
      type: 'number',
      min: -1e9, max: 1e9, step: 0.01, default: 20,
      help: 'Primer valor o porcentaje según el modo seleccionado',
    },
    {
      key: 'b',
      label: 'Valor B (Y o porcentaje)',
      type: 'number',
      min: -1e9, max: 1e9, step: 0.01, default: 350,
      help: 'Segundo valor según el modo seleccionado',
    },
  ],
  compute(values) {
    const mode = String(values.mode || 'xPorcentDeY');
    const a = Number(values.a) || 20;
    const b = Number(values.b) || 350;
    try {
      return calcularPorcentajeEs(mode, a, b);
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Error de cálculo');
    }
  },
  outputs: [
    { key: 'resultado', label: 'Resultado', format: 'number', highlight: true },
    { key: 'formula', label: 'Fórmula paso a paso', format: 'text' },
    { key: 'modo', label: 'Modo de cálculo', format: 'text' },
    { key: 'aumento', label: 'Importe del aumento (€)', format: 'number' },
    { key: 'ahorro', label: 'Ahorro / Descuento (€)', format: 'number' },
  ],
};

export default config;
