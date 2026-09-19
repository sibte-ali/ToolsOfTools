import type { ChartData } from './types';

export interface RenderChartOptions {
  width?: number;
  height?: number;
  title?: string;
}

/**
 * Generic responsive SVG chart helper (line + stacked bar) under 2 KB gzipped.
 * Dependency-free, accessible, pure SVG string.
 */
export function renderSvgChart(
  data: ChartData,
  opts: RenderChartOptions = {}
): string {
  const w = opts.width || 600;
  const h = opts.height || 300;
  const title = opts.title || `${data.type} chart`;
  const m = { top: 25, right: 25, bottom: 45, left: 60 };
  const pw = w - m.left - m.right;
  const ph = h - m.top - m.bottom;

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const series = data.series.map((s, i) => ({
    ...s,
    color: s.color || colors[i % colors.length],
  }));

  const n = data.labels.length;
  if (n === 0 || series.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="w-full h-auto text-neutral-400"><text x="${w / 2}" y="${h / 2}" text-anchor="middle" fill="currentColor">No data</text></svg>`;
  }

  let maxY = 0;
  if (data.type === 'stacked') {
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (const s of series) sum += Math.max(0, s.values[i] || 0);
      if (sum > maxY) maxY = sum;
    }
  } else {
    for (const s of series) {
      for (const v of s.values) if (v > maxY) maxY = v;
    }
  }
  maxY = maxY === 0 ? 100 : maxY * 1.1;

  // Y axis ticks
  let grid = '<g stroke="currentColor" opacity="0.15">';
  let yLabels = '<g font-size="10" text-anchor="end" fill="currentColor" opacity="0.7">';
  for (let i = 0; i <= 4; i++) {
    const yVal = (maxY / 4) * i;
    const yPos = m.top + ph - (i / 4) * ph;
    const str = yVal >= 1e6 ? `${(yVal / 1e6).toFixed(1)}M` : yVal >= 1e3 ? `${(yVal / 1e3).toFixed(0)}k` : `${Math.round(yVal)}`;
    grid += `<line x1="${m.left}" y1="${yPos}" x2="${w - m.right}" y2="${yPos}" stroke-dasharray="3 3"/>`;
    yLabels += `<text x="${m.left - 6}" y="${yPos + 3}">${str}</text>`;
  }
  grid += '</g>';
  yLabels += '</g>';

  // X axis labels
  const stepX = pw / (n > 1 ? (data.type === 'stacked' ? n : n - 1) : 1);
  const interval = Math.ceil(n / 8);
  let xLabels = '<g font-size="10" text-anchor="middle" fill="currentColor" opacity="0.7">';
  for (let i = 0; i < n; i++) {
    if (i % interval === 0 || i === n - 1) {
      const xp = data.type === 'stacked' ? m.left + i * stepX + stepX / 2 : m.left + i * stepX;
      xLabels += `<text x="${xp.toFixed(1)}" y="${h - m.bottom + 16}">${data.labels[i]}</text>`;
    }
  }
  xLabels += '</g>';

  // Data content
  let body = '';
  if (data.type === 'line') {
    body = '<g>';
    for (const s of series) {
      const pts = s.values.map((v, i) => `${(m.left + i * stepX).toFixed(1)},${(m.top + ph - (v / maxY) * ph).toFixed(1)}`).join(' ');
      body += `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${pts}"/>`;
      if (n <= 15) {
        for (let i = 0; i < n; i++) {
          body += `<circle cx="${(m.left + i * stepX).toFixed(1)}" cy="${(m.top + ph - (s.values[i] / maxY) * ph).toFixed(1)}" r="3" fill="${s.color}"/>`;
        }
      }
    }
    body += '</g>';
  } else {
    body = '<g>';
    const bw = Math.max(4, Math.min(36, stepX * 0.7));
    for (let i = 0; i < n; i++) {
      const x = m.left + i * stepX + (stepX - bw) / 2;
      let curY = m.top + ph;
      for (const s of series) {
        const val = Math.max(0, s.values[i] || 0);
        const bh = (val / maxY) * ph;
        const y = curY - bh;
        if (bh > 0.5) body += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${s.color}" rx="1"/>`;
        curY = y;
      }
    }
    body += '</g>';
  }

  // Legend
  let legend = '<g font-size="11" fill="currentColor">';
  let legX = m.left;
  for (const s of series) {
    legend += `<circle cx="${legX + 4}" cy="14" r="4" fill="${s.color}"/><text x="${legX + 12}" y="17">${s.name}</text>`;
    legX += s.name.length * 7 + 28;
  }
  legend += '</g>';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="w-full h-auto text-neutral-800 dark:text-neutral-200 select-none font-sans" role="img" aria-label="${title}"><title>${title}</title>${grid}${body}${yLabels}${xLabels}${legend}</svg>`;
}
