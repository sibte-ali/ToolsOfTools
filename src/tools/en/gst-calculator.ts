import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import gstData from '../../data/gst-rates.json';

export function computeGst(params: {
  amount: number;
  ratePct: number;
  mode: 'add' | 'remove';
  supplyType?: 'intra' | 'inter';
}) {
  const { amount, ratePct, mode, supplyType = 'intra' } = params;

  let netAmount = 0;
  let gstAmount = 0;
  let grossAmount = 0;

  if (mode === 'remove') {
    // Amount entered is gross (inclusive of GST)
    grossAmount = amount;
    netAmount = roundHalfAwayFromZero((grossAmount * 100) / (100 + ratePct), 2);
    gstAmount = roundHalfAwayFromZero(grossAmount - netAmount, 2);
  } else {
    // Mode is 'add': Amount entered is net (exclusive of GST)
    netAmount = amount;
    gstAmount = roundHalfAwayFromZero((netAmount * ratePct) / 100, 2);
    grossAmount = roundHalfAwayFromZero(netAmount + gstAmount, 2);
  }

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (supplyType === 'inter') {
    igst = gstAmount;
  } else {
    // Intra-state split equally
    cgst = roundHalfAwayFromZero(gstAmount / 2, 2);
    sgst = roundHalfAwayFromZero(gstAmount - cgst, 2);
  }

  return {
    netAmount,
    gstAmount,
    grossAmount,
    cgst,
    sgst,
    igst,
    ratePct,
    mode,
    supplyType,
  };
}

export const config: ToolConfig = {
  id: 'gst-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'amount',
      label: 'Initial Amount',
      type: 'number',
      min: 0,
      max: 1000000000,
      step: 10,
      default: 10000,
      unit: '₹',
      help: 'Base price or total bill value',
    },
    {
      key: 'mode',
      label: 'GST Operation',
      type: 'select',
      default: 'add',
      options: [
        { label: 'Add GST (Exclusive -> Inclusive)', value: 'add' },
        { label: 'Remove GST (Inclusive -> Exclusive)', value: 'remove' },
      ],
    },
    {
      key: 'slabSelect',
      label: 'CBIC Statutory GST Slab',
      type: 'select',
      default: '18',
      options: gstData.slabs.map((s) => ({
        label: `${s.label} - ${s.description.slice(0, 40)}...`,
        value: String(s.rate),
      })),
      help: `Official GST Council / CBIC rates (verified ${gstData.last_verified})`,
    },
    {
      key: 'customRate',
      label: 'Or Custom Rate (% overrides slab if entered)',
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1,
      default: 0,
      unit: '%',
    },
    {
      key: 'supplyType',
      label: 'Transaction Type',
      type: 'select',
      default: 'intra',
      options: [
        { label: 'Intra-State (CGST + SGST 50:50)', value: 'intra' },
        { label: 'Inter-State (IGST 100%)', value: 'inter' },
      ],
    },
  ],
  outputs: [
    {
      key: 'grossAmount',
      label: 'Total Inclusive Amount',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'gstAmount',
      label: 'Total GST Tax',
      format: 'currency',
    },
    {
      key: 'netAmount',
      label: 'Net Pre-Tax Value',
      format: 'currency',
    },
    {
      key: 'splitDetails',
      label: 'Tax Split (CGST/SGST or IGST)',
      format: 'text',
    },
  ],
  compute(values) {
    const amount = Number(values.amount) || 0;
    const mode = (values.mode as any) === 'remove' ? 'remove' : 'add';
    const customRate = Number(values.customRate) || 0;
    const slabRate = Number(values.slabSelect) || 18;
    const effectiveRate = customRate > 0 ? customRate : slabRate;
    const supplyType = values.supplyType === 'inter' ? 'inter' : 'intra';

    const res = computeGst({
      amount,
      ratePct: effectiveRate,
      mode,
      supplyType,
    });

    const splitText =
      supplyType === 'inter'
        ? `IGST: ₹${res.igst.toLocaleString('en-IN')}`
        : `CGST: ₹${res.cgst.toLocaleString('en-IN')} | SGST: ₹${res.sgst.toLocaleString('en-IN')}`;

    return {
      grossAmount: res.grossAmount,
      gstAmount: res.gstAmount,
      netAmount: res.netAmount,
      splitDetails: splitText,
      chartData: {
        type: 'stacked',
        labels: ['Tax Breakdown'],
        series: [
          { name: 'Net Amount', color: '#3b82f6', values: [res.netAmount] },
          { name: 'GST Tax', color: '#10b981', values: [res.gstAmount] },
        ],
      },
    };
  },
  chart: 'stacked',
};

export default config;
