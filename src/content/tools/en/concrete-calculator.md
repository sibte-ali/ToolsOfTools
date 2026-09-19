---
title: "Concrete Calculator - Slabs, Footings, Cement Bags & Mix Rat"
description: "Calculate concrete volume in cubic yards and cubic meters for slabs, footings, and columns. Estimates cement bags (50kg), sand, gravel, and dry volume."
h1: "Concrete Calculator (Volume & Cement Bags)"
intro: "Calculate concrete volume in cubic yards (yd³) and cubic meters (m³) for slabs, footings, curbs, and circular columns. Computes exact cement bags, sand, and aggregate required based on mix grade."
primaryKeyword: "concrete calculator"
formula: "Wet Volume = L × W × D  |  Dry Volume = Wet Volume × 1.54 (Shrinkage Factor)"
example: "A concrete slab measuring 20 ft × 15 ft with a 4-inch (0.333 ft) thickness requires 3.70 cubic yards (2.83 m³) of wet concrete. Including 10% wastage yields 4.07 cubic yards."
faq:
  - q: "What is the dry volume conversion factor of 1.54 in concrete?"
    a: "When water is added to dry ingredients (cement, sand, stone), the water fills the microscopic voids between particles, causing the mixture to shrink by about 35% in volume. To produce 1 m³ of wet compacted concrete, civil engineers multiply wet volume by 1.54 to determine required dry batch materials."
  - q: "What are the common standard concrete mix ratios (M15, M20, M25)?"
    a: "Standard nominal mix ratios (Cement : Fine Sand : Coarse Aggregate by volume) are: M15 (1 : 2 : 4), M20 (1 : 1.5 : 3), and M25 (1 : 1 : 2). M20 and M25 are standard for residential structural slabs, beams, and load-bearing columns."
  - q: "How many 50 kg bags of cement are in 1 cubic meter of concrete?"
    a: "For a standard M20 mix (1:1.5:3, total parts = 5.5), dry volume is 1.54 m³. Cement volume = 1.54 / 5.5 = 0.28 m³. Since dry cement density is 1,440 kg/m³, cement mass = 0.28 × 1,440 = 403 kg, which equals approximately 8 bags of 50 kg cement per cubic meter."
  - q: "How many 80 lb or 60 lb bags of ready-mix concrete make one cubic yard?"
    a: "One cubic yard requires approximately forty-five (45) 80 lb bags or sixty (60) 60 lb bags of premixed concrete."
sources:
  - label: "Source reference 1"
    url: "ACI 211.1 - Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete (American Concrete Institute)"
  - label: "Source reference 2"
    url: "IS 456:2000 - Plain and Reinforced Concrete - Code of Practice (Bureau of Indian Standards)"
updated: "2026-03-19"
related:
  - "square-feet-calculator"
  - "house-construction-cost-calculator"
  - "resin-calculator"
  - "ms-pipe-weight-calculator"
disclaimer: "none"
---

## Estimating Concrete Volume and Mix Batches

Pouring concrete for driveways, house foundations, patio slabs, or post-hole footings requires accurate volumetric estimation. Ordering too little concrete leads to cold joints (structural weak planes where two separate pours fail to bond), while ordering too much wastefully incurs surplus disposal charges.

### Standard Nominal Concrete Mix Grades

Concrete strength is classified by compressive strength after 28 days of curing:

| Mix Grade | Compressive Strength | Nominal Ratio (Cement : Sand : Aggregate) | Recommended Applications |
|---|---|---|---|
| **M10** | 10 MPa (1450 psi) | 1 : 3 : 6 | Bedding under walls, non-structural pathways |
| **M15** | 15 MPa (2175 psi) | 1 : 2 : 4 | Plain floor slabs, residential pathways |
| **M20** | 20 MPa (2900 psi) | 1 : 1.5 : 3 | Reinforced foundations, floor slabs, beams |
| **M25** | 25 MPa (3625 psi) | 1 : 1 : 2 | Heavy load columns, retaining walls, cantilever slabs |

---

### Step-by-Step Calculation Formula

#### 1. Wet Volume Calculation
For a rectangular slab:
$$\text{Wet Volume } (m^3) = \text{Length } (m) \times \text{Width } (m) \times \text{Thickness } (m)$$
If dimensions are in feet:
$$\text{Wet Volume } (yd^3) = \frac{\text{Length (ft)} \times \text{Width (ft)} \times \text{Thickness (in)}}{324}$$
*(Note: 324 comes from $27\text{ cu ft per cu yd} \times 12\text{ inches per foot}$).*

#### 2. Dry Volume & Material Breakdown
$$\text{Dry Volume} = \text{Wet Volume} \times 1.54$$

For mix ratio $1 : S : A$ with total sum of parts $T = 1 + S + A$:
- **Cement Weight (kg):** $\left(\frac{1}{T}\right) \times \text{Dry Volume} \times 1,440\text{ kg/m}^3$
- **Number of 50 kg Bags:** $\frac{\text{Cement Weight (kg)}}{50}$
- **Sand Volume ($m^3$):** $\left(\frac{S}{T}\right) \times \text{Dry Volume}$
- **Coarse Aggregate Volume ($m^3$):** $\left(\frac{A}{T}\right) \times \text{Dry Volume}$
