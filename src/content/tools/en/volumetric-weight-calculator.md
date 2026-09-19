---
title: "Volumetric Weight Calculator - Dimensional Weight (DIM) for"
description: "Calculate dimensional / volumetric weight for air cargo and couriers (DHL, FedEx, UPS, India Post). Find your chargeable weight to avoid shipping surcharges."
h1: "Volumetric Weight Calculator"
intro: "Calculate courier dimensional weight (DIM weight) for boxes and pallets using standard divisors (5000, 4000, 6000). Determine whether your shipment will be charged by gross weight or volume."
primaryKeyword: "volumetric weight calculator"
formula: "Volumetric Weight (kg) = [Length (cm) × Width (cm) × Height (cm)] / Divisor"
example: "A lightweight box measuring 50 cm × 40 cm × 30 cm with an actual weight of 5 kg has a volumetric weight of 12.0 kg using the IATA standard 5000 divisor. The chargeable weight is 12.0 kg."
faq:
  - q: "What is volumetric weight (dimensional weight)?"
    a: "Volumetric weight is an industry pricing technique used by courier, postal, and freight airlines to account for package volume. A bulky but lightweight package (like a box of pillows) consumes valuable cargo space in an aircraft or truck, so carriers charge based on the greater of actual scale weight vs. volumetric weight."
  - q: "What is the standard DIM divisor for international express shipping?"
    a: "The standard divisor mandated by IATA (International Air Transport Association) and adopted by major couriers (DHL, FedEx, UPS international express) is 5,000 for centimeter dimensions (cm³ / 5000 = kg), or 139 for inch dimensions (in³ / 139 = lb)."
  - q: "What divisors do domestic ground and freight carriers use?"
    a: "Domestic couriers and road logistics often use a divisor of 4,000 (equivalent to 250 kg/m³) or 4,500. Some sea freight or consolidators calculate by cubic meter (CBM, where 1 CBM ≈ 167 kg to 333 kg depending on mode)."
  - q: "What is 'Chargeable Weight'?"
    a: "Chargeable weight is whichever is greater: the actual gross weight on a physical scale, or the calculated volumetric weight: Chargeable Weight = MAX(Actual Weight, Volumetric Weight)."
sources:
  - label: "Source reference 1"
    url: "IATA Resolution 502 - Volumetric Weight Calculation Standards for Air Freight"
  - label: "Source reference 2"
    url: "FedEx Express / DHL Express International Shipping Service Guides"
updated: "2026-03-19"
related:
  - "grams-to-lbs"
  - "ms-pipe-weight-calculator"
  - "mb-to-kb-converter"
  - "square-feet-calculator"
disclaimer: "none"
---

## Understanding Volumetric and Chargeable Weight

When shipping commercial parcels or personal goods internationally, your freight invoice is calculated based on **Chargeable Weight** rather than simple scale weight:

$$\mathbf{\text{Chargeable Weight} = \max(\text{Actual Scale Weight}, \text{Volumetric Weight})}$$

If you ship a large box that weighs only 3 kg on the scale, but occupies the space of a 15 kg crate in the cargo hold, the courier will bill you for 15 kg.

### Standard Courier Divisors (Metric)

$$\text{Volumetric Weight (kg)} = \frac{\text{Length (cm)} \times \text{Width (cm)} \times \text{Height (cm)}}{\text{Divisor}}$$

| Carrier / Mode | Standard Divisor (cm) | Standard Divisor (inches) |
|---|---|---|
| **IATA Air Freight Standard** | **5,000** | 139 |
| **DHL Express Worldwide** | **5,000** | 139 |
| **FedEx International Priority** | **5,000** | 139 |
| **UPS Worldwide Express** | **5,000** | 139 |
| **Domestic Road Cargo / Ground** | **4,000** | 115 |
| **India Post / Domestic Express** | **5,000 / 6,000** | 166 |

---

### Tips to Minimize Shipping Costs
1. **Right-Size Packaging:** Use custom-fitted corrugated boxes to eliminate empty void space filled with bubble wrap or air pillows.
2. **Vacuum Compression:** For textiles, clothing, and bedding, vacuum packaging bags can reduce volumetric package height by up to 60%.
3. **Multi-piece Consignments:** Calculate the total volumetric weight across all individual cartons before comparing against aggregate gross scale weight.
