# Tools of Tools

A fast, static multi-language tools website built with Astro (TypeScript strict) and Tailwind CSS v4, optimized for Cloudflare Pages.

## Project Structure

```text
src/
  components/    # Reusable Astro components
  layouts/       # Base page layouts
  lib/           # Core utilities and data loaders
  tools/         # Plain TypeScript client-side interactive tool modules
  content/       # Markdown content collections
  data/          # Static JSON tool datasets
  i18n/          # Localization strings and language configs
  pages/         # Static routing and page templates
  styles/        # Global CSS with Tailwind v4
public/          # Static assets, robots.txt, _headers, _redirects
```

## Available Scripts

- `npm run dev`: Start local development server with hot module reloading.
- `npm run build`: Build static production output into `dist/`.
- `npm run preview`: Preview the production build locally.
- `npm run check`: Run Astro and TypeScript diagnostics (`astro check`).
- `npm run test`: Run unit test suite using Vitest (`vitest run`).
- `npm run audit`: Run audit check (placeholder exiting 0).

## Deployment

Designed for deployment on Cloudflare Pages as a pure static site (`dist/` directory, no SSR adapter required).
