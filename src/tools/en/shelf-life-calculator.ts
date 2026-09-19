import type { ToolConfig } from '../../lib/engine/types';
import { calculateShelfLife } from '../../lib/dates';

export interface ShelfLifeInput {
  mfgDate: string;
  shelfVal: number;
  shelfUnit: 'days' | 'months' | 'years';
  asOfDate?: string;
}

export function calculateProductShelfLife(input: ShelfLifeInput) {
  const mfg = input.mfgDate || '2024-01-01';
  const val = Number(input.shelfVal || 12);
  const unit = input.shelfUnit || 'months';
  const asOf = input.asOfDate || '2024-06-01';

  return calculateShelfLife(mfg, val, unit, asOf);
}

export const shelfLifeCalculatorConfig: ToolConfig = {
  id: 'shelf-life-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'mfgDate',
      label: 'Manufacture or Purchase Date',
      type: 'date',
      default: '2024-01-01',
    },
    {
      key: 'shelfVal',
      label: 'Shelf Life Duration',
      type: 'number',
      min: 1,
      max: 10000,
      default: 12,
    },
    {
      key: 'shelfUnit',
      label: 'Duration Unit',
      type: 'select',
      default: 'months',
      options: [
        { label: 'Days', value: 'days' },
        { label: 'Months', value: 'months' },
        { label: 'Years', value: 'years' },
      ],
    },
    {
      key: 'asOfDate',
      label: 'Evaluation Date (As Of)',
      type: 'date',
      default: '2024-06-01',
      help: 'Date against which freshness and remaining days are calculated',
    },
  ],
  compute: (values) => {
    const res = calculateProductShelfLife({
      mfgDate: String(values.mfgDate || '2024-01-01'),
      shelfVal: Number(values.shelfVal || 12),
      shelfUnit: values.shelfUnit as any,
      asOfDate: String(values.asOfDate || '2024-06-01'),
    });

    const remText = res.daysRemaining >= 0
      ? `${res.daysRemaining} days remaining`
      : `Expired ${Math.abs(res.daysRemaining)} days ago`;

    return {
      expiryDate: res.expiryDate,
      freshnessStatus: `${res.statusLabel} (${res.percentageUsed}% of shelf life elapsed)`,
      daysRemainingFormatted: remText,
      totalShelfDays: res.daysTotal,
      percentageElapsed: res.percentageUsed,
    };
  },
  outputs: [
    { key: 'expiryDate', label: 'Expiration Date', format: 'text', highlight: true },
    { key: 'freshnessStatus', label: 'Product Status', format: 'text' },
    { key: 'daysRemainingFormatted', label: 'Remaining Lifespan', format: 'text' },
    { key: 'totalShelfDays', label: 'Total Shelf Life (Days)', format: 'number' },
    { key: 'percentageElapsed', label: 'Percentage Elapsed (%)', format: 'percent' },
  ],
};
