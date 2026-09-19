import type { ToolConfig } from '../../lib/engine/types';
import constructionData from '../../data/construction-costs.json';

export function calculateConstructionCost(
  areasqft: number,
  floors: number,
  tier: 'economy' | 'standard' | 'premium'
): {
  minCost: number;
  maxCost: number;
  midCost: number;
  breakdown: Record<string, { label: string; minCost: number; maxCost: number }>;
  areaTotal: number;
  tier: string;
} {
  const tierData = constructionData.tiers[tier];
  // Floor multiplier: each floor above first adds 15%
  const floorFactor = 1 + (floors - 1) * constructionData.floorMultiplier.perFloor;
  const totalArea = areasqft * floors;

  const minCostPerSqft = tierData.costPerSqFtMin * floorFactor;
  const maxCostPerSqft = tierData.costPerSqFtMax * floorFactor;
  const midCostPerSqft = (minCostPerSqft + maxCostPerSqft) / 2;

  const minCost = totalArea * minCostPerSqft;
  const maxCost = totalArea * maxCostPerSqft;
  const midCost = totalArea * midCostPerSqft;

  const breakdownKeys: Record<string, string> = {
    structure: 'Structure (Foundation + Frame)',
    finishing: 'Finishing (Plaster, Paint, Tiles)',
    electrical: 'Electrical Wiring',
    plumbing: 'Plumbing',
    flooring: 'Flooring',
    doors_windows: 'Doors & Windows',
  };
  const breakdown: Record<string, { label: string; minCost: number; maxCost: number }> = {};
  for (const [key, pct] of Object.entries(tierData.breakdown)) {
    breakdown[key] = {
      label: breakdownKeys[key] ?? key,
      minCost: Math.round(minCost * (pct as number)),
      maxCost: Math.round(maxCost * (pct as number)),
    };
  }

  return {
    minCost: Math.round(minCost),
    maxCost: Math.round(maxCost),
    midCost: Math.round(midCost),
    breakdown,
    areaTotal: totalArea,
    tier: tierData.label,
  };
}

const config: ToolConfig = {
  id: 'house-construction-cost-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'areasgft',
      label: 'Built-Up Area per Floor (sq ft)',
      type: 'number',
      min: 100, max: 100_000, step: 50, default: 1200,
      unit: 'sq ft',
    },
    {
      key: 'floors',
      label: 'Number of Floors',
      type: 'number',
      min: 1, max: 10, step: 1, default: 2,
    },
    {
      key: 'tier',
      label: 'Quality Tier',
      type: 'select',
      default: 'standard',
      options: [
        { label: 'Economy (₹1,500–₹2,000/sq ft)', value: 'economy' },
        { label: 'Standard (₹2,000–₹3,000/sq ft)', value: 'standard' },
        { label: 'Premium (₹3,000–₹5,000/sq ft)', value: 'premium' },
      ],
    },
  ],
  compute(values) {
    const builtSqFt = Math.max(100, Number(values.areasgft) || 1200);
    const totalFloors = Math.max(1, Number(values.floors) || 2);
    const tier = String(values.tier || 'standard') as 'economy' | 'standard' | 'premium';
    const res = calculateConstructionCost(builtSqFt, totalFloors, tier);

    return {
      minCost: res.minCost,
      maxCost: res.maxCost,
      midCost: res.midCost,
      areaTotal: res.areaTotal,
      tier: res.tier,
      note: '⚠ Estimates only. Actual costs vary by location, contractor, and materials.',
    };
  },
  outputs: [
    { key: 'midCost', label: 'Estimated Cost (mid-range, ₹)', format: 'currency', highlight: true },
    { key: 'minCost', label: 'Minimum Estimate (₹)', format: 'currency' },
    { key: 'maxCost', label: 'Maximum Estimate (₹)', format: 'currency' },
    { key: 'areaTotal', label: 'Total Built-Up Area (sq ft)', format: 'number' },
    { key: 'tier', label: 'Quality Tier', format: 'text' },
    { key: 'note', label: 'Disclaimer', format: 'text' },
  ],
  table(values) {
    const builtSqFt = Math.max(100, Number(values.areasgft) || 1200);
    const totalFloors = Math.max(1, Number(values.floors) || 2);
    const tier = String(values.tier || 'standard') as 'economy' | 'standard' | 'premium';
    const res = calculateConstructionCost(builtSqFt, totalFloors, tier);
    return {
      columns: [
        { key: 'component', label: 'Component', format: 'text' },
        { key: 'minCost', label: 'Min Estimate (₹)', format: 'number' },
        { key: 'maxCost', label: 'Max Estimate (₹)', format: 'number' },
      ],
      rows: Object.values(res.breakdown).map((b) => ({
        component: b.label,
        minCost: b.minCost,
        maxCost: b.maxCost,
      })),
    };
  },
};

export default config;
