import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';

export function computeDiscountLogic(params: {
  mode: 'standard' | 'reverse' | 'double';
  originalPrice: number;
  discountPct?: number;
  finalPriceInput?: number;
  secondDiscountPct?: number;
  taxPct?: number;
}) {
  const {
    mode,
    originalPrice,
    discountPct = 0,
    finalPriceInput = 0,
    secondDiscountPct = 0,
    taxPct = 0,
  } = params;

  let finalPriceBeforeTax = 0;
  let totalDiscountAmount = 0;
  let effectiveDiscountPct = 0;

  if (mode === 'reverse') {
    // Mode 2: Given Original Price and Final Price, find discount %
    finalPriceBeforeTax = Math.max(0, finalPriceInput);
    totalDiscountAmount = Math.max(0, originalPrice - finalPriceBeforeTax);
    effectiveDiscountPct =
      originalPrice > 0 ? (totalDiscountAmount / originalPrice) * 100 : 0;
  } else if (mode === 'double') {
    // Mode 3: Two successive discounts: D1 + D2 - (D1*D2/100)
    const d1 = discountPct / 100;
    const d2 = secondDiscountPct / 100;
    const afterD1 = originalPrice * (1 - d1);
    finalPriceBeforeTax = afterD1 * (1 - d2);
    totalDiscountAmount = originalPrice - finalPriceBeforeTax;
    effectiveDiscountPct =
      originalPrice > 0 ? (totalDiscountAmount / originalPrice) * 100 : 0;
  } else {
    // Mode 1: Standard: Original Price and Discount %
    const discFrac = Math.min(100, Math.max(0, discountPct)) / 100;
    totalDiscountAmount = originalPrice * discFrac;
    finalPriceBeforeTax = originalPrice - totalDiscountAmount;
    effectiveDiscountPct = discountPct;
  }

  const taxAmount = (finalPriceBeforeTax * Math.max(0, taxPct)) / 100;
  const finalPriceWithTax = finalPriceBeforeTax + taxAmount;

  return {
    originalPrice: roundHalfAwayFromZero(originalPrice, 2),
    finalPriceBeforeTax: roundHalfAwayFromZero(finalPriceBeforeTax, 2),
    totalDiscountAmount: roundHalfAwayFromZero(totalDiscountAmount, 2),
    effectiveDiscountPct: roundHalfAwayFromZero(effectiveDiscountPct, 2),
    taxAmount: roundHalfAwayFromZero(taxAmount, 2),
    finalPriceWithTax: roundHalfAwayFromZero(finalPriceWithTax, 2),
  };
}

export const config: ToolConfig = {
  id: 'discount-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'mode',
      label: 'Calculation Mode',
      type: 'select',
      default: 'standard',
      options: [
        { label: 'Standard (Price + Discount %)', value: 'standard' },
        { label: 'Reverse (Price + Sale Price -> Find %)', value: 'reverse' },
        { label: 'Double Discount (Two successive discounts)', value: 'double' },
      ],
    },
    {
      key: 'originalPrice',
      label: 'Original Price',
      type: 'number',
      min: 0,
      max: 100000000,
      step: 1,
      default: 100,
      unit: '$',
    },
    {
      key: 'discountPct',
      label: 'Discount Percentage (%)',
      type: 'number',
      min: 0,
      max: 100,
      step: 0.5,
      default: 20,
      unit: '%',
      help: 'Used in Standard and Double Discount modes',
    },
    {
      key: 'finalPriceInput',
      label: 'Sale / Final Price (Reverse mode)',
      type: 'number',
      min: 0,
      max: 100000000,
      step: 1,
      default: 80,
      unit: '$',
      help: 'Entered price to calculate actual discount received',
    },
    {
      key: 'secondDiscountPct',
      label: 'Second Discount (% for Double mode)',
      type: 'number',
      min: 0,
      max: 100,
      step: 0.5,
      default: 10,
      unit: '%',
      help: 'Additional coupon or loyalty discount applied after first discount',
    },
    {
      key: 'taxPct',
      label: 'Sales Tax Rate (% optional)',
      type: 'number',
      min: 0,
      max: 50,
      step: 0.25,
      default: 0,
      unit: '%',
      help: 'Sales tax or VAT applied to the discounted price',
    },
  ],
  outputs: [
    {
      key: 'finalPriceWithTax',
      label: 'Final Price (Total to Pay)',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalDiscountAmount',
      label: 'You Save',
      format: 'currency',
    },
    {
      key: 'effectiveDiscountPct',
      label: 'Effective Discount Rate',
      format: 'percent',
    },
    {
      key: 'taxAmount',
      label: 'Sales Tax Added',
      format: 'currency',
    },
  ],
  compute(values) {
    const res = computeDiscountLogic({
      mode: (values.mode as any) || 'standard',
      originalPrice: Number(values.originalPrice) || 0,
      discountPct: Number(values.discountPct) || 0,
      finalPriceInput: Number(values.finalPriceInput) || 0,
      secondDiscountPct: Number(values.secondDiscountPct) || 0,
      taxPct: Number(values.taxPct) || 0,
    });

    return {
      finalPriceWithTax: res.finalPriceWithTax,
      totalDiscountAmount: res.totalDiscountAmount,
      effectiveDiscountPct: res.effectiveDiscountPct,
      taxAmount: res.taxAmount,
      chartData: {
        type: 'stacked',
        labels: ['Breakdown'],
        series: [
          { name: 'Final Price', color: '#10b981', values: [res.finalPriceBeforeTax] },
          { name: 'You Save', color: '#ef4444', values: [res.totalDiscountAmount] },
          ...(res.taxAmount > 0
            ? [{ name: 'Tax', color: '#f59e0b', values: [res.taxAmount] }]
            : []),
        ],
      },
    };
  },
  chart: 'stacked',
};

export default config;
