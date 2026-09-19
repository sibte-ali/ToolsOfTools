import type { ToolConfig } from '../../lib/engine/types';
import { calculatePace, predictRaceTimes, generateSplits } from '../../lib/health/pace';

export interface PaceInputPtBr {
  distanciaPadrao?: 'custom' | '5k' | '10k' | 'half' | 'marathon';
  distanciaCustom?: number;
  unidadeDistancia?: 'km' | 'milhas';
  horas: number;
  minutos: number;
  segundos: number;
}

export function calcularPacePtBr(input: PaceInputPtBr) {
  let distanciaKm = 10;

  switch (input.distanciaPadrao) {
    case '5k':
      distanciaKm = 5.0;
      break;
    case '10k':
      distanciaKm = 10.0;
      break;
    case 'half':
      distanciaKm = 21.0975;
      break;
    case 'marathon':
      distanciaKm = 42.195;
      break;
    default:
      const rawDist = Number(input.distanciaCustom) || 10;
      distanciaKm = input.unidadeDistancia === 'milhas' ? rawDist * 1.609344 : rawDist;
      break;
  }

  const totalSegundos =
    (Number(input.horas) || 0) * 3600 +
    (Number(input.minutos) || 0) * 60 +
    (Number(input.segundos) || 0);

  const res = calculatePace(totalSegundos, distanciaKm);
  const previsoes = predictRaceTimes(res.paceMinPerKm);
  const parciais = generateSplits(distanciaKm, res.paceMinPerKm, 1);

  return {
    ritmoKm: `${res.paceKmFormatted} /km`,
    ritmoMilha: `${res.paceMileFormatted} /milha`,
    velocidadeKmh: res.speedKmh,
    velocidadeMph: res.speedMph,
    previsao5k: previsoes[0]?.timeFormatted || '00:00',
    previsao10k: previsoes[1]?.timeFormatted || '00:00',
    previsaoMeia: previsoes[2]?.timeFormatted || '00:00',
    previsaoMaratona: previsoes[3]?.timeFormatted || '00:00',
    parciais
  };
}

const config: ToolConfig = {
  id: 'calculadora-de-pace',
  lang: 'pt-br',
  numberLocale: 'pt-BR',
  inputs: [
    {
      key: 'distanciaPadrao',
      label: 'Distância da Prova / Treino',
      type: 'select',
      default: '10k',
      options: [
        { label: '5 km (Corrida de rua 5K)', value: '5k' },
        { label: '10 km (Corrida de rua 10K)', value: '10k' },
        { label: 'Meia Maratona (21,1 km)', value: 'half' },
        { label: 'Maratona (42,2 km)', value: 'marathon' },
        { label: 'Distância personalizada', value: 'custom' }
      ]
    },
    {
      key: 'distanciaCustom',
      label: 'Distância personalizada',
      type: 'number',
      min: 0.1,
      max: 500,
      step: 0.1,
      default: 10,
      unit: 'km ou mi',
      help: 'Informe a distância caso selecione a opção personalizada.'
    },
    {
      key: 'unidadeDistancia',
      label: 'Unidade de medida',
      type: 'select',
      default: 'km',
      options: [
        { label: 'Quilômetros (km)', value: 'km' },
        { label: 'Milhas (mi)', value: 'milhas' }
      ]
    },
    {
      key: 'horas',
      label: 'Tempo: Horas',
      type: 'number',
      min: 0,
      max: 99,
      step: 1,
      default: 0,
      unit: 'h'
    },
    {
      key: 'minutos',
      label: 'Tempo: Minutos',
      type: 'number',
      min: 0,
      max: 59,
      step: 1,
      default: 50,
      unit: 'min'
    },
    {
      key: 'segundos',
      label: 'Tempo: Segundos',
      type: 'number',
      min: 0,
      max: 59,
      step: 1,
      default: 0,
      unit: 's'
    }
  ],
  compute(values) {
    const distanciaPadrao = (values.distanciaPadrao as any) || '10k';
    const distanciaCustom = Number(values.distanciaCustom) || 10;
    const unidadeDistancia = (values.unidadeDistancia as any) || 'km';
    const horas = Number(values.horas) || 0;
    const minutos = Number(values.minutos) || 0;
    const segundos = Number(values.segundos) || 0;

    return calcularPacePtBr({ distanciaPadrao, distanciaCustom, unidadeDistancia, horas, minutos, segundos });
  },
  table(values) {
    const res = calcularPacePtBr(values as any);
    return res.parciais.map(p => ({
      'Km': p.splitNumber,
      'Distância': p.distanceFormatted,
      'Tempo da parcial': p.splitTimeFormatted,
      'Tempo acumulado': p.cumulativeTimeFormatted
    }));
  },
  outputs: [
    { key: 'ritmoKm', label: 'Ritmo médio por quilômetro (Pace)', format: 'text', highlight: true },
    { key: 'velocidadeKmh', label: 'Velocidade média (km/h)', format: 'number', highlight: true },
    { key: 'ritmoMilha', label: 'Ritmo por milha', format: 'text' },
    { key: 'previsao5k', label: 'Tempo estimado nos 5 km', format: 'text' },
    { key: 'previsao10k', label: 'Tempo estimado nos 10 km', format: 'text' },
    { key: 'previsaoMeia', label: 'Tempo estimado na Meia Maratona (21k)', format: 'text' },
    { key: 'previsaoMaratona', label: 'Tempo estimado na Maratona (42k)', format: 'text' }
  ],
  chart: 'none'
};

export default config;
