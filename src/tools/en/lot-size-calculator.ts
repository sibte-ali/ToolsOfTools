import type { ToolConfig } from '../../lib/engine/types';
import { roundHalfAwayFromZero } from '../../lib/engine/math';
import forexData from '../../data/forex-pips.json';

export function calculateLotSize(params: {
  accountBalance: number;
  riskPct: number;
  stopLossPips: number;
  pipValuePerStandardLot: number;
}) {
  const { accountBalance, riskPct, stopLossPips, pipValuePerStandardLot } = params;

  if (accountBalance <= 0 || riskPct <= 0 || stopLossPips <= 0 || pipValuePerStandardLot <= 0) {
    return {
      riskAmount: 0,
      standardLots: 0,
      miniLots: 0,
      microLots: 0,
      units: 0,
    };
  }

  const riskAmount = roundHalfAwayFromZero((accountBalance * riskPct) / 100, 2);
  const costPerPipForRisk = riskAmount / stopLossPips;
  const standardLots = costPerPipForRisk / pipValuePerStandardLot;
  const roundedStandardLots = roundHalfAwayFromZero(standardLots, 2);
  const units = Math.round(standardLots * forexData.standard_lot_units);
  const miniLots = roundHalfAwayFromZero(standardLots * 10, 1);
  const microLots = roundHalfAwayFromZero(standardLots * 100, 1);

  return {
    riskAmount,
    standardLots: roundedStandardLots,
    miniLots,
    microLots,
    units,
  };
}

export const config: ToolConfig = {
  id: 'lot-size-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  currency: 'USD',
  inputs: [
    {
      key: 'accountBalance',
      label: 'Trading Account Balance',
      type: 'number',
      min: 10,
      max: 100000000,
      step: 100,
      default: 10000,
      unit: '$',
      help: 'Total available equity in your trading account',
    },
    {
      key: 'riskPct',
      label: 'Risk Percentage per Trade (%)',
      type: 'number',
      min: 0.1,
      max: 20,
      step: 0.1,
      default: 1,
      unit: '%',
      help: 'Recommended conservative risk is 1% to 2%',
    },
    {
      key: 'stopLossPips',
      label: 'Stop Loss Distance (Pips)',
      type: 'number',
      min: 1,
      max: 1000,
      step: 1,
      default: 25,
      unit: 'pips',
      help: 'Distance between entry price and stop loss price',
    },
    {
      key: 'pairSymbol',
      label: 'Currency Pair',
      type: 'select',
      default: 'EUR/USD',
      options: forexData.pairs.map((p) => ({
        label: `${p.symbol} (${p.name}) - Pip Val: $${p.pip_value_usd_standard_lot}`,
        value: p.symbol,
      })),
      help: 'Select pair to look up contract standard lot pip value',
    },
  ],
  outputs: [
    {
      key: 'standardLots',
      label: 'Standard Lots (100k units)',
      format: 'number',
      highlight: true,
    },
    {
      key: 'riskAmount',
      label: 'Maximum Dollar Risk ($)',
      format: 'currency',
    },
    {
      key: 'units',
      label: 'Position Size (Units)',
      format: 'number',
    },
    {
      key: 'miniMicroLots',
      label: 'Mini / Micro Lots',
      format: 'text',
    },
  ],
  compute(values) {
    const accountBalance = Number(values.accountBalance) || 10000;
    const riskPct = Number(values.riskPct) || 1;
    const stopLossPips = Number(values.stopLossPips) || 25;
    const pairSymbol = String(values.pairSymbol || 'EUR/USD');

    const pairInfo = forexData.pairs.find((p) => p.symbol === pairSymbol) || forexData.pairs[0];
    const pipValuePerStandardLot = pairInfo.pip_value_usd_standard_lot;

    const res = calculateLotSize({
      accountBalance,
      riskPct,
      stopLossPips,
      pipValuePerStandardLot,
    });

    return {
      standardLots: res.standardLots,
      riskAmount: res.riskAmount,
      units: res.units,
      miniMicroLots: `${res.miniLots} Mini / ${res.microLots} Micro`,
      chartData: {
        type: 'stacked',
        labels: ['Account Risk Allocation'],
        series: [
          { name: 'Max Risked Capital', color: '#ef4444', values: [res.riskAmount] },
          {
            name: 'Protected Balance',
            color: '#10b981',
            values: [Math.max(0, accountBalance - res.riskAmount)],
          },
        ],
      },
    };
  },
  chart: 'stacked',
};

export default config;
