import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const rawTools = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'wave1-s1-tools.json'), 'utf8')
);

// Tools that are built as pages
const toolPages = rawTools.filter(
  (t: any) =>
    t.status === 'build' &&
    !(t.slug === 'calculadora' && t.folder === 'otras-calculadoras')
);

if (!fs.existsSync(distDir)) {
  console.error(`Error: 'dist' directory not found at ${distDir}. Run 'npm run build' first.`);
  process.exit(1);
}

const JS_BUDGET_BYTES = 30 * 1024; // <= 30 KB
const CSS_BUDGET_BYTES = 15 * 1024; // < 15 KB

interface PageReport {
  url: string;
  jsBytesGzip: number;
  cssBytesGzip: number;
  jsFiles: { src: string; size: number }[];
  cssFiles: { src: string; size: number }[];
  passed: boolean;
  violations: string[];
}

const reports: PageReport[] = [];
const assetCache = new Map<string, number>();

function getGzipSize(filePath: string): number {
  if (assetCache.has(filePath)) {
    return assetCache.get(filePath)!;
  }
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  const content = fs.readFileSync(filePath);
  const gzipped = zlib.gzipSync(content);
  const size = gzipped.length;
  assetCache.set(filePath, size);
  return size;
}

for (const tool of toolPages) {
  // Directory format: /folder/slug/ -> dist/folder/slug/index.html
  // or /lang/folder/slug/ -> dist/lang/folder/slug/index.html
  const cleanUrl = tool.url.replace(/^\/+|\/+$/g, '');
  const htmlPath = path.join(distDir, cleanUrl, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.warn(`Warning: Page HTML not found for ${tool.url} at ${htmlPath}`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');

  // Find JS files: <script ... src="..."
  const scriptRegex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const jsFiles: { src: string; size: number }[] = [];
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const src = scriptMatch[1];
    const assetRelative = src.startsWith('/') ? src.slice(1) : src;
    const assetPath = path.join(distDir, assetRelative.split('?')[0]);
    const size = getGzipSize(assetPath);
    jsFiles.push({ src, size });
  }

  // Also account for inline scripts
  const inlineScriptRegex = /<script\b(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  let inlineScriptMatch;
  while ((inlineScriptMatch = inlineScriptRegex.exec(html)) !== null) {
    const inlineContent = inlineScriptMatch[1].trim();
    if (inlineContent.length > 0) {
      const gzipped = zlib.gzipSync(Buffer.from(inlineContent));
      jsFiles.push({ src: 'inline-script', size: gzipped.length });
    }
  }

  // Find CSS files: <link rel="stylesheet" ... href="..."
  const cssRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const cssRegexAlt = /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi;
  const cssFiles: { src: string; size: number }[] = [];
  
  function processCssMatch(href: string) {
    const assetRelative = href.startsWith('/') ? href.slice(1) : href;
    const assetPath = path.join(distDir, assetRelative.split('?')[0]);
    const size = getGzipSize(assetPath);
    cssFiles.push({ src: href, size });
  }

  let cssMatch;
  while ((cssMatch = cssRegex.exec(html)) !== null) {
    processCssMatch(cssMatch[1]);
  }
  while ((cssMatch = cssRegexAlt.exec(html)) !== null) {
    if (!cssFiles.some((c) => c.src === cssMatch![1])) {
      processCssMatch(cssMatch[1]);
    }
  }

  // Inline styles
  const inlineStyleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let inlineStyleMatch;
  while ((inlineStyleMatch = inlineStyleRegex.exec(html)) !== null) {
    const inlineContent = inlineStyleMatch[1].trim();
    if (inlineContent.length > 0) {
      const gzipped = zlib.gzipSync(Buffer.from(inlineContent));
      cssFiles.push({ src: 'inline-style', size: gzipped.length });
    }
  }

  const totalJs = jsFiles.reduce((acc, f) => acc + f.size, 0);
  const totalCss = cssFiles.reduce((acc, f) => acc + f.size, 0);

  const violations: string[] = [];
  if (totalJs > JS_BUDGET_BYTES) {
    violations.push(
      `JS budget exceeded: ${(totalJs / 1024).toFixed(2)} KB > 30 KB limit`
    );
  }
  if (totalCss >= CSS_BUDGET_BYTES) {
    violations.push(
      `CSS budget exceeded: ${(totalCss / 1024).toFixed(2)} KB >= 15 KB limit`
    );
  }

  reports.push({
    url: tool.url,
    jsBytesGzip: totalJs,
    cssBytesGzip: totalCss,
    jsFiles,
    cssFiles,
    passed: violations.length === 0,
    violations,
  });
}

const offenders = reports.filter((r) => !r.passed);

console.log('------------------------------------------------------------');
console.log('PERFORMANCE BUDGET AUDIT REPORT');
console.log('------------------------------------------------------------');
console.log(`Audited ${reports.length} tool pages.`);

if (reports.length > 0) {
  const maxJs = Math.max(...reports.map((r) => r.jsBytesGzip));
  const maxCss = Math.max(...reports.map((r) => r.cssBytesGzip));
  const avgJs = reports.reduce((acc, r) => acc + r.jsBytesGzip, 0) / reports.length;
  const avgCss = reports.reduce((acc, r) => acc + r.cssBytesGzip, 0) / reports.length;

  console.log(`Max JS size: ${(maxJs / 1024).toFixed(2)} KB (budget: <= 30 KB)`);
  console.log(`Avg JS size: ${(avgJs / 1024).toFixed(2)} KB`);
  console.log(`Max CSS size: ${(maxCss / 1024).toFixed(2)} KB (budget: < 15 KB)`);
  console.log(`Avg CSS size: ${(avgCss / 1024).toFixed(2)} KB`);
}

if (offenders.length > 0) {
  console.error('\n🚨 BUDGET EXCEEDED! The following pages failed the performance budget:');
  for (const off of offenders) {
    console.error(`\nPage: ${off.url}`);
    for (const v of off.violations) {
      console.error(`  - ${v}`);
    }
    console.error('  Assets breakdown:');
    for (const j of off.jsFiles) {
      console.error(`    JS:  ${j.src} (${(j.size / 1024).toFixed(2)} KB gzip)`);
    }
    for (const c of off.cssFiles) {
      console.error(`    CSS: ${c.src} (${(c.size / 1024).toFixed(2)} KB gzip)`);
    }
  }
  console.log('------------------------------------------------------------');
  process.exit(1);
} else {
  console.log('\n✅ All tool pages passed performance budget (<= 30 KB JS, < 15 KB CSS gzipped).');
  console.log('------------------------------------------------------------');
  process.exit(0);
}
