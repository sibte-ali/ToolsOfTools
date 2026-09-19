/**
 * Shunting-Yard algorithm: converts infix expressions to postfix (RPN)
 * and optionally evaluates them. Produces a step-by-step trace table.
 *
 * Supported operators: + - * / ^ and parentheses ( )
 * NO eval() is used anywhere.
 */

export type TokenType = 'number' | 'operator' | 'lparen' | 'rparen' | 'unknown';

export interface Token {
  value: string;
  type: TokenType;
}

export interface ShuntingStep {
  token: string;
  action: string;
  stack: string;
  output: string;
}

export interface ShuntingResult {
  infix: string;
  postfix: string;
  prefix: string;
  steps: ShuntingStep[];
  evaluated: number | null;
  error?: string;
}

const OPERATORS: Record<string, { precedence: number; rightAssociative: boolean }> = {
  '+': { precedence: 1, rightAssociative: false },
  '-': { precedence: 1, rightAssociative: false },
  '*': { precedence: 2, rightAssociative: false },
  '/': { precedence: 2, rightAssociative: false },
  '^': { precedence: 3, rightAssociative: true },
};

/**
 * Tokenize an infix expression string.
 */
export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ' || ch === '\t') { i++; continue; }

    // Numbers (including decimals)
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(expr[i + 1] ?? ''))) {
      let num = '';
      while (i < expr.length && /[\d.]/.test(expr[i])) {
        num += expr[i++];
      }
      tokens.push({ value: num, type: 'number' });
      continue;
    }

    // Unary minus (negation): preceded by nothing, operator, or lparen
    if (ch === '-' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'operator' || tokens[tokens.length - 1].type === 'lparen')) {
      // Try to consume a number
      i++;
      let num = '-';
      while (i < expr.length && /[\d.]/.test(expr[i])) {
        num += expr[i++];
      }
      if (num.length > 1) {
        tokens.push({ value: num, type: 'number' });
        continue;
      } else {
        // lone minus — treat as operator
        tokens.push({ value: '-', type: 'operator' });
        continue;
      }
    }

    if (OPERATORS[ch]) { tokens.push({ value: ch, type: 'operator' }); i++; continue; }
    if (ch === '(') { tokens.push({ value: ch, type: 'lparen' }); i++; continue; }
    if (ch === ')') { tokens.push({ value: ch, type: 'rparen' }); i++; continue; }

    tokens.push({ value: ch, type: 'unknown' }); i++;
  }
  return tokens;
}

/**
 * Shunting-Yard: infix tokens → postfix tokens + step trace.
 */
export function shuntingYard(tokens: Token[]): { postfix: Token[]; steps: ShuntingStep[] } {
  const output: Token[] = [];
  const stack: Token[] = [];
  const steps: ShuntingStep[] = [];

  function snap(token: string, action: string): void {
    steps.push({
      token,
      action,
      stack: stack.map((t) => t.value).join(' '),
      output: output.map((t) => t.value).join(' '),
    });
  }

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
      snap(token.value, 'Number → output');
    } else if (token.type === 'operator') {
      const op = OPERATORS[token.value];
      while (
        stack.length > 0 &&
        stack[stack.length - 1].type === 'operator' &&
        (() => {
          const top = OPERATORS[stack[stack.length - 1].value];
          return top.precedence > op.precedence || (top.precedence === op.precedence && !op.rightAssociative);
        })()
      ) {
        output.push(stack.pop()!);
      }
      stack.push(token);
      snap(token.value, 'Operator → stack');
    } else if (token.type === 'lparen') {
      stack.push(token);
      snap('(', 'Left paren → stack');
    } else if (token.type === 'rparen') {
      while (stack.length > 0 && stack[stack.length - 1].type !== 'lparen') {
        output.push(stack.pop()!);
      }
      if (stack.length === 0) throw new Error('Mismatched parentheses');
      stack.pop(); // discard left paren
      snap(')', 'Right paren: pop to output until (');
    }
  }

  while (stack.length > 0) {
    const top = stack.pop()!;
    if (top.type === 'lparen' || top.type === 'rparen') throw new Error('Mismatched parentheses');
    output.push(top);
  }
  snap('—', 'End: flush remaining operators');

  return { postfix: output, steps };
}

/**
 * Evaluate a postfix token array.
 */
export function evaluatePostfix(tokens: Token[]): number {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token.type === 'number') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'operator') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression');
      switch (token.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
        case '^': stack.push(Math.pow(a, b)); break;
        default: throw new Error(`Unknown operator: ${token.value}`);
      }
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

/**
 * Convert postfix token array to prefix notation (recursive rebuild).
 */
export function postfixToPrefix(tokens: Token[]): string {
  const stack: string[] = [];
  for (const token of tokens) {
    if (token.type === 'number') {
      stack.push(token.value);
    } else if (token.type === 'operator') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression');
      stack.push(`${token.value} ${a} ${b}`);
    }
  }
  return stack[0] ?? '';
}

/**
 * Full pipeline: infix string → postfix + prefix + steps + evaluated value.
 */
export function convertInfixToPostfix(infixExpr: string): ShuntingResult {
  try {
    const tokens = tokenize(infixExpr.trim());
    const { postfix, steps } = shuntingYard(tokens);
    const postfixStr = postfix.map((t) => t.value).join(' ');
    const prefix = postfixToPrefix(postfix);
    const evaluated = evaluatePostfix(postfix);
    return { infix: infixExpr, postfix: postfixStr, prefix, steps, evaluated };
  } catch (e) {
    return {
      infix: infixExpr,
      postfix: '',
      prefix: '',
      steps: [],
      evaluated: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
