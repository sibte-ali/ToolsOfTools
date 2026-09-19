---
title: "MS Pipe Weight Calculator - Mild Steel Round Pipe & Tube Wei"
description: "Calculate mild steel (MS) round pipe weight in kg/m, pounds/foot, and total tonnage. Enter outer diameter (OD), wall thickness, and length with standard."
h1: "MS Pipe Weight Calculator"
intro: "Calculate linear weight (kg/m) and total batch weight for mild steel (MS), carbon steel, and stainless steel circular pipes and structural hollow tubes."
primaryKeyword: "ms pipe weight calculator"
formula: "Weight (kg/m) = (OD - WT) × WT × 0.02466  |  Total Weight (kg) = Weight (kg/m) × Length (m) × Qty"
example: "A circular MS pipe with Outer Diameter (OD) of 60.3 mm, Wall Thickness (WT) of 3.6 mm, and length of 6 meters weighs approximately 5.03 kg per meter, yielding 30.20 kg for the full 6-meter pipe."
faq:
  - q: "What is the standard formula for MS pipe weight per meter?"
    a: "Weight (kg/m) = (OD - WT) × WT × 0.0246615, where OD is the Outer Diameter in millimeters and WT is the Wall Thickness in millimeters, assuming standard steel density of 7,850 kg/m³ (0.00785 g/mm³)."
  - q: "Where does the multiplier 0.02466 come from?"
    a: "The cross-sectional area of a hollow circular tube is π × (OD - WT) × WT. Multiplying by the density of steel (0.00000785 kg/mm³) and 1,000 mm gives: π × 0.007850 = 0.0246615."
  - q: "What is the difference between Nominal Bore (NB) and Outer Diameter (OD)?"
    a: "Nominal Bore (NB) or Nominal Pipe Size (NPS) is a designation reference, not a direct measurement. For example, a 2-inch NB pipe (DN 50) has an actual physical outer diameter of 60.3 mm."
  - q: "Can this formula be used for stainless steel or aluminum pipes?"
    a: "For 304/316 Stainless Steel (density ~7,930 to 8,000 kg/m³), multiply the result by 1.015. For aluminum (density ~2,700 kg/m³), multiply the result by 0.344."
sources:
  - label: "Source reference 1"
    url: "IS 1239 (Part 1) - Steel Tubes, Tubulars and Other Wrought Steel Fittings (Bureau of Indian Standards)"
  - label: "Source reference 2"
    url: "ASTM A53 / A53M - Standard Specification for Pipe, Steel, Black and Hot-Dipped, Zinc-Coated, Welded and Seamless"
updated: "2026-03-19"
related:
  - "concrete-calculator"
  - "house-construction-cost-calculator"
  - "square-feet-calculator"
  - "volumetric-weight-calculator"
disclaimer: "none"
---

## Engineering Guide to Mild Steel Pipe Weight

Mild steel (MS) circular pipes and tubes are essential in industrial fabrication, scaffolding, structural trusses, fire protection piping, and plumbing conduits. Estimating pipe weight is essential for freight logistics, structural dead-load engineering, and purchasing by metric ton.

### Derivation of the Mathematical Multiplier

The volume of steel in a one-meter length ($1,000\text{ mm}$) of round pipe is:

$$\text{Volume} = \text{Cross-Sectional Area} \times 1,000\text{ mm}$$

$$\text{Area} = \frac{\pi}{4} \left(\text{OD}^2 - \text{ID}^2\right) = \pi \times (\text{OD} - \text{WT}) \times \text{WT}$$

Taking standard structural carbon steel density of **$7,850\text{ kg/m}^3$** ($7.85 \times 10^{-6}\text{ kg/mm}^3$):

$$\text{Weight (kg/m)} = \pi \times (\text{OD} - \text{WT}) \times \text{WT} \times 1,000 \times 0.00000785$$
$$\pi \times 0.00785 = \mathbf{0.0246615}$$

Thus, the industry-standard shortcut formula:
$$\mathbf{\text{Weight (kg/m)} = (\text{OD} - \text{WT}) \times \text{WT} \times 0.02466}$$

---

### Common Standard Pipe Sizes Reference (IS 1239 / ASTM A53)

| Nominal Bore (NB / Inch) | Outer Diameter (OD mm) | Light Class (kg/m) | Medium Class (kg/m) | Heavy Class (kg/m) |
|---|---|---|---|---|
| **1/2" (15 mm)** | 21.3 mm | 0.95 kg/m (2.0 mm WT) | 1.22 kg/m (2.6 mm WT) | 1.45 kg/m (3.2 mm WT) |
| **3/4" (20 mm)** | 26.9 mm | 1.41 kg/m (2.3 mm WT) | 1.58 kg/m (2.6 mm WT) | 1.90 kg/m (3.2 mm WT) |
| **1" (25 mm)** | 33.7 mm | 2.01 kg/m (2.6 mm WT) | 2.44 kg/m (3.2 mm WT) | 2.97 kg/m (4.0 mm WT) |
| **1-1/2" (40 mm)** | 48.3 mm | 3.25 kg/m (2.9 mm WT) | 3.61 kg/m (3.2 mm WT) | 4.43 kg/m (4.0 mm WT) |
| **2" (50 mm)** | 60.3 mm | 4.11 kg/m (2.9 mm WT) | 5.10 kg/m (3.6 mm WT) | 6.17 kg/m (4.5 mm WT) |
| **3" (80 mm)** | 88.9 mm | 6.81 kg/m (3.2 mm WT) | 8.47 kg/m (4.0 mm WT) | 10.10 kg/m (4.8 mm WT) |
