---
title: "Simplify Calculator - Fractions & Expressions"
description: "Simplify fractions step by step. Enter numerator and denominator to get the simplest form, GCD, decimal equivalent, and mixed number. Instantly in your browser."
h1: "Simplify Calculator — Fractions Step by Step"
intro: "Enter a fraction's numerator and denominator to simplify it to lowest terms. The calculator shows the GCD, the simplified fraction, its decimal equivalent, and a step-by-step explanation."
primaryKeyword: "simplify calculator"
formula: "GCD(a, b) found using Euclidean algorithm:\n  repeat: a, b = b, a mod b until b = 0\nSimplified fraction: (numerator ÷ GCD) / (denominator ÷ GCD)"
example: "Simplify 24/36:\n1. GCD(24, 36): 36 mod 24=12; 24 mod 12=0 → GCD = 12\n2. 24 ÷ 12 = 2; 36 ÷ 12 = 3\n3. Simplified: 2/3\n4. Decimal: 2 ÷ 3 = 0.6667"
faq:
  - q: "What does 'simplify a fraction' mean?"
    a: "Simplifying (or reducing) a fraction means dividing both the numerator and denominator by their Greatest Common Divisor (GCD) until no whole number greater than 1 divides both evenly. The result is the fraction in 'lowest terms'."
  - q: "How do I simplify 12/18?"
    a: "GCD(12, 18) = 6. Divide both: 12÷6 = 2, 18÷6 = 3. So 12/18 simplifies to 2/3."
  - q: "Can a fraction be further simplified if GCD = 1?"
    a: "No. If GCD(numerator, denominator) = 1, the fraction is already in its simplest (irreducible) form. For example, 7/9 cannot be simplified because GCD(7,9) = 1."
  - q: "What is a mixed number?"
    a: "A mixed number combines a whole number and a proper fraction. For example, 7/3 = 2 and 1/3, written as 2⅓. It applies when |numerator| ≥ denominator."
  - q: "How does the Euclidean algorithm find the GCD?"
    a: "The Euclidean algorithm repeatedly replaces (a, b) with (b, a mod b) until b = 0. The last non-zero remainder is the GCD. Example for GCD(48, 18): 48 mod 18=12; 18 mod 12=6; 12 mod 6=0 → GCD = 6."
  - q: "Can I use this calculator for algebraic expressions?"
    a: "This tool simplifies numerical fractions using GCD. For algebraic expressions like (x²−1)/(x−1), you need a symbolic algebra simplifier (e.g., WolframAlpha or Symbolab). Our tool focuses on the numeric fraction case, which covers most real-world and exam needs."
sources:
  - label: "Euclidean algorithm — Khan Academy"
    url: "https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/the-euclidean-algorithm"
  - label: "Fractions — National Council of Teachers of Mathematics"
    url: "https://www.nctm.org"
updated: "2026-09-01"
related:
  - "combination-calculator"
  - "standard-deviation-calculator"
  - "speed-calculator"
  - "infix-to-postfix-converter"
disclaimer: "none"
---

## What Is a Simplified Fraction?

A fraction is in its simplest form (lowest terms) when the only positive integer that divides both the numerator and the denominator is 1. In other words, they share no common factors greater than 1.

- **24/36** → not simplified (GCD = 12) → simplifies to **2/3**
- **7/9** → already simplified (GCD = 1)
- **100/200** → GCD = 100 → simplifies to **1/2**

### The GCD Method (Standard Approach)

The Greatest Common Divisor is found using the **Euclidean algorithm**, one of the oldest known algorithms (circa 300 BC):

```
GCD(a, b):
  while b ≠ 0:
    a, b = b, a mod b
  return a
```

For GCD(36, 24):

| Step | a | b | a mod b |
|------|---|---|---------|
| 1 | 36 | 24 | 12 |
| 2 | 24 | 12 | 0 |
| Done | GCD = 12 | | |

Then: 36/24 = (36÷12)/(24÷12) = **3/2**

### When the Result Is a Mixed Number

If `|numerator| ≥ denominator`, the fraction is "improper" and can be expressed as a mixed number:

- 7/3: whole part = `floor(7/3) = 2`, remainder = `7 − 2×3 = 1` → **2 and 1/3**
- 9/4 = **2 and 1/4**
- Mixed numbers are common in cooking (2½ cups) and construction (3¾ inches)

### Common Mistakes When Simplifying

1. **Dividing by a common factor but not the GCD**: 8/12 → some students simplify by 2 to get 4/6, then by 2 again to get 2/3. This works, but finding the GCD first is more efficient.
2. **Changing the fraction's value**: Simplification does NOT change the value — 24/36 and 2/3 represent exactly the same part of a whole.
3. **Applying simplification to mixed-operation expressions**: You can only cancel common factors that appear in both numerator and denominator, not terms that are added or subtracted. `(x+3)/(x+3)` simplifies to 1, but `(x+3)/x` does not simplify further.

### Decimal and Percentage Equivalents

Once simplified, the decimal form is straightforward: divide the numerator by the denominator. Multiply by 100 for the percentage:

| Fraction | Simplified | Decimal | Percent |
|----------|------------|---------|---------|
| 2/4 | 1/2 | 0.5 | 50% |
| 6/9 | 2/3 | 0.6̄ | 66.67% |
| 15/20 | 3/4 | 0.75 | 75% |
| 12/16 | 3/4 | 0.75 | 75% |

### Why Simplification Matters

- **Test scores**: Unsimplified answers are typically marked wrong in school exams.
- **Cooking and recipes**: 8/16 cups is confusing; 1/2 cup is clear.
- **Engineering ratios**: Gear ratios and mix ratios are always expressed in lowest terms (1:3, not 2:6).
- **Probability**: A probability of 12/48 is immediately read as 1/4 (25%) when simplified.
