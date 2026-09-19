export interface WebAppSchemaOptions {
  name: string;
  url: string;
  description: string;
  category?: string;
  operatingSystem?: string;
  inLanguage: string;
  currency?: string;
}

export function generateWebApplicationSchema(opts: WebAppSchemaOptions): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    url: opts.url,
    description: opts.description,
    applicationCategory: opts.category || 'UtilitiesApplication',
    operatingSystem: opts.operatingSystem || 'Any',
    inLanguage: opts.inLanguage,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: opts.currency || 'USD',
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function generateFaqSchema(faq?: FaqItem[]): Record<string, any> | null {
  if (!faq || faq.length < 4) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export interface WebSiteSchemaOptions {
  siteUrl: string;
  name: string;
  description: string;
  inLanguage: string;
}

export function generateWebSiteSchema(opts: WebSiteSchemaOptions): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: opts.siteUrl,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.inLanguage,
  };
}

export interface OrganizationSchemaOptions {
  siteUrl: string;
  name: string;
  logoUrl: string;
  description: string;
}

export function generateOrganizationSchema(opts: OrganizationSchemaOptions): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    url: opts.siteUrl,
    logo: opts.logoUrl,
    description: opts.description,
  };
}
