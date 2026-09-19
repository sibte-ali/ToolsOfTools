---
title: "TDEE Calculator - Gasto Energético Total Diário (GET)"
description: "Calcule seu TDEE (Gasto Energético Total Diário) online em português. Compare as fórmulas Mifflin-St Jeor e Harris-Benedict com fatores de atividade física."
h1: "TDEE Calculator"
intro: "Calcule seu TDEE (Total Daily Energy Expenditure / Gasto Energético Total) comparando as fórmulas científicas de Mifflin-St Jeor e Harris-Benedict."
primaryKeyword: "tdee calculator"
formula: "\\text{TDEE} = \\text{TMB} \\times \\text{Fator de Atividade Física (1{,}2 a 1{,}9)}"
example: "Para um homem de 30 anos pesando 75 kg com 178 cm e atividade moderada, a fórmula de Mifflin-St Jeor resulta em TMB de 1.718 kcal e TDEE de 2.663 kcal/dia."
faq:
  - q: "O que significa a sigla TDEE?"
    a: "TDEE significa 'Total Daily Energy Expenditure', conhecido na literatura médica em português como GET (Gasto Energético Total). É o somatório de todas as calorias que seu corpo queima ao longo de 24 horas."
  - q: "Qual a diferença entre a fórmula de Mifflin-St Jeor e Harris-Benedict?"
    a: "A equação de Harris-Benedict original data de 1919 (revisada em 1984), tendendo a superestimar o gasto energético em populações modernas mais sedentárias. A fórmula de Mifflin-St Jeor (1990) é considerada o padrão-ouro atual pela maioria dos órgãos internacionais de nutrição."
  - q: "Quantas calorias compõem o TDEE além do exercício físico?"
    a: "O exercício estruturado representa apenas 5% a 15% do TDEE. Cerca de 60% a 70% decorrem do metabolismo basal (TMB), 15% a 25% de movimentos inconscientes do dia a dia (NEAT) e 10% da digestão dos alimentos (efeito térmico dos alimentos / TEF)."
  - q: "Como utilizar o TDEE para definir minha dieta?"
    a: "Para manter o peso estável, consuma calorias iguais ao seu TDEE. Para emagrecer com saúde, reduza 300 a 500 kcal do TDEE. Para ganho de massa muscular (bulking), adicione 300 a 500 kcal ao TDEE."
  - q: "O TDEE varia em dias de descanso e dias de treino?"
    a: "Sim. Nos dias em que você treina pesado, seu gasto calórico real é maior do que nos dias de repouso absoluto. A maioria das pessoas prefere utilizar uma média diária semanal para manter estabilidade no planejamento de refeições."
sources:
  - label: "Sociedade Brasileira de Endocrinologia e Metabologia (SBEM)"
    url: "https://www.endocrino.org.br"
  - label: "FAO/WHO/UNU Expert Consultation on Human Energy Requirements"
    url: "https://www.who.int/publications/m/item/human-energy-requirements"
updated: "2026-03-01"
related:
  - "calculadora-de-calorias"
  - "calculadora-de-macros"
  - "imc"
  - "calculadora-de-pace"
disclaimer: "health"
---

## Compreendendo o Gasto Energético Total Diário (TDEE)

O termo em inglês **TDEE (Total Daily Energy Expenditure)** consolidou-se como a principal referência nos aplicativos de rastreamento de dieta, fóruns de musculação e consultórios nutricionais no Brasil. Na literatura médica lusófona, o TDEE é formalmente denominado **Gasto Energético Total (GET)**.

Calcular seu TDEE é o primeiro passo essencial para qualquer estratégia corporal: ele representa o ponto neutro de equilíbrio no qual você não ganha nem perde peso.

### Os Quatro Componentes Fisiológicos do TDEE

O consumo calórico do seu corpo ao longo de 24 horas é a soma de quatro mecanismos independentes:

