---
title: "Standard Deviation Calculator - Sample & Population (with St"
description: "Calculate standard deviation, variance, mean, and sum of squares for sample (s) and population (σ). Includes full step-by-step calculation table."
h1: "Standard Deviation & Variance Calculator"
intro: "Calculate sample standard deviation, population standard deviation, mean, median, variance, and standard error. Paste comma- or space-separated datasets to view the full calculation table."
primaryKeyword: "standard deviation calculator"
formula: "Sample s = √[∑(xi - x̄)² / (n - 1)]  |  Population σ = √[∑(xi - μ)² / N]"
example: "For the dataset [10, 12, 23, 23, 16, 23, 21, 16]: count n = 8, mean = 18.00, sample variance s² = 28.57, sample standard deviation s = 5.35."
faq:
  - q: "What is the difference between sample and population standard deviation?"
    a: "Population standard deviation (σ) divides the sum of squared differences by N (the entire universe of data). Sample standard deviation (s) divides by (n - 1), known as Bessel's correction, which eliminates bias when estimating a broader population from a smaller sample."
  - q: "Why do we use Bessel's correction (n - 1) for samples?"
    a: "Because sample data points naturally cluster closer to their sample mean than to the true unknown population mean, dividing by n systematically underestimates true variability. Dividing by (n - 1) corrects this bias."
  - q: "What is the 68-95-99.7 Empirical Rule in a normal distribution?"
    a: "For data following a normal Gaussian curve: ~68.2% of observations fall within ±1 standard deviation of the mean, ~95.4% fall within ±2 standard deviations, and ~99.7% fall within ±3 standard deviations."
  - q: "How does standard deviation relate to variance?"
    a: "Standard deviation is simply the square root of the variance. While variance is expressed in squared units (e.g., dollars² or kg²), standard deviation returns the dispersion measure to the original unit of the data."
sources:
  - label: "Source reference 1"
    url: "NIST/SEMATECH e-Handbook of Statistical Methods - Measures of Dispersion"
  - label: "Source reference 2"
    url: "ISO 3534-1:2006 - Statistics - Vocabulary and Symbols - General Statistical Terms"
updated: "2026-03-19"
related:
  - "combination-calculator"
  - "simplify-calculator"
  - "percentage-calculator"
  - "speed-calculator"
disclaimer: "none"
---

## Measures of Dispersion: Standard Deviation & Variance

In descriptive and inferential statistics, measuring central tendency (mean, median, mode) only reveals half the picture. Two datasets can have identical averages (e.g., 50) while representing vastly different risk profiles: one clustered between 48 and 52, and another scattered between 0 and 100. **Standard deviation** quantifies the average spread or dispersion of data around the mean.

### Mathematical Formulas

#### 1. Mean (Arithmetic Average)
$$\bar{x} = \frac{1}{n} \sum_{i=1}^n x_i$$

#### 2. Sample Standard Deviation ($s$)
Used when your data is a sample drawn from a larger population:
$$s = \sqrt{\frac{\sum_{i=1}^n (x_i - \bar{x})^2}{n - 1}}$$

#### 3. Population Standard Deviation ($\sigma$)
Used when your dataset encompasses all members of the group of interest:
$$\sigma = \sqrt{\frac{\sum_{i=1}^N (x_i - \mu)^2}{N}}$$

---

### Step-by-Step Procedure

1. **Calculate the Mean ($\bar{x}$):** Add all values and divide by the total count $n$.
2. **Find the Deviations:** Subtract the mean from each individual data point: $(x_i - \bar{x})$.
3. **Square Each Deviation:** Square each difference to eliminate negative signs: $(x_i - \bar{x})^2$.
4. **Sum the Squared Deviations ($SS$):** Total all squared deviations: $\sum (x_i - \bar{x})^2$.
5. **Divide by Degrees of Freedom:** Divide by $(n - 1)$ for sample variance, or by $N$ for population variance.
6. **Take the Square Root:** The square root yields the standard deviation.
