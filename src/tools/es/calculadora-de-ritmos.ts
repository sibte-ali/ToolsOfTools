import type { ToolConfig } from '../../lib/engine/types';
import { calculatePace, predictRaceTimes, generateSplits } from '../../lib/health/pace';

export interface RitmoInputEs {
  distanciaPreset?: 'custom' | '5k' | '10k' | 'half' | 'marathon';
  distanciaCustom?: number;
  unidadDistancia?: 'km' | 'millas';
  horas: number;
  minutos: number;
  segundos: number;
}

export function calcularRitmoEs(input: RitmoInputEs) {
  let distanciaKm = 10;

  switch (input.distanciaPreset) {
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
      distanciaKm = input.unidadDistancia === 'millas' ? rawDist * 1.609344 : rawDist;
      break;
  }

  const totalSegundos =
    (Number(input.horas) || 0) * 3600 +
    (Number(input.minutos) || 0) * 60 +
    (Number(input.segundos) || 0);

  const res = calculatePace(totalSegundos, distanciaKm);
  const predicciones = predictRaceTimes(res.paceMinPerKm);
  const parciales = generateSplits(distanciaKm, res.paceMinPerKm, 1);

  return {
    ritmoKm: `${res.paceKmFormatted} /km`,
    ritmoMilla: `${res.paceMileFormatted} /milla`,
    velocidadKmh: res.speedKmh,
    velocidadMph: res.speedMph,
    tiempo5k: predicciones[0]?.timeFormatted || '00:00',
    tiempo10k: predicciones[1]?.timeFormatted || '00:00',
    tiempoMedia: predicciones[2]?.timeFormatted || '00:00',
    tiempoMaraton: predicciones[3]?.timeFormatted || '00:00',
    parciales
  };
}

const config: ToolConfig = {
  id: 'calculadora-de-ritmos',
  lang: 'es',
  numberLocale: 'es-ES',
  inputs: [
    {
      key: 'distanciaPreset',
      label: 'Distancia de Competición o Entrenamiento',
      type: 'select',
      default: '10k',
      options: [
        { label: '5 Kilómetros (5K)', value: '5k' },
        { label: '10 Kilómetros (10K)', value: '10k' },
        { label: 'Media Maratón (21,1 km / 13,1 mi)', value: 'half' },
        { label: 'Maratón Completo (42,2 km / 26,2 mi)', value: 'marathon' },
        { label: 'Distancia personalizada', value: 'custom' }
      ]
    },
    {
      key: 'distanciaCustom',
      label: 'Distancia personalizada',
      type: 'number',
      min: 0.1,
      max: 500,
      step: 0.1,
      default: 10,
      unit: 'km o mi',
      help: 'Introduzca la distancia si ha seleccionado "Distancia personalizada".'
    },
    {
      key: 'unidadDistancia',
      label: 'Unidad de longitud',
      type: 'select',
      default: 'km',
      options: [
        { label: 'Kilómetros (km)', value: 'km' },
        { label: 'Millas (mi)', value: 'millas' }
      ]
    },
    {
      key: 'horas',
      label: 'Tiempo: Horas',
      type: 'number',
      min: 0,
      max: 99,
      step: 1,
      default: 0,
      unit: 'h'
    },
    {
      key: 'minutos',
      label: 'Tiempo: Minutos',
      type: 'number',
      min: 0,
      max: 59,
      step: 1,
      default: 50,
      unit: 'min'
    },
    {
      key: 'segundos',
      label: 'Tiempo: Segundos',
      type: 'number',
      min: 0,
      max: 59,
      step: 1,
      default: 0,
      unit: 's'
    }
  ],
  compute(values) {
    const distanciaPreset = (values.distanciaPreset as any) || '10k';
    const distanciaCustom = Number(values.distanciaCustom) || 10;
    const unidadDistancia = (values.unidadDistancia as any) || 'km';
    const horas = Number(values.horas) || 0;
    const minutos = Number(values.minutos) || 0;
    const segundos = Number(values.segundos) || 0;

    return calcularRitmoEs({ distanciaPreset, distanciaCustom, unidadDistancia, horas, minutos, segundos });
  },
  table(values) {
    const res = calcularRitmoEs(values as any);
    return res.parciales.map(p => ({
      'Km': p.splitNumber,
      'Distancia': p.distanceFormatted,
      'Tiempo parcial': p.splitTimeFormatted,
      'Tiempo acumulado': p.cumulativeTimeFormatted
    }));
  },
  outputs: [
    { key: 'ritmoKm', label: 'Ritmo Medio por Kilómetro', format: 'text', highlight: true },
    { key: 'velocidadKmh', label: 'Velocidad Media (km/h)', format: 'number', highlight: true },
    { key: 'ritmoMilla', label: 'Ritmo Medio por Milla', format: 'text' },
    { key: 'tiempo5k', label: 'Tiempo Estimado en 5K', format: 'text' },
    { key: 'tiempo10k', label: 'Tiempo Estimado en 10K', format: 'text' },
    { key: 'tiempoMedia', label: 'Tiempo Estimado en Media Maratón', format: 'text' },
    { key: 'tiempoMaraton', label: 'Tiempo Estimado en Maratón Completo', format: 'text' }
  ],
  chart: 'none'
};

export default config;
