import type { ToolConfig } from '../../lib/engine/types';

export function numberToIndianWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  if (num < 0) return 'Negative ' + numberToIndianWords(Math.abs(num));

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  function twoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10);
    const o = n % 10;
    return tens[t] + (o > 0 ? ' ' + ones[o] : '');
  }

  function threeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    let res = '';
    if (h > 0) res += ones[h] + ' Hundred';
    if (rem > 0) {
      res += (res ? ' and ' : '') + twoDigits(rem);
    }
    return res;
  }

  const crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const parts: string[] = [];
  if (crore > 0) parts.push(twoDigits(crore) + ' Crore');
  if (lakh > 0) parts.push(twoDigits(lakh) + ' Lakh');
  if (thousand > 0) parts.push(twoDigits(thousand) + ' Thousand');
  if (remainder > 0) parts.push(threeDigits(remainder));

  return parts.join(' ') + ' Rupees Only';
}

export const config: ToolConfig = {
  id: 'cash-calculator',
  lang: 'en',
  numberLocale: 'en-IN',
  currency: 'INR',
  inputs: [
    {
      key: 'n500',
      label: '₹500 Notes',
      type: 'number',
      min: 0,
      max: 100000,
      step: 1,
      default: 10,
      unit: 'notes',
    },
    {
      key: 'n200',
      label: '₹200 Notes',
      type: 'number',
      min: 0,
      max: 100000,
      step: 1,
      default: 5,
      unit: 'notes',
    },
    {
      key: 'n100',
      label: '₹100 Notes',
      type: 'number',
      min: 0,
      max: 100000,
      step: 1,
      default: 15,
      unit: 'notes',
    },
    {
      key: 'n50',
      label: '₹50 Notes',
      type: 'number',
      min: 0,
      max: 100000,
      step: 1,
      default: 20,
      unit: 'notes',
    },
    {
      key: 'n20',
      label: '₹20 Notes',
      type: 'number',
      min: 0,
      max: 100000,
      step: 1,
      default: 10,
      unit: 'notes',
    },
    {
      key: 'n10',
      label: '₹10 Notes',
      type: 'number',
      min: 0,
      max: 100000,
      step: 1,
      default: 30,
      unit: 'notes',
    },
    {
      key: 'coins',
      label: 'Coins & Change (₹ Total Value)',
      type: 'number',
      min: 0,
      max: 100000,
      step: 1,
      default: 50,
      unit: '₹',
    },
  ],
  outputs: [
    {
      key: 'totalCash',
      label: 'Total Cash Value',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalNotes',
      label: 'Total Number of Notes',
      format: 'number',
    },
    {
      key: 'inWords',
      label: 'Amount in Words (Indian System)',
      format: 'text',
    },
  ],
  compute(values) {
    const c500 = Number(values.n500) || 0;
    const c200 = Number(values.n200) || 0;
    const c100 = Number(values.n100) || 0;
    const c50 = Number(values.n50) || 0;
    const c20 = Number(values.n20) || 0;
    const c10 = Number(values.n10) || 0;
    const coinsVal = Number(values.coins) || 0;

    const totalFromNotes =
      c500 * 500 + c200 * 200 + c100 * 100 + c50 * 50 + c20 * 20 + c10 * 10;
    const totalCash = totalFromNotes + coinsVal;
    const totalNotes = c500 + c200 + c100 + c50 + c20 + c10;
    const inWords = numberToIndianWords(Math.round(totalCash));

    return {
      totalCash,
      totalNotes,
      inWords,
      chartData: {
        type: 'stacked',
        labels: ['Cash by Denomination'],
        series: [
          { name: '₹500', color: '#6366f1', values: [c500 * 500] },
          { name: '₹200', color: '#f59e0b', values: [c200 * 200] },
          { name: '₹100', color: '#3b82f6', values: [c100 * 100] },
          { name: '₹50', color: '#10b981', values: [c50 * 50] },
          { name: '₹20/₹10/Coins', color: '#8b5cf6', values: [c20 * 20 + c10 * 10 + coinsVal] },
        ],
      },
    };
  },
  table(values) {
    const c500 = Number(values.n500) || 0;
    const c200 = Number(values.n200) || 0;
    const c100 = Number(values.n100) || 0;
    const c50 = Number(values.n50) || 0;
    const c20 = Number(values.n20) || 0;
    const c10 = Number(values.n10) || 0;
    const coinsVal = Number(values.coins) || 0;

    const rows = [
      { denom: '₹500 Note', count: c500, value: c500 * 500 },
      { denom: '₹200 Note', count: c200, value: c200 * 200 },
      { denom: '₹100 Note', count: c100, value: c100 * 100 },
      { denom: '₹50 Note', count: c50, value: c50 * 50 },
      { denom: '₹20 Note', count: c20, value: c20 * 20 },
      { denom: '₹10 Note', count: c10, value: c10 * 10 },
      { denom: 'Coins / Misc', count: 1, value: coinsVal },
    ];

    return {
      columns: [
        { key: 'denom', label: 'Denomination', format: 'text' },
        { key: 'count', label: 'Count / Pieces', format: 'number' },
        { key: 'value', label: 'Subtotal (₹)', format: 'currency' },
      ],
      rows,
    };
  },
  chart: 'stacked',
};

export default config;
