import type { ToolConfig } from '../../lib/engine/types';
import couriersData from '../../data/couriers.json';

export function calculateVolumetricWeight(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  quantity: number,
  actualWeightKg: number,
  divisor: number
): {
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  actualWeightKg: number;
  dimensionalWeight: string;
  decision: string;
} {
  const volumeCm3 = lengthCm * widthCm * heightCm;
  const volumetricWeightKg = (volumeCm3 / divisor) * quantity;
  const actualTotal = actualWeightKg * quantity;
  const chargeableWeightKg = Math.max(volumetricWeightKg, actualTotal);
  const decision = volumetricWeightKg > actualTotal ? 'Volumetric weight is higher (use this for billing)' : 'Actual weight is higher (use this for billing)';

  return {
    volumetricWeightKg: +volumetricWeightKg.toFixed(3),
    chargeableWeightKg: +chargeableWeightKg.toFixed(3),
    actualWeightKg: +actualTotal.toFixed(3),
    dimensionalWeight: `${volumeCm3.toLocaleString()} cm³ ÷ ${divisor} = ${volumetricWeightKg.toFixed(3)} kg`,
    decision,
  };
}

const config: ToolConfig = {
  id: 'volumetric-weight-calculator',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'length',
      label: 'Package Length',
      type: 'number',
      min: 1, max: 10000, step: 0.1, default: 40,
      unit: 'cm',
    },
    {
      key: 'width',
      label: 'Package Width',
      type: 'number',
      min: 1, max: 10000, step: 0.1, default: 30,
      unit: 'cm',
    },
    {
      key: 'height',
      label: 'Package Height',
      type: 'number',
      min: 1, max: 10000, step: 0.1, default: 20,
      unit: 'cm',
    },
    {
      key: 'quantity',
      label: 'Number of Packages',
      type: 'number',
      min: 1, max: 10000, step: 1, default: 1,
    },
    {
      key: 'actualWeight',
      label: 'Actual Weight per Package',
      type: 'number',
      min: 0.01, max: 1000, step: 0.1, default: 3,
      unit: 'kg',
    },
    {
      key: 'courier',
      label: 'Courier / Divisor',
      type: 'select',
      default: 'dhl',
      options: couriersData.couriers.map((c) => ({
        label: `${c.name} (÷ ${c.divisor})`,
        value: c.key,
      })),
    },
  ],
  compute(values) {
    const courierKey = String(values.courier || 'dhl');
    const courier = couriersData.couriers.find((c) => c.key === courierKey) ?? couriersData.couriers[0];
    return calculateVolumetricWeight(
      Number(values.length) || 40,
      Number(values.width) || 30,
      Number(values.height) || 20,
      Number(values.quantity) || 1,
      Number(values.actualWeight) || 3,
      courier.divisor,
    );
  },
  outputs: [
    { key: 'chargeableWeightKg', label: 'Chargeable Weight (kg)', format: 'number', highlight: true },
    { key: 'volumetricWeightKg', label: 'Volumetric Weight (kg)', format: 'number' },
    { key: 'actualWeightKg', label: 'Actual Weight (kg)', format: 'number' },
    { key: 'dimensionalWeight', label: 'Calculation', format: 'text' },
    { key: 'decision', label: 'Billing Basis', format: 'text' },
  ],
};

export default config;
