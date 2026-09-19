---
title: "Infix to Postfix Converter - Shunting Yard Algorithm Step-by"
description: "Convert infix mathematical expressions to postfix (Reverse Polish Notation - RPN) and prefix. Features live step-by-step trace table of tokens, stack."
h1: "Infix to Postfix Converter (Shunting-Yard)"
intro: "Convert standard infix arithmetic expressions into postfix (Reverse Polish Notation) with Dijkstra's Shunting-Yard algorithm. Inspect every step in the trace table."
primaryKeyword: "infix to postfix converter"
formula: "Dijkstra's Shunting-Yard Algorithm (Stack-based operator precedence and associativity)"
example: "Infix expression 'a + b * c - (d / e ^ f)' converts to Postfix 'a b c * + d e f ^ / -'."
faq:
  - q: "What is the difference between infix, postfix, and prefix notation?"
    a: "In infix notation, operators sit between operands (e.g. A + B), requiring parentheses to establish precedence. In postfix notation (Reverse Polish Notation), operators follow operands (e.g. A B +), eliminating the need for parentheses. In prefix notation (Polish Notation), operators precede operands (e.g. + A B)."
  - q: "How does Dijkstra's Shunting-Yard algorithm handle operator precedence?"
    a: "Incoming operators with lower or equal precedence cause operators with higher precedence to be popped from the operator stack onto the output queue. Exponentiation (^) has highest precedence and right-associativity, multiplication/division (*, /) have medium precedence, and addition/subtraction (+, -) have lowest precedence."
  - q: "Why do compilers and virtual machines convert expressions to postfix?"
    a: "Postfix expressions can be evaluated linearly in a single pass using an evaluation stack in O(n) time and O(n) space without back-tracking or tree traversal overhead."
  - q: "What happens when a closing parenthesis ')' is encountered?"
    a: "The algorithm pops operators from the stack to the output until the matching opening parenthesis '(' is found on the stack. The opening parenthesis is then discarded without being added to the output."
sources:
  - label: "Source reference 1"
    url: "Edsger W. Dijkstra - Numerieke Wiskunde: Translating Infix to Reverse Polish Notation"
  - label: "Source reference 2"
    url: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman - Compilers: Principles, Techniques, and Tools (Dragon Book)"
updated: "2026-03-19"
related:
  - "simplify-calculator"
  - "json-formatter"
  - "json-to-excel"
  - "combination-calculator"
disclaimer: "none"
---

## Understanding the Shunting-Yard Algorithm

First invented by computer science pioneer **Edsger W. Dijkstra**, the **Shunting-Yard algorithm** takes inspiration from a railroad switching yard: train cars (tokens) either proceed straight down the track (output queue) or are shunted aside onto a siding (operator stack) until tracks are clear.

### Operator Precedence & Associativity Table

| Operator | Description | Precedence Level | Associativity |
|---|---|---|---|
| **^** | Exponentiation / Power | 4 (Highest) | Right-to-Left |
| **\*** | Multiplication | 3 | Left-to-Right |
| **/** | Division | 3 | Left-to-Right |
| **+** | Addition | 2 | Left-to-Right |
| **-** | Subtraction | 2 (Lowest) | Left-to-Right |
| **(**, **)** | Grouping Parentheses | Special | Non-associative |

---

### Step-by-Step Worked Example: `3 + 4 * 2 / ( 1 - 5 ) ^ 2`

1. `3` $\rightarrow$ Operand $\rightarrow$ Output: `3`
2. `+` $\rightarrow$ Push to stack: `[+]`
3. `4` $\rightarrow$ Operand $\rightarrow$ Output: `3 4`
4. `*` $\rightarrow$ Higher precedence than `+` $\rightarrow$ Push to stack: `[+, *]`
5. `2` $\rightarrow$ Operand $\rightarrow$ Output: `3 4 2`
6. `/` $\rightarrow$ Same precedence as `*`, left-associative: Pop `*` to output, push `/`: Stack `[+, /]`, Output `3 4 2 *`
7. `(` $\rightarrow$ Push to stack: `[+, /, ( ]`
8. `1` $\rightarrow$ Output: `3 4 2 * 1`
9. `-` $\rightarrow$ Push to stack: `[+, /, (, -]`
10. `5` $\rightarrow$ Output: `3 4 2 * 1 5`
11. `)` $\rightarrow$ Pop until `(`: Pop `-` to output, discard `(`: Stack `[+, /]`, Output `3 4 2 * 1 5 -`
12. `^` $\rightarrow$ Higher precedence than `/` $\rightarrow$ Push: Stack `[+, /, ^]`
13. `2` $\rightarrow$ Output: `3 4 2 * 1 5 - 2`
14. End of expression $\rightarrow$ Pop remaining operators: Pop `^`, pop `/`, pop `+`.

**Final Postfix Output:** `3 4 2 * 1 5 - 2 ^ / +`
