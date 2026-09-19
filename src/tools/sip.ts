import type { ToolConfig } from '../lib/engine/types';
import { calculateSipFutureValue } from '../lib/engine/math';

export const config: ToolConfig = {
  id: 'sip',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'monthlyDeposit',
      label: 'Monthly Investment',
      type: 'number',
      min: 10,
      max: 10000000,
      step: 50,
      default: 500,
      unit: '$',
      help: 'Amount you deposit at the beginning of every month',
    },
    {
      key: 'returnRate',
      label: 'Expected Return Rate (% p.a.)',
      type: 'number',
      min: 1,
      max: 30,
      step: 0.1,
      default: 12,
      unit: '%',
      help: 'Estimated annualized compound growth rate',
    },
    {
      key: 'years',
      label: 'Time Period (Years)',
      type: 'number',
      min: 1,
      max: 40,
      step: 1,
      default: 10,
      unit: 'years',
      help: 'Investment duration in years',
    },
  ],
  outputs: [
    {
      key: 'futureValue',
      label: 'Total Expected Value',
      format: 'currency',
      highlight: true,
    },
    {
      key: 'totalInvested',
      label: 'Total Amount Invested',
      format: 'currency',
    },
    {
      key: 'totalInterest',
      label: 'Estimated Wealth Gain',
      format: 'currency',
    },
  ],
  compute(values) {
    const monthlyDeposit = Number(values.monthlyDeposit) || 500;
    const returnRate = Number(values.returnRate) || 12;
    const years = Number(values.years) || 10;

    const result = calculateSipFutureValue(monthlyDeposit, returnRate, years, true);

    const labels: string[] = [];
    const investedVals: number[] = [];
    const wealthVals: number[] = [];

    for (let y = 1; y <= years; y++) {
      labels.push(`Yr ${y}`);
      const yrRes = calculateSipFutureValue(monthlyDeposit, returnRate, y, true);
      investedVals.push(yrRes.totalInvested);
      wealthVals.push(yrRes.totalInterest);
    }

    return {
      futureValue: result.futureValue,
      totalInvested: result.totalInvested,
      totalInterest: result.totalInterest,
      chartData: {
        type: 'stacked',
        labels,
        series: [
          { name: 'Invested', color: '#0ea5e9', values: investedVals },
          { name: 'Gain', color: '#10b981', values: wealthVals },
        ],
      },
    };
  },
  chart: 'stacked',
};

export default config;
