import type { ToolConfig, ToolInput, OutputFormat } from './types';
import { renderSvgChart } from './chart';

// Glob all tool definitions lazily
const toolModules = import.meta.glob('/src/tools/**/*.ts');

function formatOutput(
  val: any,
  format: OutputFormat,
  locale: string,
  currency = 'USD'
): string {
  if (val === undefined || val === null) return '';
  if (typeof val === 'string') return val;

  const num = Number(val);
  if (isNaN(num)) return String(val);

  switch (format) {
    case 'currency':
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,
        }).format(num);
      } catch {
        return `${currency} ${num.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
      }
    case 'percent':
      return `${num.toLocaleString(locale, { maximumFractionDigits: 2 })}%`;
    case 'number':
      return num.toLocaleString(locale, { maximumFractionDigits: 2 });
    case 'duration':
      return `${num} days`;
    case 'date':
      return new Date(val).toLocaleDateString(locale);
    case 'text':
    default:
      return String(val);
  }
}

export async function hydrateCalculator(container: HTMLElement) {
  const toolId = container.getAttribute('data-tool-id');
  const numberLocale = container.getAttribute('data-number-locale') || 'en-US';
  const currency = container.getAttribute('data-currency') || 'USD';

  if (!toolId) return;

  const toolLang = container.getAttribute('data-tool-lang')?.toLowerCase();

  // Find module in toolModules
  let matchingKey: string | undefined;
  if (toolLang) {
    for (const key of Object.keys(toolModules)) {
      if (key.includes(`/${toolLang}/${toolId}.ts`)) {
        matchingKey = key;
        break;
      }
    }
  }
  if (!matchingKey) {
    for (const key of Object.keys(toolModules)) {
      if (key.endsWith(`/${toolId}.ts`) || key.includes(`/${toolId}/`)) {
        matchingKey = key;
        break;
      }
    }
  }

  if (!matchingKey) {
    // Tool config was rendered statically or module not found
    return;
  }

  const mod: any = await toolModules[matchingKey]();
  const config: ToolConfig = mod.config || mod.default;
  if (!config) return;

  const form = container.querySelector('form.calculator-form') as HTMLFormElement;
  const copyBtn = container.querySelector('[data-action="copy-result"]') as HTMLButtonElement;
  const resetBtn = container.querySelector('[data-action="reset"]') as HTMLButtonElement;
  const chartContainer = container.querySelector('[data-chart-container]') as HTMLElement;
  const tableContainer = container.querySelector('[data-table-container]') as HTMLElement;

  // 1. Read URL search params to populate form
  const urlParams = new URLSearchParams(window.location.search);
  let hasUrlState = false;

  for (const input of config.inputs) {
    if (input.type === 'rows') {
      const rowsParam = urlParams.get(input.key);
      if (rowsParam) {
        try {
          const parsedRows = JSON.parse(rowsParam);
          renderRowsInput(container, input, parsedRows);
          hasUrlState = true;
        } catch {}
      }
    } else {
      const val = urlParams.get(input.key);
      if (val !== null) {
        hasUrlState = true;
        const el = form?.querySelector(`[name="${input.key}"]`) as HTMLInputElement | HTMLSelectElement;
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            const radio = form.querySelector(`[name="${input.key}"][value="${val}"]`) as HTMLInputElement;
            if (radio) radio.checked = true;
          } else {
            el.value = val;
          }
        }
      }
    }
  }

  // 2. Read values from form
  function getFormValues(): Record<string, any> {
    const values: Record<string, any> = {};
    if (!form) return values;

    for (const input of config.inputs) {
      if (input.type === 'rows') {
        const rowsEl = container.querySelector(`[data-rows-for="${input.key}"]`);
        const rows: any[] = [];
        if (rowsEl) {
          rowsEl.querySelectorAll('.calculator-row-item').forEach((rowEl) => {
            const rowData: Record<string, any> = {};
            rowEl.querySelectorAll('[data-row-field]').forEach((fieldEl) => {
              const fKey = fieldEl.getAttribute('data-row-field')!;
              const fInput = fieldEl as HTMLInputElement;
              rowData[fKey] = fInput.type === 'number' ? parseFloat(fInput.value) || 0 : fInput.value;
            });
            rows.push(rowData);
          });
        }
        values[input.key] = rows;
      } else {
        const el = form.querySelector(`[name="${input.key}"]`) as HTMLInputElement | HTMLSelectElement;
        if (!el) continue;

        if (input.type === 'number') {
          values[input.key] = parseFloat(el.value) || 0;
        } else if (el.type === 'radio') {
          const checked = form.querySelector(`[name="${input.key}"]:checked`) as HTMLInputElement;
          values[input.key] = checked ? checked.value : input.default;
        } else {
          values[input.key] = el.value;
        }
      }
    }

    return values;
  }

  // 3. Validation
  function validateInputs(values: Record<string, any>): boolean {
    let isValid = true;
    for (const input of config.inputs) {
      const errorEl = container.querySelector(`[data-error-for="${input.key}"]`);
      if (!errorEl) continue;

      errorEl.textContent = '';
      errorEl.classList.add('hidden');

      if (input.type === 'number') {
        const val = values[input.key];
        if (input.min !== undefined && val < input.min) {
          errorEl.textContent = `Value must be at least ${input.min}${input.unit ? ' ' + input.unit : ''}`;
          errorEl.classList.remove('hidden');
          isValid = false;
        } else if (input.max !== undefined && val > input.max) {
          errorEl.textContent = `Value cannot exceed ${input.max}${input.unit ? ' ' + input.unit : ''}`;
          errorEl.classList.remove('hidden');
          isValid = false;
        }
      }
    }
    return isValid;
  }

  // 4. Update shareable URL state
  function updateShareableUrl(values: Record<string, any>) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) {
      if (typeof v === 'object') {
        params.set(k, JSON.stringify(v));
      } else if (v !== undefined && v !== '') {
        params.set(k, String(v));
      }
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }

  // 5. Compute & Update UI
  function updateCalculation() {
    const values = getFormValues();
    if (!validateInputs(values)) return;

    try {
      const result = config.compute(values);
      if (result instanceof Error) {
        showGlobalError(result.message);
        return;
      }

      clearGlobalError();

      // Update outputs
      for (const output of config.outputs) {
        const outEl = container.querySelector(`[data-output-key="${output.key}"]`);
        if (outEl) {
          const formatted = formatOutput(result[output.key], output.format, numberLocale, currency);
          outEl.textContent = formatted;
        }
      }

      // Update table if table function exists
      if (config.table && tableContainer) {
        const tableData = config.table(values);
        renderTable(tableContainer, tableData, numberLocale, currency);
      }

      // Update chart if chart enabled
      if (config.chart && config.chart !== 'none' && chartContainer && result.chartData) {
        const svg = renderSvgChart(result.chartData);
        chartContainer.innerHTML = svg;
      }

      updateShareableUrl(values);
    } catch (err: any) {
      showGlobalError(err?.message || 'Calculation error');
    }
  }

  function showGlobalError(msg: string) {
    const errEl = container.querySelector('[data-global-error]');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    }
  }

  function clearGlobalError() {
    const errEl = container.querySelector('[data-global-error]');
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.add('hidden');
    }
  }

  // Row inputs support (add / remove)
  function setupRowInputs() {
    for (const input of config.inputs) {
      if (input.type === 'rows') {
        const addBtn = container.querySelector(`[data-add-row="${input.key}"]`);
        addBtn?.addEventListener('click', () => {
          const rowsList = container.querySelector(`[data-rows-for="${input.key}"]`);
          if (rowsList) {
            const newRow = createRowElement(input, input.default?.[0] || {});
            rowsList.appendChild(newRow);
            updateCalculation();
          }
        });

        // Delegate remove
        const rowsList = container.querySelector(`[data-rows-for="${input.key}"]`);
        rowsList?.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-remove-row]')) {
            const rowItem = target.closest('.calculator-row-item');
            if (rowItem && rowsList.children.length > 1) {
              rowItem.remove();
              updateCalculation();
            }
          }
        });
      }
    }
  }

  // Reset button
  resetBtn?.addEventListener('click', () => {
    form?.reset();
    window.history.replaceState(null, '', window.location.pathname);
    updateCalculation();
  });

  // Copy result button
  copyBtn?.addEventListener('click', async () => {
    const outputsToCopy: string[] = [];
    for (const out of config.outputs) {
      const outEl = container.querySelector(`[data-output-key="${out.key}"]`);
      if (outEl) {
        outputsToCopy.push(`${out.label}: ${outEl.textContent?.trim()}`);
      }
    }
    const copyText = outputsToCopy.join('\n');
    try {
      await navigator.clipboard.writeText(copyText);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch {}
  });

  // Form input listeners
  form?.addEventListener('input', () => updateCalculation());
  form?.addEventListener('change', () => updateCalculation());
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    updateCalculation();
  });

  setupRowInputs();

  if (hasUrlState) {
    updateCalculation();
  }
}

function createRowElement(input: ToolInput, rowData: Record<string, any>): HTMLElement {
  const row = document.createElement('div');
  row.className = 'calculator-row-item flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700';

  const fields = input.rowFields || [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'amount', label: 'Amount', type: 'number' },
  ];

  for (const field of fields) {
    const val = rowData[field.key] ?? field.default ?? '';
    const fieldWrap = document.createElement('div');
    fieldWrap.className = 'flex-1';
    fieldWrap.innerHTML = `
      <input
        type="${field.type}"
        data-row-field="${field.key}"
        value="${val}"
        class="w-full text-xs font-mono rounded border border-neutral-300 dark:border-neutral-700 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
        placeholder="${field.label}"
      />
    `;
    row.appendChild(fieldWrap);
  }

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.setAttribute('data-remove-row', 'true');
  removeBtn.className = 'text-xs text-red-500 hover:text-red-700 p-1 cursor-pointer';
  removeBtn.innerHTML = '&times;';
  row.appendChild(removeBtn);

  return row;
}

function renderRowsInput(container: HTMLElement, input: ToolInput, rowsData: any[]) {
  const rowsList = container.querySelector(`[data-rows-for="${input.key}"]`);
  if (!rowsList) return;
  rowsList.innerHTML = '';
  for (const row of rowsData) {
    rowsList.appendChild(createRowElement(input, row));
  }
}

function renderTable(
  container: HTMLElement,
  data: any,
  locale: string,
  currency: string
) {
  const rows = Array.isArray(data) ? data : data?.rows || [];
  const columns = data?.columns || (rows.length > 0 ? Object.keys(rows[0]).map((k) => ({ key: k, label: k })) : []);

  if (rows.length === 0) {
    container.innerHTML = '';
    return;
  }

  let tableHtml = `
    <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table class="w-full text-left text-xs font-mono">
        <thead class="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          <tr>
            ${columns.map((c: any) => `<th class="px-4 py-2.5 font-semibold capitalize">${c.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
          ${rows.map((row: any) => `
            <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
              ${columns.map((c: any) => `<td class="px-4 py-2">${formatOutput(row[c.key], c.format || 'number', locale, currency)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
}

// Auto initialize all calculators on page
function initAllCalculators() {
  document.querySelectorAll('[data-calculator-tool]').forEach((el) => {
    hydrateCalculator(el as HTMLElement);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCalculators);
  } else {
    initAllCalculators();
  }
  document.addEventListener('astro:page-load', initAllCalculators);
}
