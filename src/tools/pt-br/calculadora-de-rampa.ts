import type { ToolConfig } from '../../lib/engine/types';

/**
 * Calculadora de Rampa — pt-BR
 * NBR 9050:2020 (ABNT) limits:
 *  - Ramps in public buildings: max inclinação 8.33% (1:12), max length per segment 9m, max height 1.5m
 *  - Inclinação between 6.25% and 8.33% requires special handrail
 *  Source: ABNT NBR 9050:2020 Seção 6.6
 */

export interface RampaResult {
  inclinacaoPct: number;
  inclinacaoGraus: number;
  comprimentoRampa: number;  // length (hypotenuse) in meters
  rise: number;
  run: number;
  status: 'adequado' | 'atencao' | 'excedido';
  statusMensagem: string;
  relacao: string;
}

export function calcularRampa(riseM: number, runM: number): RampaResult {
  if (runM <= 0) throw new Error('A extensão horizontal (projeção) deve ser maior que zero');
  const inclinacaoPct = (riseM / runM) * 100;
  const inclinacaoGraus = Math.atan(riseM / runM) * (180 / Math.PI);
  const comprimentoRampa = Math.sqrt(riseM * riseM + runM * runM);
  const relacao = `1:${(runM / riseM).toFixed(2)}`;

  let status: RampaResult['status'];
  let statusMensagem: string;

  if (inclinacaoPct <= 5) {
    status = 'adequado';
    statusMensagem = `✅ Inclinação de ${inclinacaoPct.toFixed(2)}% — dentro do limite ideal (≤ 5%).`;
  } else if (inclinacaoPct <= 8.33) {
    status = 'atencao';
    statusMensagem = `⚠️ Inclinação de ${inclinacaoPct.toFixed(2)}% — entre 5% e 8,33%. Permitida em casos excepcionais com corrimão obrigatório (NBR 9050:2020 §6.6.3).`;
  } else {
    status = 'excedido';
    statusMensagem = `🔴 Inclinação de ${inclinacaoPct.toFixed(2)}% — EXCEDE o limite máximo de 8,33% (1:12) da NBR 9050:2020 para rampas acessíveis.`;
  }

  return {
    inclinacaoPct: +inclinacaoPct.toFixed(3),
    inclinacaoGraus: +inclinacaoGraus.toFixed(3),
    comprimentoRampa: +comprimentoRampa.toFixed(3),
    rise: riseM,
    run: runM,
    status,
    statusMensagem,
    relacao,
  };
}

const config: ToolConfig = {
  id: 'calculadora-de-rampa',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'rise',
      label: 'Desnível (altura H)',
      type: 'number',
      min: 0.001, max: 100, step: 0.01, default: 0.5,
      unit: 'm',
      help: 'Diferença de altura entre o início e o fim da rampa',
    },
    {
      key: 'run',
      label: 'Projeção horizontal (comprimento L)',
      type: 'number',
      min: 0.001, max: 1000, step: 0.01, default: 6,
      unit: 'm',
      help: 'Distância horizontal entre o início e o fim da rampa (projeção)',
    },
  ],
  compute(values) {
    const rise = Math.max(0.001, Number(values.rise) || 0.5);
    const run = Math.max(0.001, Number(values.run) || 6);
    try {
      return calcularRampa(rise, run);
    } catch (e) {
      return new Error(e instanceof Error ? e.message : 'Erro de cálculo');
    }
  },
  outputs: [
    { key: 'inclinacaoPct', label: 'Inclinação (%)', format: 'number', highlight: true },
    { key: 'inclinacaoGraus', label: 'Ângulo (graus °)', format: 'number', highlight: true },
    { key: 'comprimentoRampa', label: 'Comprimento real da rampa (m)', format: 'number' },
    { key: 'relacao', label: 'Relação desnível:comprimento', format: 'text' },
    { key: 'statusMensagem', label: 'Status NBR 9050:2020', format: 'text' },
  ],
};

export const calcularRampaPtBr = calcularRampa;
export default config;
