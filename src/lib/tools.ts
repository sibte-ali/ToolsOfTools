import { z } from 'zod';
import rawTools from '../data/wave1-s1-tools.json';

export const ToolSchema = z.object({
  keyword: z.string(),
  lang: z.enum(['en', 'es', 'pt-br']),
  folder: z.string(),
  slug: z.string(),
  url: z.string(),
  volume: z.number().optional(),
  global_volume: z.number().optional(),
  kd: z.number().optional(),
  hreflang_group: z.string().optional().default(''),
  risk_flags: z.string().optional().default(''),
  status: z.enum(['build', 'hold', 'merge']).or(z.string()),
  batch: z.string().optional(),
  template: z.string().optional(),
  spec: z.string().optional(),
  reason: z.string().optional(),
  move_to: z.string().optional(),
  merge_into: z.string().optional(),
});

export type Tool = z.infer<typeof ToolSchema>;

export const allTools: Tool[] = z.array(ToolSchema).parse(rawTools);

// Validate uniqueness of URLs and required fields for 'build' status tools
const seenUrls = new Set<string>();
for (const tool of allTools) {
  if (seenUrls.has(tool.url)) {
    throw new Error(`Build validation failed: duplicate tool URL detected: "${tool.url}"`);
  }
  seenUrls.add(tool.url);

  if (tool.status === 'build') {
    if (!tool.batch || !tool.template || !tool.spec) {
      throw new Error(
        `Build validation failed: build tool "${tool.slug}" (${tool.url}) is missing required metadata (spec, batch, or template).`
      );
    }
  }
}

export const buildTools: Tool[] = allTools.filter((tool) => tool.status === 'build');

export function toolsByLang(lang: string): Tool[] {
  return buildTools.filter((tool) => tool.lang === lang);
}

export function toolByUrl(url: string): Tool | undefined {
  return buildTools.find((tool) => tool.url === url);
}

export function foldersByLang(lang: string): string[] {
  const folders = new Set<string>();
  for (const tool of buildTools) {
    if (tool.lang === lang) {
      folders.add(tool.folder);
    }
  }
  return Array.from(folders);
}

export interface HreflangTarget {
  lang: string;
  url: string;
}

export const hreflangGroups: Map<string, HreflangTarget[]> = new Map();
for (const tool of buildTools) {
  const group = tool.hreflang_group?.trim();
  if (group) {
    const existing = hreflangGroups.get(group) || [];
    existing.push({ lang: tool.lang, url: tool.url });
    hreflangGroups.set(group, existing);
  }
}
