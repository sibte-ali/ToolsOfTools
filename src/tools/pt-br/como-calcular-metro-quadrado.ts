import type { ToolConfig } from '../../lib/engine/types';

/**
 * Calculadora de metro quadrado — área de superfícies (pt-BR)
 * NBR standards for flooring: typically add 10% for rectangles, 15% for complex shapes.
 * Source: ABNT NBR 13271 (ceramic tiles application).
 */
export type FormaMetroQuadrado = 'retangulo' | 'triangulo' | 'circulo' | 'lShape';

export function calcularMetroQuadrado(
  forma: FormaMetroQuadrado,
  dims: Record<string, number>,
  perdaPct: number,
  m2PorCaixa: number
) {
  let areaM2 = 0;
  switch (forma) {
    case 'retangulo':
      areaM2 = dims.comprimento * dims.largura;
      break;
    case 'triangulo':
      areaM2 = 0.5 * dims.base * dims.altura;
      break;
    case 'circulo':
      areaM2 = Math.PI * Math.pow(dims.raio, 2);
      break;
    case 'lShape':
      // L-shape: two rectangles A and B
      areaM2 = dims.a1 * dims.b1 + dims.a2 * dims.b2;
      break;
  }

  const perdaFator = 1 + perdaPct / 100;
  const areaComPerda = areaM2 * perdaFator;
  const caixasNecessarias = m2PorCaixa > 0 ? Math.ceil(areaComPerda / m2PorCaixa) : null;

  return {
    areaM2: +areaM2.toFixed(4),
    areaComPerda: +areaComPerda.toFixed(4),
    perdaPct,
    areaM2Perda: +(areaComPerda - areaM2).toFixed(4),
    caixasNecessarias,
  };
}

const config: ToolConfig = {
  id: 'como-calcular-metro-quadrado',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'forma',
      label: 'Forma da área',
      type: 'select',
      default: 'retangulo',
      options: [
        { label: 'Retângulo / Quadrado', value: 'retangulo' },
        { label: 'Triângulo', value: 'triangulo' },
        { label: 'Círculo', value: 'circulo' },
        { label: 'Formato L (dois retângulos)', value: 'lShape' },
      ],
    },
    { key: 'comprimento', label: 'Comprimento (retângulo)', type: 'number', min: 0, step: 0.01, default: 4, unit: 'm' },
    { key: 'largura', label: 'Largura (retângulo)', type: 'number', min: 0, step: 0.01, default: 3, unit: 'm' },
    { key: 'base', label: 'Base (triângulo)', type: 'number', min: 0, step: 0.01, default: 4, unit: 'm' },
    { key: 'altura', label: 'Altura (triângulo)', type: 'number', min: 0, step: 0.01, default: 3, unit: 'm' },
    { key: 'raio', label: 'Raio (círculo)', type: 'number', min: 0, step: 0.01, default: 2, unit: 'm' },
    { key: 'a1', label: 'Comprimento do bloco A (formato L)', type: 'number', min: 0, step: 0.01, default: 5, unit: 'm' },
    { key: 'b1', label: 'Largura do bloco A (formato L)', type: 'number', min: 0, step: 0.01, default: 3, unit: 'm' },
    { key: 'a2', label: 'Comprimento do bloco B (formato L)', type: 'number', min: 0, step: 0.01, default: 2, unit: 'm' },
    { key: 'b2', label: 'Largura do bloco B (formato L)', type: 'number', min: 0, step: 0.01, default: 2, unit: 'm' },
    {
      key: 'perdaPct',
      label: 'Perda para piso/azulejo (%)',
      type: 'number',
      min: 0, max: 50, step: 1, default: 10,
      unit: '%',
      help: 'Recomendado: 10% para piso cerâmico reto, 15% para diagonal ou formatos complexos. (ABNT NBR 13271)',
    },
    {
      key: 'm2PorCaixa',
      label: 'Área por caixa de piso/azulejo (m²)',
      type: 'number',
      min: 0, max: 100, step: 0.01, default: 2,
      unit: 'm²/cx',
      help: 'Deixe em 0 para não calcular caixas',
    },
  ],
  compute(values) {
    const forma = String(values.forma || 'retangulo') as FormaMetroQuadrado;
    const dims: Record<string, number> = {
      comprimento: Number(values.comprimento) || 4,
      largura: Number(values.largura) || 3,
      base: Number(values.base) || 4,
      altura: Number(values.altura) || 3,
      raio: Number(values.raio) || 2,
      a1: Number(values.a1) || 5,
      b1: Number(values.b1) || 3,
      a2: Number(values.a2) || 2,
      b2: Number(values.b2) || 2,
    };
    return calcularMetroQuadrado(
      forma, dims,
      Number(values.perdaPct) || 10,
      Number(values.m2PorCaixa) || 2
    );
  },
  outputs: [
    { key: 'areaM2', label: 'Área total (m²)', format: 'number', highlight: true },
    { key: 'areaComPerda', label: 'Área com perda incluída (m²)', format: 'number', highlight: true },
    { key: 'caixasNecessarias', label: 'Caixas necessárias (aprox.)', format: 'number' },
    { key: 'areaM2Perda', label: 'Margem de perda (m²)', format: 'number' },
  ],
};

export default config;
