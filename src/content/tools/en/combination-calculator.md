---
title: "Combination Calculator - nCr, nPr, Combinations & Permutatio"
description: "Calculate combinations (nCr) and permutations (nPr) with or without repetition. Features step-by-step factorial expansions and BigInt support for large numbers."
h1: "Combination & Permutation Calculator (nCr & nPr)"
intro: "Calculate the total number of ways to choose or arrange r items from a set of n elements. View detailed factorial steps, with or without order and repetition."
primaryKeyword: "combination calculator"
formula: "nCr = n! / (r! × (n - r)!)  |  nPr = n! / (n - r)!"
example: "Choosing 3 winners from 10 contestants where order does not matter (10C3) gives 10! / (3! × 7!) = 120 unique combinations."
faq:
  - q: "What is the key difference between a combination and a permutation?"
    a: "Order matters in a permutation, but does not matter in a combination. For example, selecting 3 numbers for a lottery ticket is a combination (1-2-3 is the same as 3-2-1). Choosing a 3-digit PIN code for your phone is a permutation (1-2-3 is distinct from 3-2-1)."
  - q: "What does n! (factorial) mean?"
    a: "Factorial of a non-negative integer n is the product of all positive integers less than or equal to n. For example, 5! = 5 × 4 × 3 × 2 × 1 = 120. By definition, 0! = 1."
  - q: "Can this calculator handle large values of n without floating-point overflow?"
    a: "Yes. Our calculation engine utilizes native arbitrary-precision BigInt arithmetic to avoid IEEE-754 floating-point rounding errors on large combinatorial values."
  - q: "What is combination with repetition?"
    a: "When choosing r items from n types where any item can be chosen multiple times (such as picking 4 donuts from 6 flavors), the formula is: (n + r - 1)! / (r! × (n - 1)!)."
sources:
  - label: "Source reference 1"
    url: "NIST Digital Library of Mathematical Functions - Combinatorics and Factorials"
  - label: "Source reference 2"
    url: "Mathematical Association of America (MAA) - Discrete Mathematics Resources"
updated: "2026-03-19"
related:
  - "standard-deviation-calculator"
  - "simplify-calculator"
  - "percentage-calculator"
  - "speed-calculator"
disclaimer: "none"
---

## Combinations and Permutations Explained

In combinatorial mathematics, counting problems arise whenever we need to determine the number of possible outcomes, groupings, or sequences from a finite collection of items.

### The Four Combinatorial Archetypes

Depending on whether **order matters** and whether **repetition is allowed**, we have four fundamental formulas:

| Type | Order Matters? | Repetition? | Formula | Notation |
|---|---|---|---|---|
| **Combination** | **No** | **No** | $\frac{n!}{r!(n - r)!}$ | $C(n, r) \text{ or } \binom{n}{r}$ |
| **Permutation** | **Yes** | **No** | $\frac{n!}{(n - r)!}$ | $P(n, r) \text{ or } ^n P_r$ |
| **Comb. with Repetition** | **No** | **Yes** | $\frac{(n + r - 1)!}{r!(n - 1)!}$ | $C(n + r - 1, r)$ |
| **Perm. with Repetition** | **Yes** | **Yes** | $n^r$ | $n^r$ |

---

### Step-by-Step Factorial Simplification

Consider calculating $\binom{8}{3}$ (choosing 3 members from an 8-person committee):

$$\binom{8}{3} = \frac{8!}{3!(8 - 3)!} = \frac{8!}{3! \times 5!}$$

Notice that the $5!$ in the denominator cancels out the lower factors of $8!$:

$$\binom{8}{3} = \frac{8 \times 7 \times 6 \times \cancel{5!}}{(3 \times 2 \times 1) \times \cancel{5!}} = \frac{8 \times 7 \times 6}{6} = 8 \times 7 = \mathbf{56}$$

By simplifying before multiplying, calculations remain efficient and mathematically exact.
