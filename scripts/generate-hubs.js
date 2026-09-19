import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubsDir = path.resolve(__dirname, '../src/content/hubs');

const hubsData = {
  en: {
    finance: {
      title: 'Financial Calculators & Investment Planners',
      content: `Welcome to our comprehensive suite of free financial calculators, designed to give you clarity and precision across your personal wealth planning, loan calculations, taxes, and long-term investments. From evaluating Systematic Withdrawal Plans (SWP) and Systematic Investment Plans (SIP) to planning home loans, personal loans, and customized EMI repayment schedules, each utility runs completely within your web browser.

We prioritize mathematical integrity and practical real-world applicability. Our financial calculation engines account for periodic compounding, amortized repayment schedules, and statutory contribution rules without storing or transmitting your sensitive monetary figures. By computing directly on the client side, your financial balances, salaries, and interest rate experiments remain private, shielded from external server storage, analytics profiling, or data harvesting.

Whether you are budgeting monthly expenses, projecting compounding interest over multi-decade retirement horizons, comparing fixed versus reducing interest rates, or calculating tax deductions, these tools provide actionable transparency. Every calculator features mathematical explanations, worked formulas, and real examples so you can verify calculations independently before making critical financial decisions. Use our interactive tools to gain control of your financial future today.`
    },
    education: {
      title: 'Academic & Grade Calculators',
      content: `Welcome to our specialized collection of academic calculators and educational utilities, crafted specifically for university students, educators, and competitive exam applicants. Whether you need to monitor lecture attendance percentages to ensure eligibility before semester exams, convert university CGPA or SGPA scores into standard percentages, or evaluate raw scores for competitive entrance tests like CAT and JEE, our tools deliver instantaneous, dependable results.

University grading schemas and attendance rules often involve intricate formulas that vary by institution, college board, or autonomous university regulation. Our calculators incorporate documented conversion formulas from prominent universities and statutory bodies, presenting clear mathematical equations, step-by-step arithmetic, and interactive scenario sliders.

All computations are processed entirely inside your web browser with zero latency and total privacy. No student record numbers, exam grades, or personal details are ever transferred to external servers. Use these reliable, open-access tools to plan revision targets, calculate how many classes you can afford to miss, track term grades, and maintain optimal academic standing throughout your academic journey.`
    },
    'image-tools': {
      title: 'Fast Browser Image Tools & Converters',
      content: `Our suite of client-side image utilities delivers high-performance graphic manipulation and format conversion without compromising your digital privacy or uploading personal files to remote servers. Easily convert between modern web image formats such as WebP, AVIF, PNG, and JPEG, crop photos with precise aspect ratio presets, reduce file sizes to meet strict upload limits, and adjust DPI metadata for professional printing.

Every graphic transformation leverages modern HTML5 Canvas technology, WebAssembly, and native browser decoders. Because your photos, documents, and images never leave your local computer or mobile device, processing is virtually instantaneous, unencumbered by slow network uploads or server queue bottlenecks. This architecture guarantees complete confidentiality for personal portraits, job application attachments, government identity cards, and confidential business assets.

Designed for photographers, digital designers, job applicants, and web developers alike, these tools streamline batch image conversion and compression with granular controls over quality, resolution, dimensions, and output format. Transform your files quickly and securely without installing cumbersome software.`
    },
    health: {
      title: 'Health & Wellness Calculators',
      content: `Welcome to our health and fitness calculators, built to provide grounded, scientifically backed mathematical insights into body composition metrics, daily energy expenditure, and fitness milestones. From standard Body Mass Index (BMI) evaluations and Basal Metabolic Rate (BMR) calculations using the Mifflin-St Jeor equation to Total Daily Energy Expenditure (TDEE), ideal body weight formulas, and running pace estimations, our tools assist you on your wellness journey.

We believe physiological metric calculations should be transparent, accessible, and grounded in reputable clinical literature. Each tool provides clear mathematical formulas, explains how activity multipliers are applied, and outlines healthy target ranges established by organizations such as the World Health Organization.

Your health measurements and body metrics remain strictly personal. All calculations happen entirely within your local browser session with zero telemetry or tracking. Please note that while our tools adhere to standard clinical equations, they serve educational and general wellness purposes and do not replace personalized medical advice, diagnosis, or clinical guidance from certified healthcare professionals.`
    },
    'date-time': {
      title: 'Date & Time Calculators',
      content: `Manage calendar calculations, project schedules, and global time zone shifts effortlessly with our dedicated date and time utilities. Whether you are calculating the exact duration in days, weeks, and months between two calendar dates, determining working experience across multiple career tenures, or synchronizing deadlines across global time zones like EST, CST, and IST, our calculators eliminate calendar confusion.

Calendar arithmetic can be deceptively complex due to leap years, daylight saving time adjustments, and varying month lengths. Our utilities utilize standardized IANA time zone databases and rigorous date-difference algorithms to produce reliable, mistake-free schedules. Every tool accounts for chronological nuances, leap second handling, and custom working-day rules to ensure that business milestones and personal deadlines are scheduled with utmost mathematical fidelity.

All calculations execute instantly on your client device with zero server communication, ensuring your personal itineraries, work history, and event dates remain completely private. Explore common conversions, chronological timelines, work-hour summaries, and countdown trackers with clear, verified date arithmetic designed for everyday personal and professional productivity.`
    },
    engineering: {
      title: 'Engineering & Construction Calculators',
      content: `Our engineering and construction calculation tools provide dependable, rapid estimations for contractors, civil engineers, architects, tradespeople, and home renovators. Calculate concrete volume requirements for foundations and slabs, estimate structural steel and pipe weights, compute room square footage with wastage margins, and forecast material needs for building projects directly from your browser.

Material estimation demands rigorous geometric formulas and consistent density standards to avoid costly shortages or unnecessary material waste on the job site. Each calculator outlines its underlying mathematical principles and standard material density factors, allowing engineers and builders to double-check quantities before placing commercial orders. From rectangular prism formulas to cylindrical volumetric densities, our tools maintain consistent dimensional units across both metric and imperial construction standards.

Every calculation is performed locally on your device, enabling rapid recalculations in the field or office without requiring high-speed network connectivity. Rely on our transparent engineering formulas to streamline structural planning, material procurement, and cost management with complete confidence and mathematical rigor.`
    },
    converters: {
      title: 'Unit Converters',
      content: `Convert effortlessly between metric, imperial, and specialized measurement systems with our fast, lightweight unit converters. Whether converting meters to feet, grams to pounds, hectares to acres, or digital storage bytes from megabytes to kilobytes, our tools deliver high-precision bidirectional calculations in real time.

Unit conversions often involve subtle rounding errors when using arbitrary factors or simplified rules of thumb. Our converters rely on internationally recognized NIST and ISO conversion ratios, preserving precision and providing detailed step-by-step conversion multipliers so you can understand the exact mathematics behind every numerical result. Each tool includes bidirectional toggles, intuitive precision scalers, and clear fractional breakdowns to eliminate ambiguity in academic, laboratory, culinary, and technical engineering environments.

Designed for speed, clarity, and simplicity, our conversion tools run entirely client-side without heavy page reloads or intrusive advertisements. Select your source and target units to immediately receive accurate equivalents alongside helpful comparison reference tables for everyday school, cooking, science, and commercial tasks.`
    },
    astrology: {
      title: 'Numerology & Astrology Calculators',
      content: `Explore traditional numerological matrices, life-path calculations, and symbolic grids with our engaging, privacy-friendly esoteric tools. From generating traditional 3x3 Lo Shu grids and Chaldean name numbers to discovering your Mulank and Bhagyank alignments based on date of birth, our utilities provide instantaneous symbolic interpretations.

Our calculators systematically apply classic numerical assignment tables, digit summing rules, and cyclic elimination algorithms. We provide original descriptive text detailing the historical symbolism, strengths, and interpretive planes associated with each number and grid position. Whether analyzing vertical planes of thought, horizontal lines of action, or life-path master numbers like 11 and 22, our engines deliver consistent, rule-based breakdowns without arbitrary variations.

Created purely for cultural curiosity, personal reflection, and lighthearted entertainment, all calculations are deterministic and performed directly in your web browser. No dates of birth or personal names are transmitted or stored, ensuring your exploration remains confidential, fun, and mathematically consistent. Explore your numbers and discover intriguing numerical patterns with total peace of mind.`
    },
    'font-converters': {
      title: 'Font & Script Converters',
      content: `Bridge the gap between legacy non-Unicode typesetting and modern digital standards with our specialized script and font converters. Seamlessly convert legacy Devanagari text such as Kruti Dev 010, Shree Lipi, and AMS fonts into standard Unicode, or convert regional scripts like Bamini Tamil into universal character encodings.

Legacy typesetting relies on proprietary glyph mappings that fail to render on modern operating systems, search engines, and web browsers without specialized font files installed. Our conversion engines implement precise glyph substitution matrices and grammatical reordering rules to transform legacy text into universally readable, searchable Unicode text. Each conversion preserves complex ligatures, half-letter conjuncts, vowel matras, and diacritics with meticulous linguistic accuracy.

All conversion takes place entirely within your browser via optimized lookup algorithms, safeguarding proprietary documents, historical archives, and literary works without transmitting text across the internet. Copy or download converted text with one click, verify character integrity, and share across platforms effortlessly.`
    },
    'other-calculators': {
      title: 'General & Miscellaneous Calculators',
      content: `Welcome to our general utility hub, gathering versatile mathematical, lifestyle, developer, and entertainment calculators in one convenient location. Here you will find specialized utilities that do not fit into single large categories, including algebraic expression simplifiers, speed and velocity solvers, Unix epoch timestamp converters, and JSON data formatters.

Every tool in this collection upholds our platform commitment: 100% browser-based computation, zero data transmission, accessible high-contrast design, and complete transparency of underlying logic and formulas. These multi-disciplinary tools solve everyday numerical queries, technical format challenges, and algorithmic conversions with immediate feedback and zero friction.

Whether you need a quick JSON-to-Excel conversion, wish to format messy code structures, convert units of velocity, calculate practical percentages, or inspect epoch timestamps, these multi-purpose utilities offer clean, uncluttered interfaces that solve everyday technical and everyday problems quickly, reliably, and accurately. Bookmark this page for fast access to your essential daily problem solvers. Try our suite of handy tools today.`
    }
  },
  'pt-br': {
    saude: {
      title: 'Calculadoras de Saúde e Boa Forma',
      content: `Bem-vindo à nossa central de calculadoras de saúde e bem-estar, elaborada para oferecer cálculos precisos sobre composição corporal, ritmo de corrida, metabolismo e gasto calórico diário com fundamentação técnica e científica. Nossas ferramentas incluem cálculo de Índice de Massa Corporal (IMC), taxa metabólica basal (TMB), cálculo de ritmo por quilômetro (pace) e distribuição balanceada de macronutrientes.

Acreditamos que métricas de saúde devem ser claras, acessíveis e fundamentadas em consensos clínicos reconhecidos, como os parâmetros estabelecidos pela Organização Mundial da Saúde (OMS) e equações consagradas da literatura médica como Mifflin-St Jeor e Harris-Benedict. Cada calculadora apresenta as fórmulas matemáticas utilizadas, tabelas de faixas recomendadas e orientações práticas de interpretação para seu condicionamento.

Sua privacidade é absoluta: nenhum dado corporal, peso, altura ou medida informada é enviado a servidores externos ou compartilhado com terceiros. Todos os cálculos ocorrem exclusivamente no seu navegador. Lembramos que estas ferramentas têm caráter informativo e educacional e não substituem o acompanhamento de médicos, nutricionistas ou profissionais de educação física.`
    },
    'outras-calculadoras': {
      title: 'Outras Calculadoras e Utilitários',
      content: `Explore nossa coleção de utilitários e calculadoras diversas para o dia a dia, reunindo ferramentas financeiras, matemáticas, cálculos de jornadas e gestão de datas com praticidade. Esta seção reúne calculadoras práticas como contador de dias entre datas, calculadora de horas trabalhadas, simuladores de rendimento e investimentos com correção cambial, cálculos de metro quadrado e regras de três online.

Cada ferramenta foi desenvolvida com foco na simplicidade, rapidez e exatidão das regras vigentes no Brasil, como tabelas regressivas de imposto de renda sobre investimentos e contagens de dias úteis, evitando aproximações incorretas ou fórmulas simplistas. Seja para simular aportes na poupança ou CDI, apurar horas extras da CLT ou calcular porcentagens com agilidade, oferecemos respostas claras e detalhadas.

Todos os cálculos rodam integralmente no seu dispositivo via TypeScript client-side, garantindo privacidade completa, carregamento instantâneo e total ausência de rastreadores ou anúncios invasivos. Utilize nossas calculadoras para planejar suas finanças pessoais, organizar prazos de projetos ou solucionar problemas matemáticos com total autonomia e clareza.`
    }
  },
  es: {
    'otras-calculadoras': {
      title: 'Calculadoras y Utilidades Online',
      content: `Bienvenido a nuestra central de calculadoras y herramientas online, que reúne utilidades para resolver problemas matemáticos, financieros, de salud y del día a día con total rapidez y rigor analítico. Desde el cálculo de interés compuesto con aportaciones periódicas y variaciones porcentuales hasta nuestra calculadora científica interactiva y herramientas de ritmo, cada utilidad está diseñada para ofrecer resultados inmediatos.

Nuestra filosofía se basa en la transparencia matemática, la facilidad de uso y la privacidad absoluta. Mostramos con claridad cada fórmula utilizada, explicamos ejemplos prácticos paso a paso con cifras reales y contrastamos los algoritmos con normativas y métodos oficiales reconocidos internacionalmente. Todas las calculadoras integran explicaciones didácticas de cada término y variables para facilitar el aprendizaje continuo.

Toda la computación se procesa localmente en tu propio navegador web mediante código ligero, sin enviar tus cifras, presupuestos ni documentos a servidores externos. Disfruta de un entorno confiable, libre de rastreo publicitario y optimizado para funcionar a la máxima velocidad en cualquier ordenador o teléfono móvil con total fiabilidad.`
    }
  }
};

for (const [lang, folders] of Object.entries(hubsData)) {
  const langDir = path.join(hubsDir, lang);
  fs.mkdirSync(langDir, { recursive: true });
  for (const [folder, data] of Object.entries(folders)) {
    const filePath = path.join(langDir, `${folder}.md`);
    const fileContent = `---
title: "${data.title}"
---

${data.content.trim()}
`;
    fs.writeFileSync(filePath, fileContent, 'utf8');
  }
}

console.log('Generated all hub markdown files successfully.');
