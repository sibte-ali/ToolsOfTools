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

// Tool hreflang groups
for (const tool of buildTools) {
  const group = tool.hreflang_group?.trim();
  if (group) {
    const canonicalUrl = getCanonicalToolUrl(tool);
    const existing = canonicalHreflangGroups.get(group) || [];
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

// Static informational pages groups across languages
const staticPageGroups: Record<string, Array<{ lang: string; url: string }>> = {
  about: [
    { lang: 'en', url: '/about/' },
    { lang: 'pt-br', url: '/pt-br/about/' },
    { lang: 'es', url: '/es/about/' },
  ],
  privacy: [
    { lang: 'en', url: '/privacy/' },
    { lang: 'pt-br', url: '/pt-br/privacy/' },
    { lang: 'es', url: '/es/privacy/' },
  ],
  contact: [
    { lang: 'en', url: '/contact/' },
    { lang: 'pt-br', url: '/pt-br/contact/' },
    { lang: 'es', url: '/es/contact/' },
  ],
  methodology: [
    { lang: 'en', url: '/methodology/' },
    { lang: 'pt-br', url: '/pt-br/methodology/' },
    { lang: 'es', url: '/es/methodology/' },
  ],
};

for (const [groupName, targets] of Object.entries(staticPageGroups)) {
  canonicalHreflangGroups.set(groupName, targets);
  for (const target of targets) {
    urlToHreflangGroup.set(target.url, groupName);
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

  // Hindi font tools are English-only; return strictly a self-referencing English hreflang
  if (normalizedUrl.includes('/font-converters/')) {
    return [{ lang: 'en', url: normalizedUrl }];
  }

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
