import { describe, it, expect } from 'vitest';
import {
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
} from './schema';

describe('JSON-LD schema generators', () => {
  it('generates valid WebApplication schema that parses cleanly and has required fields', () => {
    const data = generateWebApplicationSchema({
      name: 'SWP Calculator',
      url: 'https://toolsoftools.com/finance/swp-calculator/',
      description: 'Calculate monthly systematic withdrawals, remaining corpus, and gains.',
      category: 'FinanceApplication',
      operatingSystem: 'Any',
      inLanguage: 'en',
      currency: 'INR',
    });

    const parsed = JSON.parse(JSON.stringify(data));
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('WebApplication');
    expect(parsed.name).toBe('SWP Calculator');
    expect(parsed.url).toBe('https://toolsoftools.com/finance/swp-calculator/');
    expect(parsed.applicationCategory).toBe('FinanceApplication');
    expect(parsed.operatingSystem).toBe('Any');
    expect(parsed.inLanguage).toBe('en');
    expect(parsed.offers).toEqual({
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'INR',
    });
    expect(parsed.description).toBeTruthy();
  });

  it('generates valid BreadcrumbList schema with absolute URLs and 1-based positions', () => {
    const data = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://toolsoftools.com/' },
      { name: 'Finance', url: 'https://toolsoftools.com/finance/' },
      { name: 'SWP Calculator', url: 'https://toolsoftools.com/finance/swp-calculator/' },
    ]);

    const parsed = JSON.parse(JSON.stringify(data));
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('BreadcrumbList');
    expect(parsed.itemListElement).toHaveLength(3);
    expect(parsed.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://toolsoftools.com/',
    });
    expect(parsed.itemListElement[2].position).toBe(3);
  });

  it('generates FAQPage schema only when 4 or more FAQ items are provided', () => {
    const shortFaq = [
      { q: 'Q1', a: 'A1' },
      { q: 'Q2', a: 'A2' },
      { q: 'Q3', a: 'A3' },
    ];
    expect(generateFaqSchema(shortFaq)).toBeNull();

    const validFaq = [
      { q: 'What is SWP?', a: 'Systematic Withdrawal Plan.' },
      { q: 'How is interest computed?', a: 'Using monthly compounded returns.' },
      { q: 'Is it tax-efficient?', a: 'Yes, according to capital gains rules.' },
      { q: 'Can I change the monthly withdrawal?', a: 'Yes, anytime.' },
    ];

    const data = generateFaqSchema(validFaq);
    expect(data).not.toBeNull();
    const parsed = JSON.parse(JSON.stringify(data));
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('FAQPage');
    expect(parsed.mainEntity).toHaveLength(4);
    expect(parsed.mainEntity[0].name).toBe('What is SWP?');
    expect(parsed.mainEntity[0].acceptedAnswer.text).toBe('Systematic Withdrawal Plan.');
  });

  it('generates valid WebSite schema for home page', () => {
    const data = generateWebSiteSchema({
      siteUrl: 'https://toolsoftools.com/',
      name: 'ToolsOfTools',
      description: 'Free client-side online tools.',
      inLanguage: 'en',
    });

    const parsed = JSON.parse(JSON.stringify(data));
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('WebSite');
    expect(parsed.url).toBe('https://toolsoftools.com/');
    expect(parsed.name).toBe('ToolsOfTools');
    expect(parsed.inLanguage).toBe('en');
  });

  it('generates valid Organization schema for home page', () => {
    const data = generateOrganizationSchema({
      siteUrl: 'https://toolsoftools.com/',
      name: 'ToolsOfTools',
      logoUrl: 'https://toolsoftools.com/favicon.svg',
      description: 'Developer platform and client-side calculators.',
    });

    const parsed = JSON.parse(JSON.stringify(data));
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('Organization');
    expect(parsed.url).toBe('https://toolsoftools.com/');
    expect(parsed.logo).toBe('https://toolsoftools.com/favicon.svg');
    expect(parsed.name).toBe('ToolsOfTools');
  });
});
