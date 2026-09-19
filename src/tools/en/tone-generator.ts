import type { ToolConfig } from '../../lib/engine/types';
import { calculateToneInfo } from '../../lib/fun/audio';

export { calculateToneInfo };

const config: ToolConfig = {
  id: 'tone-generator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'frequency',
      label: 'Tone Frequency (Hz)',
      type: 'number',
      min: 20,
      max: 20000,
      step: 1,
      default: 440,
      unit: 'Hz',
    },
    {
      key: 'waveform',
      label: 'Sound Waveform',
      type: 'select',
      options: [
        { label: 'Sine Wave (Pure smooth fundamental tone)', value: 'sine' },
        { label: 'Square Wave (Buzzy, rich odd harmonics)', value: 'square' },
        { label: 'Sawtooth Wave (Crisp, bright full harmonics)', value: 'sawtooth' },
        { label: 'Triangle Wave (Soft, subtle odd harmonics)', value: 'triangle' },
      ],
      default: 'sine',
    },
    {
      key: 'volume',
      label: 'Volume Output (0% - 50% safety limit)',
      type: 'number',
      min: 0,
      max: 50,
      step: 1,
      default: 15,
      unit: '%',
    },
  ],
  compute(values) {
    const freq = Math.min(20000, Math.max(20, Number(values.frequency) || 440));
    const waveform = (['sine', 'square', 'sawtooth', 'triangle'].includes(String(values.waveform))
      ? values.waveform
      : 'sine') as 'sine' | 'square' | 'sawtooth' | 'triangle';
    const volume = Math.min(50, Math.max(0, Number(values.volume) || 15));

    const info = calculateToneInfo(freq, waveform);

    return {
      noteName: info.noteName,
      frequency: info.frequency,
      centsOffset: info.centsOffset,
      wavelengthMeters: +info.wavelengthMeters.toFixed(4),
      periodMs: +info.periodMs.toFixed(3),
      presetMatch: info.presetMatch || 'Custom Pitch',
      hearingSafetyNote: 'Volume capped at 50% max for hearing safety. Start at low levels.',
    };
  },
  outputs: [
    { key: 'noteName', label: 'Closest Musical Pitch', format: 'text', highlight: true },
    { key: 'frequency', label: 'Frequency (Hz)', format: 'number', highlight: true },
    { key: 'centsOffset', label: 'Pitch Deviation (Cents)', format: 'number' },
    { key: 'wavelengthMeters', label: 'Wavelength in Air (meters)', format: 'number' },
    { key: 'periodMs', label: 'Wave Period (ms)', format: 'number' },
    { key: 'presetMatch', label: 'Standard Tuning Preset', format: 'text' },
    { key: 'hearingSafetyNote', label: 'Hearing Safety Advice', format: 'text' },
  ],
};

export default config;
