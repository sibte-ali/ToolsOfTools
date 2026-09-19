import type { ToolConfig } from '../../lib/engine/types';
import ingredientsData from '../../data/ingredients.json';

export function calculateMlToGrams(ml: number, ingredientKey: string): {
  ml: number;
  grams: number;
  density: number;
  ingredientLabel: string;
  approximate: boolean;
} {
  const ingredient = ingredientsData.ingredients.find((i) => i.key === ingredientKey)
    ?? ingredientsData.ingredients[0]; // fallback: water
  const grams = ml * ingredient.density;
  return {
    ml,
    grams,
    density: ingredient.density,
    ingredientLabel: ingredient.label,
    approximate: ingredient.approximate,
  };
}

const config: ToolConfig = {
  id: 'ml-to-grams-converter',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'ml',
      label: 'Volume in Millilitres (mL)',
      type: 'number',
      min: 0,
      max: 100_000,
      step: 1,
      default: 100,
      unit: 'mL',
    },
    {
      key: 'ingredientKey',
      label: 'Ingredient / Substance',
      type: 'select',
      default: 'water',
      options: ingredientsData.ingredients.map((i) => ({
        value: i.key,
        label: `${i.label} (${i.density} g/mL${i.approximate ? ' ≈' : ''})`,
      })),
    },
  ],
  compute(values) {
    const ml = Math.max(0, Number(values.ml) || 100);
    const ingredientKey = String(values.ingredientKey || 'water');
    return calculateMlToGrams(ml, ingredientKey);
  },
  outputs: [
    { key: 'grams', label: 'Weight in Grams (g)', format: 'number', highlight: true },
    { key: 'density', label: 'Density Used (g/mL)', format: 'number' },
    { key: 'ingredientLabel', label: 'Ingredient', format: 'text' },
  ],
  table(values) {
    const ingredientKey = String(values.ingredientKey || 'water');
    const commonMl = [5, 10, 25, 50, 100, 150, 200, 250, 500, 1000];
    const ingredient = ingredientsData.ingredients.find((i) => i.key === ingredientKey)
      ?? ingredientsData.ingredients[0];
    return {
      columns: [
        { key: 'ml', label: 'mL', format: 'number' },
        { key: 'grams', label: `Grams (${ingredient.label})`, format: 'number' },
      ],
      rows: commonMl.map((ml) => ({
        ml,
        grams: +(ml * ingredient.density).toFixed(3),
      })),
    };
  },
};

export default config;
