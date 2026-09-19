import type { ToolConfig } from '../../lib/engine/types';
import { convertInfixToPostfix } from '../../lib/math/shunting-yard';

const config: ToolConfig = {
  id: 'infix-to-postfix-converter',
  lang: 'en',
  numberLocale: 'en-US',
  inputs: [
    {
      key: 'expression',
      label: 'Infix Expression',
      type: 'text',
      default: '(A + B) * C - D / E',
      help: 'Use + - * / ^ and parentheses. Examples: 3+4*2, (A+B)*C, 2^3+1',
    },
    {
      key: 'showPrefix',
      label: 'Also Show Prefix Notation',
      type: 'select',
      default: 'yes',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
  ],
  compute(values) {
    const expr = String(values.expression || '(A + B) * C - D / E');
    const res = convertInfixToPostfix(expr);
    if (res.error) return new Error(res.error);
    return {
      postfix: res.postfix,
      prefix: res.prefix,
      evaluated: res.evaluated !== null ? String(res.evaluated) : 'N/A (contains variables)',
      infix: res.infix,
      stepCount: res.steps.length,
    };
  },
  outputs: [
    { key: 'postfix', label: 'Postfix (Reverse Polish Notation)', format: 'text', highlight: true },
    { key: 'prefix', label: 'Prefix (Polish Notation)', format: 'text' },
    { key: 'evaluated', label: 'Evaluated Result', format: 'text' },
    { key: 'infix', label: 'Original Infix', format: 'text' },
  ],
  table(values) {
    const expr = String(values.expression || '(A + B) * C - D / E');
    const res = convertInfixToPostfix(expr);
    if (res.error || res.steps.length === 0) return { columns: [], rows: [] };
    return {
      columns: [
        { key: 'token', label: 'Token', format: 'text' },
        { key: 'action', label: 'Action', format: 'text' },
        { key: 'stack', label: 'Stack', format: 'text' },
        { key: 'output', label: 'Output Queue', format: 'text' },
      ],
      rows: res.steps.map((s) => ({
        token: s.token,
        action: s.action,
        stack: s.stack || '(empty)',
        output: s.output || '(empty)',
      })),
    };
  },
};

export default config;
