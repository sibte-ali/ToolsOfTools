import { describe, it, expect } from 'vitest';

// Import Batch C tool calculations
import { calculateCalories } from './en/calorie-calculator';
import { calculateIdealWeight } from './en/ideal-weight-calculator';
import { classifyBodyShape } from './en/body-shape-calculator';
import { computeBmiTool } from './en/bmi-calculator';
import { calculateBarbellPlates } from './en/plate-weight-calculator';
import { computePaceTool } from './en/pace-calculator';
import { computeCalorieBurn } from './en/calorie-burn-calculator';

import { calcularPacePtBr } from './pt-br/calculadora-de-pace';
import { calcularCaloriasPtBr } from './pt-br/calculadora-de-calorias';
import { calcularMacrosPtBr } from './pt-br/calculadora-de-macros';
import { calcularTdeePtBr } from './pt-br/tdee-calculator';
import { calcularImcPtBr } from './pt-br/imc';

import { calcularRitmoEs } from './es/calculadora-de-ritmos';

describe('Batch C Health and Fitness Tools Unit Tests', () => {
  // 1. Calorie Calculator (EN)
  describe('calorie-calculator', () => {
    it('calculates calories for male with weight loss goal (Mifflin-St Jeor benchmark)', () => {
      // Benchmark: Male, 30yo, 75kg, 178cm, moderate activity
      // BMR = 10*75 + 6.25*178 - 5*30 + 5 = 750 + 1112.5 - 150 + 5 = 1717.5 -> 1718 kcal
      // TDEE = 1718 * 1.55 = 2662.9 -> 2663 kcal
      // Weight loss = 2663 - 500 = 2163 kcal
      const res = calculateCalories({
        gender: 'male',
        age: 30,
        weight: 75,
        height: 178,
        activityLevel: 'moderate',
        goal: 'weight_loss'
      });
      expect(res.bmr).toBe(1718);
      expect(res.tdee).toBe(2663);
      expect(res.targetCalories).toBe(2163);
      expect(res.proteinGrams).toBe(150); // 75kg * 2.0g/kg
    });

    it('calculates calories for female with maintenance goal', () => {
      // Benchmark: Female, 25yo, 60kg, 165cm, light activity
      // BMR = 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345 kcal
      // TDEE = 1345 * 1.375 = 1849.375 -> 1849 kcal
      const res = calculateCalories({
        gender: 'female',
        age: 25,
        weight: 60,
        height: 165,
        activityLevel: 'light',
        goal: 'maintain'
      });
      expect(res.bmr).toBe(1345);
      expect(res.tdee).toBe(1849);
      expect(res.targetCalories).toBe(1849);
    });
  });

  // 2. Ideal Weight Calculator (EN)
  describe('ideal-weight-calculator', () => {
    it('calculates ideal weights for male 178cm (70.1 in -> 10.1 in over 60)', () => {
      // Devine (1974): 50 + 2.3*10.1 = 73.23 -> 73.2 kg
      // Robinson (1983): 52 + 1.9*10.1 = 71.19 -> 71.2 kg
      const res = calculateIdealWeight({
        unitSystem: 'metric',
        gender: 'male',
        height: 178
      });
      expect(res.devineWeight).toBe(73.2);
      expect(res.robinsonWeight).toBe(71.2);
      expect(res.averageWeight).toBeGreaterThan(68);
      expect(res.averageWeight).toBeLessThan(75);
    });

    it('calculates ideal weights for female 165cm (65.0 in -> 5.0 in over 60)', () => {
      // Devine (1974): 45.5 + 2.3*5.0 = 57.0 kg
      // Robinson (1983): 49.0 + 1.7*5.0 = 57.5 kg
      const res = calculateIdealWeight({
        unitSystem: 'metric',
        gender: 'female',
        height: 165
      });
      expect(res.devineWeight).toBe(57.0);
      expect(res.robinsonWeight).toBe(57.5);
    });
  });

  // 3. Body Shape Calculator (EN)
  describe('body-shape-calculator', () => {
    it('identifies classic hourglass silhouette', () => {
      // Bust: 92, Waist: 68, High Hip: 84, Hip: 94
      // Waist/Bust = 0.739 (<= 0.75), Waist/Hip = 0.723 (<= 0.75), Bust/Hip diff = 2.1% (<= 5%)
      const res = classifyBodyShape({
        bust: 92,
        waist: 68,
        highHip: 84,
        hip: 94
      });
      expect(res.bodyShape).toBe('Hourglass');
      expect(res.waistToHipRatio).toBe(0.72);
    });

    it('identifies pear / triangle silhouette', () => {
      // Bust: 85, Waist: 70, High Hip: 90, Hip: 102
      // Hip > Bust * 1.05 (102 > 89.25), Waist/Hip = 0.686
      const res = classifyBodyShape({
        bust: 85,
        waist: 70,
        highHip: 90,
        hip: 102
      });
      expect(res.bodyShape).toBe('Pear (Triangle)');
      expect(res.waistToHipRatio).toBe(0.69);
    });
  });

  // 4. BMI Calculator (EN)
  describe('bmi-calculator', () => {
    it('computes WHO standard category for normal weight adult', () => {
      // 70 kg, 175 cm -> 22.857 -> 22.9
      const res = computeBmiTool({
        unitSystem: 'metric',
        gender: 'male',
        age: 28,
        height: 175,
        weight: 70,
        populationStandard: 'who'
      });
      expect(res.bmi).toBe(22.9);
      expect(res.category).toBe('Normal weight');
    });

    it('applies Asian population cut-off (23.0 threshold for overweight)', () => {
      // 72 kg, 175 cm -> 72 / 3.0625 = 23.51 -> 23.5 BMI
      const res = computeBmiTool({
        unitSystem: 'metric',
        gender: 'female',
        age: 32,
        height: 175,
        weight: 72,
        populationStandard: 'asian'
      });
      expect(res.bmi).toBe(23.5);
      expect(res.category).toBe('Overweight (Increased Risk)');
    });
  });

  // 5. Plate Weight Calculator (EN)
  describe('plate-weight-calculator', () => {
    it('calculates barbell plates for 100kg lift on standard 20kg bar', () => {
      // 100 - 20 = 80 kg total on sleeves -> 40 kg per side
      // Available plates: 25, 20, 15, 10, 5, 2.5, 1.25 kg
      // Greedy load: 1x25kg, 1x15kg = 40kg per side
      const res = calculateBarbellPlates({
        unitSystem: 'metric',
        targetWeight: 100,
        barWeight: 20
      });
      expect(res.achievedWeight).toBe(100);
      expect(res.unachievedWeight).toBe(0);
      expect(res.weightPerSide).toBe(40);
      expect(res.platesPerSideString).toContain('1 × 25 kg');
      expect(res.platesPerSideString).toContain('1 × 15 kg');
    });

    it('calculates imperial plates for 225lb lift on 45lb barbell', () => {
      // 225 - 45 = 180 lb -> 90 lb per side
      // Available plates: 45, 35, 25, 10, 5, 2.5 lb
      // Greedy load: 2x45lb per side
      const res = calculateBarbellPlates({
        unitSystem: 'imperial',
        targetWeight: 225,
        barWeight: 45
      });
      expect(res.achievedWeight).toBe(225);
      expect(res.unachievedWeight).toBe(0);
      expect(res.weightPerSide).toBe(90);
      expect(res.platesPerSideString).toBe('2 × 45 lb');
    });
  });

  // 6. Pace Calculator (EN)
  describe('pace-calculator', () => {
    it('computes 5:00/km pace for 10K in 50 minutes', () => {
      const res = computePaceTool({
        distancePreset: '10k',
        timeHours: 0,
        timeMinutes: 50,
        timeSeconds: 0
      });
      expect(res.paceKm).toBe('5:00 /km');
      expect(res.speedKmh).toBe(12);
      expect(res.pred5k).toBe('25:00');
    });

    it('computes 5K in 22:30 pace and speed', () => {
      // 5 km in 22:30 (1350s) -> 270 sec/km = 4:30 /km. Speed = 5 / (22.5/60) = 13.33 km/h
      const res = computePaceTool({
        distancePreset: '5k',
        timeHours: 0,
        timeMinutes: 22,
        timeSeconds: 30
      });
      expect(res.paceKm).toBe('4:30 /km');
      expect(res.speedKmh).toBe(13.33);
    });
  });

  // 7. Calorie Burn Calculator (EN)
  describe('calorie-burn-calculator', () => {
    it('calculates calories burned for 10km/h running (MET 9.8)', () => {
      // 70kg, 45 mins -> 9.8 * 70 * (45/60) = 514.5 -> 515 kcal
      const res = computeCalorieBurn({
        activityId: 'running_10kmh',
        weight: 70,
        durationMinutes: 45
      });
      expect(res.totalCalories).toBe(515);
      expect(res.pizzaSlices).toBe(1.8);
    });

    it('calculates calories burned for moderate walking (MET 3.5)', () => {
      // 60kg, 60 mins -> 3.5 * 60 * 1 = 210 kcal
      const res = computeCalorieBurn({
        activityId: 'walking_moderate',
        weight: 60,
        durationMinutes: 60
      });
      expect(res.totalCalories).toBe(210);
    });
  });

  // 8. Calculadora de Pace (PT-BR)
  describe('calculadora-de-pace (pt-br)', () => {
    it('calcula ritmo para 5 km em 25 minutos', () => {
      const res = calcularPacePtBr({
        distanciaPadrao: '5k',
        horas: 0,
        minutos: 25,
        segundos: 0
      });
      expect(res.ritmoKm).toBe('5:00 /km');
      expect(res.velocidadeKmh).toBe(12);
      expect(res.previsao10k).toBe('50:00');
    });

    it('calcula Meia Maratona (21.1 km) em 1h45min', () => {
      // 6300 segundos para 21.0975 km = 298.61 seg/km -> 4:59 /km
      const res = calcularPacePtBr({
        distanciaPadrao: 'half',
        horas: 1,
        minutos: 45,
        segundos: 0
      });
      expect(res.ritmoKm).toBe('4:59 /km');
      expect(res.velocidadeKmh).toBe(12.06);
    });
  });

  // 9. Calculadora de Calorias (PT-BR)
  describe('calculadora-de-calorias (pt-br)', () => {
    it('calcula TMB e meta de emagrecimento para homem', () => {
      // Homem, 28a, 72kg, 175cm, moderado
      // TMB = 10*72 + 6.25*175 - 5*28 + 5 = 1679 kcal. GET = 1679 * 1.55 = 2602 kcal
      // Meta emagrecer = 2602 - 500 = 2102 kcal
      const res = calcularCaloriasPtBr({
        sexo: 'male',
        idade: 28,
        peso: 72,
        altura: 175,
        nivelAtividade: 'moderate',
        objetivo: 'emagrecer'
      });
      expect(res.tmb).toBe(1679);
      expect(res.get).toBe(2602);
      expect(res.metaCalorica).toBe(2102);
    });

    it('calcula TMB e meta de manutenção para mulher', () => {
      // Mulher, 32a, 62kg, 163cm, leve
      // TMB = 10*62 + 6.25*163 - 5*32 - 161 = 1318 kcal. GET = 1318 * 1.375 = 1812 kcal
      const res = calcularCaloriasPtBr({
        sexo: 'female',
        idade: 32,
        peso: 62,
        altura: 163,
        nivelAtividade: 'light',
        objetivo: 'manter'
      });
      expect(res.tmb).toBe(1318);
      expect(res.get).toBe(1812);
      expect(res.metaCalorica).toBe(1812);
    });
  });

  // 10. Calculadora de Macros (PT-BR)
  describe('calculadora-de-macros (pt-br)', () => {
    it('distribui macronutrientes para 2200 kcal e 75kg em 4 refeições', () => {
      // 75kg * 2.0g/kg = 150g proteína (600 kcal)
      // 25% gordura = 550 kcal / 9 = 61.1g
      // Carbos = (2200 - 600 - 550) / 4 = 1050 / 4 = 262.5g
      const res = calcularMacrosPtBr({
        caloriasTotais: 2200,
        pesoKg: 75,
        proteinaGPorKg: 2.0,
        gorduraPct: 25,
        refeicoesAoDia: 4
      });
      expect(res.proteinasTotais).toBe(150);
      expect(res.gordurasTotais).toBe(61.1);
      expect(res.carboidratosTotais).toBe(262.5);
      expect(res.refeicoes.length).toBe(4);
      expect(res.proteinaPorRefeicao).toBe(37.5);
    });

    it('distribui macros para 1800 kcal e 60kg em 3 refeições', () => {
      // 60kg * 1.8g/kg = 108g proteína (432 kcal)
      // 20% gordura = 360 kcal / 9 = 40g
      // Carbos = (1800 - 432 - 360) / 4 = 1008 / 4 = 252g
      const res = calcularMacrosPtBr({
        caloriasTotais: 1800,
        pesoKg: 60,
        proteinaGPorKg: 1.8,
        gorduraPct: 20,
        refeicoesAoDia: 3
      });
      expect(res.proteinasTotais).toBe(108);
      expect(res.gordurasTotais).toBe(40);
      expect(res.carboidratosTotais).toBe(252);
    });
  });

  // 11. TDEE Calculator (PT-BR)
  describe('tdee-calculator (pt-br)', () => {
    it('calcula TDEE com fórmula Mifflin-St Jeor', () => {
      // Homem, 30a, 75kg, 178cm, moderado -> TMB 1718, TDEE 2663
      const res = calcularTdeePtBr({
        formula: 'mifflin',
        sexo: 'male',
        idade: 30,
        peso: 75,
        altura: 178,
        nivelAtividade: 'moderate'
      });
      expect(res.tmb).toBe(1718);
      expect(res.tdee).toBe(2663);
      expect(res.metaEmagrecer).toBe(2163);
    });

    it('calcula TDEE com fórmula Harris-Benedict revisada', () => {
      // Homem: 88.362 + (13.397*75) + (4.799*178) - (5.677*30) = 88.362 + 1004.775 + 854.222 - 170.31 = 1777.049 -> 1777 kcal
      // TDEE = 1777 * 1.55 = 2754.35 -> 2754 kcal
      const res = calcularTdeePtBr({
        formula: 'harris_benedict',
        sexo: 'male',
        idade: 30,
        peso: 75,
        altura: 178,
        nivelAtividade: 'moderate'
      });
      expect(res.tmb).toBe(1777);
      expect(res.tdee).toBe(2754);
    });
  });

  // 12. IMC (PT-BR)
  describe('imc (pt-br)', () => {
    it('calcula IMC para peso normal (OMS)', () => {
      // 70kg, 175cm -> 22.9
      const res = calcularImcPtBr({
        peso: 70,
        altura: 175,
        idade: 28,
        sexo: 'male'
      });
      expect(res.imc).toBe(22.9);
      expect(res.classificacao).toBe('Peso normal');
    });

    it('identifica Obesidade Grau I para 95kg e 175cm', () => {
      // 95 / (1.75^2) = 95 / 3.0625 = 31.02 -> 31.0
      const res = calcularImcPtBr({
        peso: 95,
        altura: 175,
        idade: 35,
        sexo: 'male'
      });
      expect(res.imc).toBe(31.0);
      expect(res.classificacao).toBe('Obesidade Grau I');
      expect(res.diferencaPeso).toBeGreaterThan(15);
    });
  });

  // 13. Calculadora de Ritmos (ES)
  describe('calculadora-de-ritmos (es)', () => {
    it('calcula ritmo para 10 km en 45 minutos', () => {
      // 2700s / 10 = 270s/km -> 4:30 /km. Velocidad = 13.33 km/h
      const res = calcularRitmoEs({
        distanciaPreset: '10k',
        horas: 0,
        minutos: 45,
        segundos: 0
      });
      expect(res.ritmoKm).toBe('4:30 /km');
      expect(res.velocidadKmh).toBe(13.33);
    });

    it('calcula Maratón (42.2 km) en 3 horas 30 minutos', () => {
      // 12600s / 42.195 = 298.61s/km -> 4:59 /km
      const res = calcularRitmoEs({
        distanciaPreset: 'marathon',
        horas: 3,
        minutos: 30,
        segundos: 0
      });
      expect(res.ritmoKm).toBe('4:59 /km');
      expect(res.velocidadKmh).toBe(12.06);
    });
  });
});
