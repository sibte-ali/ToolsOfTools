// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';

/** @type {Map<string, string>} */
const lastmodMap = new Map();
try {
  const toolsData = JSON.parse(
    fs.readFileSync(new URL('./src/data/wave1-s1-tools.json', import.meta.url), 'utf8')
  );
  const now = new Date().toISOString();
  for (const tool of toolsData) {
    if (tool.status === 'build') {
      const canonicalPath =
        tool.slug === 'calculadora' && tool.lang === 'es' ? '/es/' : tool.url;
      lastmodMap.set(canonicalPath, tool.updated || now);
    }
  }
} catch {
  // fallback
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://toolsoftools.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  compressHTML: true,
  prefetch: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    preact(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          'pt-br': 'pt-BR',
          es: 'es',
        },
      },
      filter: (page) => {
        // Exclude redirect-only URLs
        if (page.includes('/es/otras-calculadoras/calculadora/')) return false;
        // Exclude 404 page
        if (page.includes('/404')) return false;
        // Exclude non-English font-converters (Hindi tools are English-only)
        if (page.match(/\/(es|pt-br|it|fr|de|nl|ru|jp|cn|kr|sa|il)\/font-converters\//)) return false;
        return true;
      },
      serialize(item) {
        try {
          const urlObj = new URL(item.url);
          const pathname = urlObj.pathname;
          if (lastmodMap.has(pathname)) {
            item.lastmod = lastmodMap.get(pathname);
          } else {
            item.lastmod = new Date().toISOString();
          }
        } catch {
          item.lastmod = new Date().toISOString();
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
    optimizeDeps: {
      exclude: ['@astrojs/preact', '@astrojs/preact/server.js'],
      esbuildOptions: {
        plugins: [
          {
            name: 'resolve-astro-preact-opts',
            setup(build) {
              build.onResolve({ filter: /^astro:preact:opts$/ }, () => ({
                path: 'astro:preact:opts',
                namespace: 'astro-preact-opts',
              }));
              build.onLoad({ filter: /.*/, namespace: 'astro-preact-opts' }, () => ({
                contents: 'export default {}',
                loader: 'js',
              }));
            },
          },
        ],
      },
    },
  },
});
