---
title: "Calculadora de Ritmos - Tiempos de Carrera y Parciales"
description: "Calcula tu ritmo de carrera en min/km y velocidad en km/h. Tiempos estimados para 5K, 10K, Media Maratón y Maratón con tabla de parciales online gratis."
h1: "Calculadora de Ritmos"
intro: "Calcula tu ritmo medio de carrera por kilómetro, velocidad en km/h y predicciones de tiempo para 5K, 10K, Media Maratón y Maratón con parciales detallados."
primaryKeyword: "calculadora de ritmos"
formula: "\\text{Ritmo (min/km)} = \\frac{\\text{Tiempo total (segundos)}}{\\text{Distancia (km)} \\times 60}, \\quad \\text{Velocidad (km/h)} = \\frac{\\text{Distancia (km)}}{\\text{Tiempo (horas)}}"
example: "Completar una carrera de 10 kilómetros en 45 minutos requiere un ritmo constante de 4:30 min/km, lo que equivale a una velocidad media de 13,33 km/h."
faq:
  - q: "¿Qué diferencia existe entre el ritmo y la velocidad?"
    a: "La velocidad expresa la distancia recorrida en una hora (kilómetros por hora o km/h). El ritmo de carrera expresa el tiempo exacto en minutos y segundos que un corredor necesita para cubrir cada kilómetro (min/km), lo que facilita regular el esfuerzo paso a paso."
  - q: "¿Cómo se calcula el ritmo medio por kilómetro?"
    a: "Se divide el tiempo total de la carrera en segundos entre el número total de kilómetros recorridos. El cociente entero representa los minutos y el resto los segundos por kilómetro."
  - q: "¿Qué es la estrategia de parciales negativos en atletismo?"
    a: "Consiste en correr la segunda mitad de una prueba a un ritmo ligeramente más rápido que la primera. Esta táctica fisiológica ayuda a retrasar la acumulación excesiva de lactato y previene el agotamiento prematuro de los depósitos de glucógeno."
  - q: "¿Es fiable extrapolar el tiempo de 10K a un maratón?"
    a: "Las calculadoras ofrecen una proyección matemática lineal basada en el ritmo, pero el rendimiento en maratón exige resistencia muscular, nutrición intra-carrera con geles y correcta hidratación. La mayoría de atletas experimenta una pérdida del 5% al 8% en los últimos 12 kilómetros."
  - q: "¿Cuál es un buen ritmo para corredores populares en 5K?"
    a: "Para un corredor aficionado que se inicia en el running, completar los 5 km a un ritmo de entre 5:30 y 6:30 min/km representa una marca muy equilibrada y saludable (entre 27 y 32 minutos en meta)."
sources:
  - label: "Real Federación Española de Atletismo (RFEA) - Normativa Técnica y Circuitos Homologados"
    url: "https://www.rfea.es"
  - label: "Sociedad Española de Medicina del Deporte (SEMED)"
    url: "https://www.femede.es"
updated: "2026-03-01"
related:
  - "calcular-porcentaje"
  - "interes-compuesto"
  - "calculadora"
  - "calcular-media-pau"
disclaimer: "health"
---

## El Ritmo de Carrera en el Entrenamiento y la Competición

En el atletismo popular y las carreras en ruta en España y Latinoamérica —desde pruebas emblemáticas como la San Silvestre Vallecana o el Maratón de Valencia hasta competiciones locales de 10K—, el **ritmo de carrera** (expresado comúnmente en minutos y segundos por kilómetro, o $\text{min/km}$) es la variable reina para cualquier corredor.

Controlar con precisión los ritmos de paso resulta decisivo para no caer en el error más repetido en el cajón de salida: dejarse llevar por la adrenalina del pelotón inicial y pagar el sobreesfuerzo con una fatiga demoledora en los kilómetros decisivos.

### Fórmulas Matemáticas del Ritmo y la Velocidad

El ritmo y la velocidad son magnitudes inversamente proporcionales:

#### 1. Cálculo del Ritmo por Kilómetro:
$$\text{Segundos por Kilómetro} = \frac{\text{Tiempo Total Transcurrido (segundos)}}{\text{Distancia de la Prueba (kilómetros)}}$$

Para formatear el resultado en minutos y segundos ($\text{mm:ss}$):
$$\text{Minutos} = \left\lfloor \frac{\text{Segundos por Km}}{60} \right\rfloor, \quad \text{Segundos} = \text{Segundos por Km} \pmod{60}$$

#### 2. Cálculo de la Velocidad Media:
$$\text{Velocidad (km/h)} = \frac{\text{Distancia (km)}}{\text{Tiempo (horas)}} = \left( \frac{\text{Distancia (km)}}{\text{Tiempo Total (segundos)}} \right) \times 3600$$

### Distancias Oficiales del Fondo en Ruta

- **5K ($5,000\text{ km}$)**: Excelente distancia para mejorar la potencia aeróbica y el consumo máximo de oxígeno ($\text{VO}_2\text{ máx}$).
- **10K ($10,000\text{ km}$)**: La distancia de referencia del calendario popular de atletismo.
- **Media Maratón ($21,0975\text{ km}$)**: Distancia que combina velocidad de crucero con una rigurosa estrategia energética.
- **Maratón ($42,195\text{ km}$)**: La prueba reina de la resistencia humana, donde la regularidad de ritmo por kilómetro determina el éxito.

### Demostración Práctica Paso a Paso

Supongamos que un corredor se marca como objetivo bajar de los 45 minutos en un $10\text{K}$ homologado ($2.700\text{ segundos}$ en total):

1. **Cálculo de Segundos por Kilómetro**:
   $$\text{Ritmo} = \frac{2.700\text{ s}}{10\text{ km}} = 270\text{ segundos/km}$$

2. **Conversión a Minutos y Segundos**:
   $$\lfloor 270 / 60 \rfloor = 4\text{ minutos}, \quad 270 \pmod{60} = 30\text{ segundos} \implies \mathbf{4:30\text{ min/km}}$$

3. **Cálculo de la Velocidad Media**:
   $$\text{Velocidad} = \frac{10}{45 / 60} = \frac{10}{0,75} = \mathbf{13,33\text{ km/h}}$$

4. **Tiempos Proyectados con Este Mismo Ritmo**:
   - **5K**: $5 \times 270\text{ s} = 1.350\text{ s} \implies \mathbf{22\text{ minutos y } 30\text{ segundos}}$.
   - **Media Maratón**: $21,0975 \times 270\text{ s} \approx 5.696\text{ s} \implies \mathbf{1\text{h } 34\text{min } 56\text{s}}$.
   - **Maratón**: $42,195 \times 270\text{ s} \approx 11.393\text{ s} \implies \mathbf{3\text{h } 09\text{min } 53\text{s}}$.

### Claves de Gestión del Ritmo en Carrera

- **Parciales Uniformes**: Mantener una variación de ritmo inferior a 5 segundos por kilómetro a lo largo de toda la prueba maximiza la eficiencia biomecánica y el aprovechamiento de los depósitos de grasa y glucógeno.
- **Factores de Corrección**: Las altas temperaturas, el viento en contra y los desniveles positivos incrementan el coste energético; ajusta tu ritmo entre 5 y 10 segundos más lento si las condiciones ambientales son desfavorables.

Para calcular porcentajes de mejora en tus tiempos o entrenamientos, consulta nuestra herramienta para [calcular porcentaje](/es/otras-calculadoras/calcular-porcentaje/) o utiliza la [calculadora general](/es/otras-calculadoras/).
