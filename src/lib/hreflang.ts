import { buildTools } from './tools';
import { getHtmlLang } from '../i18n';

export interface HreflangLink {
  lang: string;
  url: string;
}

export function getCanonicalToolUrl(tool: { lang: string; slug: string; url: string }): string {
  if (tool.lang === 'es' && tool.slug === 'calculadora') {
    return '/es/';
  }
  return tool.url;
}

export const canonicalHreflangGroups: Map<string, Array<{ lang: string; url: string }>> = new Map();
export const urlToHreflangGroup: Map<string, string> = new Map();

for (const tool of buildTools) {
  const group = tool.hreflang_group?.trim();
  if (group) {
    const canonicalUrl = getCanonicalToolUrl(tool);
    const existing = canonicalHreflangGroups.get(group) || [];
    // Ensure no duplicate URLs within a group
    if (!existing.some((e) => e.url === canonicalUrl)) {
      existing.push({ lang: tool.lang, url: canonicalUrl });
    }
    canonicalHreflangGroups.set(group, existing);

    urlToHreflangGroup.set(canonicalUrl, group);
    if (canonicalUrl !== tool.url) {
      urlToHreflangGroup.set(tool.url, group);
    }
  }
}

/**
 * Returns alternate links for a page.
 * - If page belongs to a hreflang group: returns all alternates from that group + self reference.
 * - Emits x-default pointing to the English URL ONLY when an English page exists in the group.
 * - If page is not in a group: returns only a self-referencing hreflang.
 */
export function getHreflang(currentUrl: string, currentLang?: string): HreflangLink[] {
  const normalizedUrl = currentUrl.endsWith('/') ? currentUrl : `${currentUrl}/`;
  const groupName = urlToHreflangGroup.get(normalizedUrl);

  if (!groupName) {
    let lang = currentLang;
    if (!lang) {
      if (normalizedUrl.startsWith('/pt-br/')) lang = 'pt-br';
      else if (normalizedUrl.startsWith('/es/')) lang = 'es';
      else lang = 'en';
    }
    return [{ lang: getHtmlLang(lang), url: normalizedUrl }];
  }

  const groupTargets = canonicalHreflangGroups.get(groupName) || [];
  const links: HreflangLink[] = [];

  for (const target of groupTargets) {
    links.push({
      lang: getHtmlLang(target.lang),
      url: target.url,
    });
  }

  const hasSelf = links.some((l) => l.url === normalizedUrl);
  if (!hasSelf && currentLang) {
    links.push({
      lang: getHtmlLang(currentLang),
      url: normalizedUrl,
    });
  }

  const englishTarget = groupTargets.find((t) => t.lang === 'en');
  if (englishTarget) {
    links.push({
      lang: 'x-default',
      url: englishTarget.url,
    });
  }

  return links;
}
