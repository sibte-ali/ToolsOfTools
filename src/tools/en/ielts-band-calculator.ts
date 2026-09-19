import type { ToolConfig } from '../../lib/engine/types';
import ieltsData from '../../data/ielts-bands.json';

export function getBandFromRaw(raw: number, table: { min: number; max: number; band: number }[]): number {
  const score = Math.max(0, Math.min(40, Math.round(raw)));
  for (const entry of table) {
    if (score >= entry.min && score <= entry.max) {
      return entry.band;
    }
  }
  return 3.0;
}

export function roundIeltsOverallBand(mean: number): number {
  const base = Math.floor(mean);
  const fraction = mean - base;

  if (fraction < 0.25) {
    return base;
  } else if (fraction < 0.75) {
    return base + 0.5;
  } else {
    return base + 1.0;
  }
}

export function calculateIeltsBands(params: {
  listeningRaw: number;
  readingRaw: number;
  readingType: 'academic' | 'general';
  writingBand: number;
  speakingBand: number;
}) {
  const { listeningRaw, readingRaw, readingType, writingBand, speakingBand } = params;

  const listeningBand = getBandFromRaw(listeningRaw, ieltsData.listening_raw_to_band);
  const readingTable =
    readingType === 'general'
      ? ieltsData.general_reading_raw_to_band
      : ieltsData.academic_reading_raw_to_band;

  const readingBand = getBandFromRaw(readingRaw, readingTable);
  const writing = Math.max(0, Math.min(9.0, writingBand));
  const speaking = Math.max(0, Math.min(9.0, speakingBand));

  const arithmeticMean = (listeningBand + readingBand + writing + speaking) / 4;
  const overallBand = roundIeltsOverallBand(arithmeticMean);

  return {
    listeningBand,
    readingBand,
    writingBand: writing,
    speakingBand: speaking,
    arithmeticMean,
    overallBand,
  };
}

export const config: ToolConfig = {
  id: 'ielts-band-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'listeningRaw',
      label: 'Listening Raw Score (0 to 40)',
      type: 'number',
      min: 0,
      max: 40,
      step: 1,
      default: 32,
      help: 'Total correct answers out of 40 in the Listening test',
    },
    {
      key: 'readingType',
      label: 'IELTS Test Module (Reading)',
      type: 'select',
      default: 'academic',
      options: [
        { label: 'Academic Module', value: 'academic' },
        { label: 'General Training Module', value: 'general' },
      ],
    },
    {
      key: 'readingRaw',
      label: 'Reading Raw Score (0 to 40)',
      type: 'number',
      min: 0,
      max: 40,
      step: 1,
      default: 30,
      help: 'Total correct answers out of 40 in the Reading section',
    },
    {
      key: 'writingBand',
      label: 'Writing Section Band (0 to 9.0)',
      type: 'number',
      min: 0,
      max: 9.0,
      step: 0.5,
      default: 6.5,
      help: 'Examiner awarded band for Task 1 and Task 2',
    },
    {
      key: 'speakingBand',
      label: 'Speaking Section Band (0 to 9.0)',
      type: 'number',
      min: 0,
      max: 9.0,
      step: 0.5,
      default: 7.0,
      help: 'Examiner awarded interview band',
    },
  ],
  outputs: [
    {
      key: 'overallBand',
      label: 'Overall IELTS Band Score',
      format: 'number',
      highlight: true,
    },
    {
      key: 'listeningBand',
      label: 'Listening Band Score',
      format: 'number',
    },
    {
      key: 'readingBand',
      label: 'Reading Band Score',
      format: 'number',
    },
    {
      key: 'cefrLevel',
      label: 'CEFR Equivalent Level',
      format: 'text',
    },
  ],
  compute(values) {
    const res = calculateIeltsBands({
      listeningRaw: Number(values.listeningRaw) || 0,
      readingRaw: Number(values.readingRaw) || 0,
      readingType: (values.readingType as any) || 'academic',
      writingBand: Number(values.writingBand) || 0,
      speakingBand: Number(values.speakingBand) || 0,
    });

    let cefr = 'B2 (Independent User - Vantage)';
    if (res.overallBand >= 8.5) cefr = 'C2 (Proficient User - Mastery)';
    else if (res.overallBand >= 7.0) cefr = 'C1 (Proficient User - Effective)';
    else if (res.overallBand >= 5.5) cefr = 'B2 (Independent User - Vantage)';
    else if (res.overallBand >= 4.0) cefr = 'B1 (Independent User - Threshold)';
    else cefr = 'A2 / A1 (Basic User)';

    return {
      overallBand: res.overallBand,
      listeningBand: res.listeningBand,
      readingBand: res.readingBand,
      cefrLevel: cefr,
      chartData: {
        type: 'stacked',
        labels: ['Sectional Bands'],
        series: [
          {
            name: 'Band Score',
            color: '#0ea5e9',
            values: [res.listeningBand, res.readingBand, res.writingBand, res.speakingBand],
          },
        ],
      },
    };
  },
  table(values) {
    const res = calculateIeltsBands({
      listeningRaw: Number(values.listeningRaw) || 0,
      readingRaw: Number(values.readingRaw) || 0,
      readingType: (values.readingType as any) || 'academic',
      writingBand: Number(values.writingBand) || 0,
      speakingBand: Number(values.speakingBand) || 0,
    });

    return {
      columns: [
        { key: 'skill', label: 'Section / Skill', format: 'text' },
        { key: 'raw', label: 'Raw Score', format: 'text' },
        { key: 'band', label: 'Band Score (/9.0)', format: 'number' },
      ],
      rows: [
        { skill: 'Listening', raw: `${values.listeningRaw || 0}/40`, band: res.listeningBand },
        { skill: `Reading (${values.readingType === 'general' ? 'General' : 'Academic'})`, raw: `${values.readingRaw || 0}/40`, band: res.readingBand },
        { skill: 'Writing', raw: 'Qualitative Assessment', band: res.writingBand },
        { skill: 'Speaking', raw: 'Interview Assessment', band: res.speakingBand },
        { skill: 'Overall Composite (Official Rounding)', raw: `Mean: ${res.arithmeticMean.toFixed(2)}`, band: res.overallBand },
      ],
    };
  },
};

export default config;
