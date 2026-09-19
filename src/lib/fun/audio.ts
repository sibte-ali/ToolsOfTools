/**
 * Acoustic & musical computations for the Tone Generator.
 */

export interface ToneInfo {
  frequency: number;
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  noteName: string;
  octave: number;
  centsOffset: number;
  wavelengthMeters: number;
  speedOfSoundMs: number;
  periodMs: number;
  presetMatch?: string;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TONE_PRESETS: Array<{ label: string; frequency: number; description: string }> = [
  { label: 'A440 (Concert Pitch)', frequency: 440, description: 'Standard orchestral tuning pitch adopted internationally.' },
  { label: 'Middle C (C4)', frequency: 261.63, description: 'Central reference note in piano literature and music theory.' },
  { label: '1000 Hz (1 kHz)', frequency: 1000, description: 'Industry calibration reference for audio engineering and broadcasts.' },
  { label: '432 Hz (Verdi Tuning)', frequency: 432, description: 'Alternative philosophical concert pitch favored in acoustic circles.' },
  { label: '528 Hz (Transformation)', frequency: 528, description: 'Popular meditation and Solfeggio acoustic frequency.' },
  { label: '100 Hz (Sub-Bass Test)', frequency: 100, description: 'Low-frequency test for subwoofers and room resonance.' },
  { label: '10,000 Hz (10 kHz Treble)', frequency: 10000, description: 'High-frequency fidelity check for tweeters and hearing range.' },
];

/**
 * Calculate musical and acoustic properties of any frequency (20 Hz - 20,000 Hz).
 */
export function calculateToneInfo(
  frequency: number,
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine',
  temperatureCelsius = 20
): ToneInfo {
  if (frequency < 1 || frequency > 24000) {
    throw new Error('Frequency must be between 1 Hz and 24,000 Hz.');
  }

  // Speed of sound in dry air: v ≈ 331.3 + 0.606 * T
  const speedOfSound = 331.3 + 0.606 * temperatureCelsius;
  const wavelengthMeters = speedOfSound / frequency;
  const periodMs = (1 / frequency) * 1000;

  // MIDI note calculation relative to A4 (MIDI note 69, 440 Hz)
  // noteNumber = 69 + 12 * log2(f / 440)
  const midiExact = 69 + 12 * (Math.log(frequency / 440) / Math.log(2));
  const midiRound = Math.round(midiExact);
  const centsOffset = Math.round((midiExact - midiRound) * 100);

  const noteIndex = ((midiRound % 12) + 12) % 12;
  const octave = Math.floor(midiRound / 12) - 1;
  const noteName = `${NOTE_NAMES[noteIndex]}${octave}`;

  const preset = TONE_PRESETS.find((p) => Math.abs(p.frequency - frequency) < 0.1);

  return {
    frequency,
    waveform,
    noteName,
    octave,
    centsOffset,
    wavelengthMeters,
    speedOfSoundMs: speedOfSound,
    periodMs,
    presetMatch: preset?.label,
  };
}
