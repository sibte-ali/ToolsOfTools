import type { ToolConfig } from '../../lib/engine/types';
import { calculateNameNumerology, NUMBER_MEANINGS } from '../../lib/fun/numerology';

export { calculateNameNumerology };

export const BUSINESS_VIBRATION_MEANINGS: Record<number, string> = {
  1: 'Pioneering Leadership: Ideal for visionary startups, tech disruptors, executive consulting, and solo founders creating new market categories.',
  2: 'Collaboration & Diplomacy: Favors advisory firms, mediation agencies, wellness clinics, public relations, and customer-focused service boutiques.',
  3: 'Creative Expression & Media: Exceptional for marketing agencies, entertainment, publishing, lifestyle brands, and design studios.',
  4: 'Structural Trust & Reliability: Suited for commercial construction, financial accounting, logistics, legal practices, and cybersecurity.',
  5: 'Rapid Innovation & Global Commerce: Excellent for e-commerce, international import-export, travel, venture capital, and fast-moving consumer apps.',
  6: 'Luxury, Care & Community: Perfect for hospitality, high-end retail, beauty, healthcare, gourmet restaurants, and family services.',
  7: 'Specialized Expertise & Research: Prime choice for think tanks, pharmaceutical research, data science, academic institutions, and intellectual property.',
  8: 'Scale, Authority & Wealth Building: Natural magnet for investment banking, commercial real estate, corporate conglomerates, and heavy industry.',
  9: 'Global Impact & Humanitarian Vision: Best for philanthropic foundations, green energy, educational non-profits, and mission-driven consumer goods.',
  11: 'Master Innovation (11): Powerful spiritual, visionary, and disruptive inspiration. Suited for visionary incubators and transformative platforms.',
  22: 'Master Construction (22): Massive physical or global infrastructure scale, bridging high ambition with tangible worldwide impact.',
  33: 'Master Stewardship (33): Supreme social responsibility, humanitarian upliftment, and ethical consumer trust.',
};

const config: ToolConfig = {
  id: 'business-name-numerology-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'businessName1',
      label: 'Primary Business Name',
      type: 'text',
      default: 'Nova Ventures',
      placeholder: 'First candidate company name',
    },
    {
      key: 'businessName2',
      label: 'Candidate Name 2 (Optional Comparison)',
      type: 'text',
      default: 'Summit Peak Media',
      placeholder: 'Second candidate name',
    },
    {
      key: 'businessName3',
      label: 'Candidate Name 3 (Optional Comparison)',
      type: 'text',
      default: 'Blue Horizon Tech',
      placeholder: 'Third candidate name',
    },
    {
      key: 'system',
      label: 'Numerology System',
      type: 'select',
      options: [
        { label: 'Chaldean (Traditional Business Preferred: 1 to 8)', value: 'chaldean' },
        { label: 'Pythagorean (Western Standard: 1 to 9)', value: 'pythagorean' },
      ],
      default: 'chaldean',
    },
  ],
  compute(values) {
    const sys = (values.system === 'pythagorean' ? 'pythagorean' : 'chaldean') as 'chaldean' | 'pythagorean';
    const n1 = String(values.businessName1 || 'Nova Ventures').trim();
    const n2 = String(values.businessName2 || '').trim();
    const n3 = String(values.businessName3 || '').trim();

    const r1 = calculateNameNumerology(n1, sys);
    const meaning1 = BUSINESS_VIBRATION_MEANINGS[r1.rootNumber] || NUMBER_MEANINGS[r1.rootNumber];

    let comp2 = 'N/A';
    if (n2) {
      const r2 = calculateNameNumerology(n2, sys);
      const m2 = BUSINESS_VIBRATION_MEANINGS[r2.rootNumber] || NUMBER_MEANINGS[r2.rootNumber];
      comp2 = `"${n2}" → Root ${r2.rootNumber} (Compound ${r2.compoundNumber}): ${m2}`;
    }

    let comp3 = 'N/A';
    if (n3) {
      const r3 = calculateNameNumerology(n3, sys);
      const m3 = BUSINESS_VIBRATION_MEANINGS[r3.rootNumber] || NUMBER_MEANINGS[r3.rootNumber];
      comp3 = `"${n3}" → Root ${r3.rootNumber} (Compound ${r3.compoundNumber}): ${m3}`;
    }

    return {
      rootNumber: r1.rootNumber,
      compoundNumber: r1.compoundNumber,
      businessMeaning: meaning1,
      name1Summary: `"${n1}" totals compound ${r1.compoundNumber}, resolving to root number ${r1.rootNumber}.`,
      candidate2Result: comp2,
      candidate3Result: comp3,
      systemUsed: sys === 'chaldean' ? 'Chaldean Numerology' : 'Pythagorean Numerology',
    };
  },
  outputs: [
    { key: 'rootNumber', label: 'Primary Name Root Number', format: 'number', highlight: true },
    { key: 'compoundNumber', label: 'Primary Compound Sum', format: 'number', highlight: true },
    { key: 'businessMeaning', label: 'Commercial Energy & Sector Fit', format: 'text' },
    { key: 'name1Summary', label: 'Primary Brand Summary', format: 'text' },
    { key: 'candidate2Result', label: 'Candidate 2 Analysis', format: 'text' },
    { key: 'candidate3Result', label: 'Candidate 3 Analysis', format: 'text' },
    { key: 'systemUsed', label: 'System Applied', format: 'text' },
  ],
};

export default config;
