// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
    sitemap({
      filter: (page) => !page.includes('/es/otras-calculadoras/calculadora/'),
    }),
  ],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
