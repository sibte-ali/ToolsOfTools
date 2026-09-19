---
title: "Body Shape Calculator - Silhouette & Ratio Assessment"
description: "Classify your body shape with our free silhouette calculator. Find out if you are hourglass, pear, rectangle, or apple with styling advice and WHR metrics."
h1: "Body Shape Calculator"
intro: "Discover your body silhouette shape and waist-to-hip proportions by entering bust, waist, high hip, and hip circumferences for customized styling guidance."
primaryKeyword: "body shape calculator"
formula: "\\text{WHR} = \\frac{\\text{Waist}}{\\text{Hip}}, \\quad \\text{Hourglass: } \\frac{|\\text{Bust} - \\text{Hip}|}{\\max(\\text{Bust}, \\text{Hip})} \\le 0.05 \\text{ and } \\frac{\\text{Waist}}{\\text{Bust}} \\le 0.75"
example: "For measurements of 92 cm bust, 68 cm waist, 84 cm high hip, and 94 cm hips, the calculated waist-to-hip ratio is 0.72, categorizing the silhouette as a classic Hourglass."
faq:
  - q: "How do I take accurate body measurements for this calculator?"
    a: "Use a flexible tailor's measuring tape held level to the floor without compressing the skin. Measure the bust at the fullest point, the waist at the narrowest torso point (above the navel), and the hips across the widest portion of the buttocks."
  - q: "What is the difference between body shape and BMI?"
    a: "Body Mass Index (BMI) measures total weight relative to height, whereas body shape evaluates fat and skeletal distribution. Two individuals with the exact same healthy BMI can have completely distinct pear or rectangle silhouettes."
  - q: "Can my body shape change with diet and exercise?"
    a: "Your skeletal proportions (pelvic width, ribcage circumference) are genetic, but localized muscle hypertrophic training (e.g. glutes, deltoids) and overall body fat reduction can noticeably enhance waist taper and curves."
  - q: "What does Waist-to-Hip Ratio (WHR) signify for health?"
    a: "The World Health Organization identifies WHR as an important marker of metabolic health. Ratios above 0.85 for women or 0.90 for men indicate elevated abdominal (visceral) fat storage associated with cardiovascular risk."
  - q: "Is this calculator suitable for men?"
    a: "This specific classification algorithm evaluates classic female fashion geometry (hourglass, pear, spoon, inverted triangle). For men, waist-to-hip ratio and chest-to-waist taper are the primary metrics."
sources:
  - label: "World Health Organization: Waist Circumference and Waist-Hip Ratio Report"
    url: "https://www.who.int/publications/i/item/9789241501491"
  - label: "International Journal of Clothing Science: Body Shape Analysis"
    url: "https://www.emerald.com/insight/publication/issn/0955-6222"
updated: "2026-03-01"
related:
  - "ideal-weight-calculator"
  - "bmi-calculator"
  - "calorie-calculator"
  - "plate-weight-calculator"
disclaimer: "health"
---

## Understanding Human Body Silhouettes and Proportions

Every human body possesses a distinctive morphological structure defined by genetics, skeletal architecture, and hormone-mediated adipose distribution. In apparel design, personal styling, and anthropometry, standardizing body silhouettes into identifiable categories helps individuals choose flattering cuts, balanced tailoring, and supportive garments.

Beyond fashion aesthetics, measuring anatomical circumferences provides actionable data on central fat storage via the clinically validated Waist-to-Hip Ratio (WHR).

### Geometric Shape Classifications

Our algorithm evaluates proportional relationships between your upper torso, natural waistline, and pelvic circumference:

#### 1. The Hourglass Figure
- **Geometry**: The bust and hip circumferences are closely balanced (within 5% variance), while the waist is sharply defined ($\text{Waist} \le 0.75 \times \text{Bust}$ and $\text{Waist} \le 0.75 \times \text{Hip}$).
- **Styling Focus**: Fitted knitwear, wrap dresses, belted coats, and high-rise bottoms that follow natural curves without adding boxy volume.

#### 2. The Pear (Triangle / Spoon) Figure
- **Geometry**: The hips are noticeably broader than the bust and shoulders ($\text{Hip} \ge 1.05 \times \text{Bust}$), accompanied by a distinct waistline.
- **Styling Focus**: Boat necklines, shoulder pads, statement sleeves, and A-line skirts that draw visual attention upward toward the collarbone.

#### 3. The Rectangle (Banana / Athletic) Figure
- **Geometry**: Bust, waist, and hips share roughly similar dimensions without a dramatically tapered waist ($\text{Waist} > 0.75 \times \text{Bust}$).
- **Styling Focus**: Cinched belts, peplum tops, sweetheart necklines, and fit-and-flare skirts to create optical curve dimensions.

#### 4. The Inverted Triangle Figure
- **Geometry**: The shoulders or bust are significantly broader than the hips ($\text{Bust} \ge 1.05 \times \text{Hip}$), tapering to a narrow waist and hips.
- **Styling Focus**: Deep V-necks, wide-leg trousers, flared palazzo pants, and pocket detailing on skirts to build visual volume in the lower body.

#### 5. The Apple (Round) Figure
- **Geometry**: The waist measurement equals or exceeds bust and hip circumferences, with mass centered across the midsection.
- **Styling Focus**: Empire waists, flowy tunic tops, structured jackets worn open, and monochromatic vertical styling lines.

### Practical Worked Demonstration

Consider an individual recording the following body measurements:
- **Bust**: $92\text{ cm}$
- **Waist**: $68\text{ cm}$
- **High Hip**: $84\text{ cm}$
- **Full Hip**: $94\text{ cm}$

1. **Calculate Ratios**:
   - Bust-to-Hip Variance: $|92 - 94| / 94 = 2 / 94 = 2.13\%$ ($\le 5\%$).
   - Waist-to-Bust Ratio: $68 / 92 = 0.739$ ($\le 0.75$).
   - Waist-to-Hip Ratio (WHR): $68 / 94 = \mathbf{0.723}$ ($\le 0.75$).

2. **Classification**:
   - Because bust and hip match within 2.1% and the waist is under 74% of both circumferences, this represents a **Classic Hourglass** silhouette.
   - The WHR of $0.72$ falls squarely in the healthy range recommended by the World Health Organization ($< 0.80$ for low cardiometabolic risk).

### Clinical Considerations: WHR vs. Overall Weight

While body shape classification is primarily an aesthetic and lifestyle tool, central abdominal obesity is an independent cardiovascular risk factor. If waist measurement exceeds 88 cm (35 inches) for women or 102 cm (40 inches) for men, visceral adipose deposits around internal organs can elevate insulin resistance.

To check overall clinical weight status, consult our [bmi calculator](/health/bmi-calculator/) or calculate baseline daily energy requirements with our [calorie calculator](/health/calorie-calculator/).