1. **Taxa Metabólica Basal (TMB / BMR, $\sim 60\% - 70\%$ do total)**: A energia necessária para manter batimentos cardíacos, atividade cerebral, temperatura corporal a 36,5°C e respiração.
2. **Termogênese das Atividades sem Exercício (NEAT, $\sim 15\%$ do total)**: A energia gasta em movimentos espontâneos (subir escadas, gesticular, ficar em pé, limpar a casa).
3. **Exercício Físico Estruturado (EAT, $\sim 5\% - 15\%$ do total)**: O gasto calórico deliberado durante treinos de musculação, corrida, natação ou ciclismo.
4. **Efeito Térmico dos Alimentos (TEF, $\sim 10\%$ do total)**: A energia necessária para mastigar, digerir, absorver e metabolizar os nutrientes ingeridos.

### Comparativo de Fórmulas: Mifflin-St Jeor vs. Harris-Benedict

Nossa ferramenta permite alternar entre os dois modelos metabólicos mais respeitados da medicina esportiva:

#### 1. Equação de Mifflin-St Jeor (1990)
Considerada o padrão mais fidedigno pela Academia de Nutrição e Dietética:
- **Homens:** $\text{TMB} = 10 \times \text{Peso (kg)} + 6,25 \times \text{Altura (cm)} - 5 \times \text{Idade} + 5$
- **Mulheres:** $\text{TMB} = 10 \times \text{Peso (kg)} + 6,25 \times \text{Altura (cm)} - 5 \times \text{Idade} - 161$

#### 2. Equação de Harris-Benedict Revisada (Roza & Shizgal, 1984)
- **Homens:** $\text{TMB} = 88,362 + (13,397 \times \text{Peso}) + (4,799 \times \text{Altura}) - (5,677 \times \text{Idade})$
- **Mulheres:** $\text{TMB} = 447,593 + (9,247 \times \text{Peso}) + (3,098 \times \text{Altura}) - (4,330 \times \text{Idade})$

### Exemplo Prático com Passo a Passo

Vejamos um caso prático de um homem de $30\text{ anos}$, com $75\text{ kg}$, $178\text{ cm}$ de estatura e que treina musculação 4 dias por semana ($\text{Fator } 1,55$):

1. **Cálculo da TMB (Mifflin-St Jeor)**:
   $$\text{TMB} = (10 \times 75) + (6,25 \times 178) - (5 \times 30) + 5$$
   $$\text{TMB} = 750 + 1112,5 - 150 + 5 = 1717,5 \to \mathbf{1.718\text{ kcal}}$$

2. **Cálculo do TDEE**:
   $$\text{TDEE} = 1718 \times 1,55 = 2662,9 \to \mathbf{2.663\text{ kcal/dia}}$$

3. **Cenários de Aplicação Prática**:
   - **Manutenção de Peso**: Consumir cerca de $2.663\text{ kcal/dia}$.
   - **Perda de Gordura / Definição (Cutting)**: Reduzir $500\text{ kcal} \implies \mathbf{2.163\text{ kcal/dia}}$.
   - **Ganho de Massa Muscular (Bulking Limpo)**: Adicionar $300\text{ kcal} \implies \mathbf{2.963\text{ kcal/dia}}$.

### Erros Comuns na Interpretação do TDEE

- **Superestimar a Atividade Física**: Escolher o nível "Muito Ativo" apenas por treinar 1 hora de musculação ao dia, passando as outras 23 horas sentado em frente ao computador, gera superestimativas de até 400 kcal.
- **Não Recalcular Durante o Processo**: À medida que você emagrece ou ganha massa, o peso na fórmula muda, alterando o resultado final do TDEE.

Para detalhar o cardápio com base no seu resultado, visite a [calculadora de calorias](/pt-br/saude/calculadora-de-calorias/) e configure sua divisão de nutrientes na [calculadora de macros](/pt-br/saude/calculadora-de-macros/).
