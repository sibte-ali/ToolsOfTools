import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(140).max(160),
    h1: z.string(),
    intro: z.string().max(320),
    primaryKeyword: z.string(),
    formula: z.string(),
    example: z.string(),
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .min(4)
      .max(6),
    sources: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      })
    ),
    updated: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Expected ISO date string',
    }),
    related: z.array(z.string()).min(4).max(6),
    disclaimer: z.enum(['none', 'finance', 'health', 'entertainment']),
  }),
});

export const collections = { tools };
