import { describe, it, expect } from 'vitest';
import { lengthConverter, massConverter, areaConverter, storageConverterDecimal } from '../lib/units';
import { gcd, simplifyFraction, addFractions } from '../lib/math/fractions';
import { calculateStats } from '../lib/math/stats';
import { combination, permutation } from '../lib/math/combinatorics';
import { convertInfixToPostfix } from '../lib/math/shunting-yard';
import { calculateSpeedDistanceTime } from '../lib/math/speed';
import { calculateMetersToFeet } from './en/meters-to-feet';
import { calculateGramsToLbs } from './en/grams-to-lbs';
import { calculateHectareToAcre } from './en/hectare-to-acre';
import { calculateMbToKb } from './en/mb-to-kb-converter';
import { calculateConcrete } from './en/concrete-calculator';
import { calculateArea } from './en/square-feet-calculator';
import { calculateMsPipeWeight } from './en/ms-pipe-weight-calculator';
import { calculateResin } from './en/resin-calculator';
import { calcularPorcentajeEs } from './es/calcular-porcentaje';
import { calcularFracao } from './pt-br/calculadora-de-fracao';
import { calcularPorcentagemPtBr } from './pt-br/calculadora-de-porcentagem';
import { calcularRegraDeTres } from './pt-br/regra-de-3-online';

describe('Batch E Pure Compute & Math Tests', () => {
  it('unit converters convert standard measurements', () => {
    // 10 meters = 32.8084 feet (known physical constant 1m = 3.28084 ft)
    expect(lengthConverter.convert(10, 'm', 'ft').toValue).toBeCloseTo(32.8084, 3);
    // 1000g = 2.20462 lbs
    expect(massConverter.convert(1000, 'g', 'lb').toValue).toBeCloseTo(2.20462, 4);
    // 5 hectares = 12.355 acres
    expect(areaConverter.convert(5, 'ha', 'acre').toValue).toBeCloseTo(12.3553, 3);
    // 1 MB = 1000 KB (decimal)
    expect(storageConverterDecimal.convert(1, 'MB', 'KB').toValue).toBe(1000);
  });

  it('meters-to-feet compute function produces expected formatted output', () => {
    // 10 meters -> 32.8084 feet
    const res = calculateMetersToFeet(10);
    expect(res.feet).toBeCloseTo(32.8084, 4);
    expect(res.feetAndInches).toContain('32 ft');
  });

  it('grams-to-lbs compute function produces expected pounds and ounces', () => {
    // 1000g -> ~2.20462 lbs -> 2 lbs 3.27 oz
    const res = calculateGramsToLbs(1000);
    expect(res.pounds).toBeCloseTo(2.2046, 3);
    expect(res.ounces).toBeCloseTo(35.274, 2);
  });

  it('hectare-to-acre compute function matches official geodetic factor', () => {
    // 1 ha = 2.47105 acres
    const res = calculateHectareToAcre(1);
    expect(res.acres).toBeCloseTo(2.47105, 4);
  });

  it('mb-to-kb-converter handles decimal and binary standards', () => {
    const res = calculateMbToKb(1);
    expect(res.KB).toBe(1000);
    expect(res.MiB).toBeCloseTo(0.95367, 3);
  });

  it('concrete calculator computes volume and premix bags correctly', () => {
    // Slab: 10ft x 10ft x 0.3333ft
    const res = calculateConcrete('slab', { length: 10, width: 10, thickness: 0.3333 }, 'ft', 'M20', 10);
    expect(res.volumeM3).toBeGreaterThan(0.9);
    expect(res.volumeWithWastageM3).toBeGreaterThan(res.volumeM3);
    expect(res.cementBags50kg).toBeGreaterThan(0);
  });

  it('square feet calculator computes rectangles and compound rooms', () => {
    // 12ft x 15ft = 180 sq ft
    const res = calculateArea('rectangle', { length: 12, width: 15 }, 'ft', 10);
    expect(res.sqFt).toBe(180);
    expect(res.sqFtWithWastage).toBe(198);
  });

  it('ms pipe weight calculator matches ASTM carbon steel density formula', () => {
    // OD = 114.3mm (4 inch pipe), WT = 6.02mm (SCH 40), length = 6m
    // Formula: (OD - WT) * WT * 0.02466 = (114.3 - 6.02) * 6.02 * 0.02466 = 16.077 kg/m * 6m = 96.46 kg
    const res = calculateMsPipeWeight(114.3, 6.02, 6, 1);
    expect(res.weightPerMeter).toBeCloseTo(16.077, 1);
    expect(res.totalWeight).toBeCloseTo(96.46, 1);
  });

  it('resin calculator calculates mix proportions for 1:1 and 2:1 systems', () => {
    // Slab 30cm x 30cm x 1cm = 900 cm³ * 1.1 g/cm³ = 990g total resin
    const res = calculateResin({
      shape: 'rectangle',
      length: 30,
      width: 30,
      depth: 1,
      unit: 'cm',
      ratio: '2:1',
      density: 1.1,
      wastagePct: 0,
    });
    expect(res.totalGrams).toBeCloseTo(990, 0);
    expect(res.partAMl + res.partBMl).toBeCloseTo(res.totalMl, 1);
  });

  it('fractions library and compute function work accurately', () => {
    expect(gcd(54, 24)).toBe(6);
    expect(simplifyFraction(36, 48).divisor).toBe(12);
    expect(addFractions({ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 6 }).numerator).toBe(1);

    const ptFrac = calcularFracao('adicao', 1, 2, 1, 4);
    expect(ptFrac.numeradorFinal).toBe(3);
    expect(ptFrac.denominadorFinal).toBe(4);
  });

  it('combinatorics and stats compute correctly', () => {
    expect(combination(10, 3)).toBe(120n);
    expect(permutation(10, 3)).toBe(720n);

    const stats = calculateStats([10, 12, 23, 23, 16, 23, 21, 16]);
    expect(stats.count).toBe(8);
    expect(stats.mean).toBe(18);
  });

  it('shunting yard and speed equations work properly', () => {
    const rpn = convertInfixToPostfix('3 + 4 * 2 / ( 1 - 5 ) ^ 2');
    expect(rpn.postfix).toBe('3 4 2 * 1 5 - 2 ^ / +');

    const speed = calculateSpeedDistanceTime('speed', {
      distance: 120,
      distanceUnit: 'km',
      time: 2,
      timeUnit: 'hours',
    });
    expect(speed.speedKmh).toBeCloseTo(60, 4);
  });

  it('Spanish and Portuguese percentage and proportion tools function accurately', () => {
    // 25% of 200 = 50
    const esPerc = calcularPorcentajeEs('xPorcentDeY', 25, 200);
    expect(esPerc.resultado).toBe(50);

    // 50 is what percent of 200 = 25%
    const ptPerc = calcularPorcentagemPtBr('xEQuePctDeY', 50, 200);
    expect(ptPerc.resultado).toBe(25);

    // Regra de 3: 2 -> 10, 4 -> X => X = 20
    const r3 = calcularRegraDeTres('direta', 2, 10, 4);
    expect(r3.x).toBe(20);
  });
});
