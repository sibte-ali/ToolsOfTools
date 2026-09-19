import type { UIStrings } from './types';

export const es: UIStrings = {
  nav: {
    home: 'Inicio',
    categories: 'Categorías',
    tools: 'Todas las Herramientas',
    search: 'Buscar herramientas...',
  },
  footer: {
    description:
      'Herramientas y calculadoras online gratuitas, rápidas y privadas. Ejecutadas directamente en tu navegador.',
    allRightsReserved: 'Todos los derechos reservados.',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Uso',
    about: 'Sobre Nosotros',
    contact: 'Contacto',
    methodology: 'Metodología de Cálculo',
  },
  howItWorks: 'Cómo funciona',
  formula: 'Fórmula',
  workedExample: 'Ejemplo práctico',
  faq: 'Preguntas frecuentes',
  relatedTools: 'Herramientas relacionadas',
  lastUpdated: 'Última actualización',
  methodologyLinkText: 'Descubre cómo verificamos cada fórmula en nuestra Guía de Metodología.',
  disclaimer: {
    none: '',
    finance:
      'Aviso legal: Esta herramienta es puramente informativa y divulgativa. No constituye asesoramiento financiero, fiscal ni de inversión. Verifique siempre los cálculos de forma independiente.',
    health:
      'Aviso legal: El contenido de esta herramienta es de carácter orientativo y formativo. No sustituye el diagnóstico ni el tratamiento médico cualificado.',
    entertainment:
      'Aviso: Esta herramienta tiene fines exclusivamente lúdicos y de entretenimiento. Los resultados generados no tienen validez científica ni oficial.',
  },
  copy: 'Copiar',
  reset: 'Restablecer',
  calculate: 'Calcular',
  errorMessages: {
    required: 'Este campo es obligatorio.',
    invalidNumber: 'Por favor, introduce un número válido.',
    general: 'Ha ocurrido un error al procesar el cálculo.',
  },
  unitLabels: {
    days: 'Días',
    months: 'Meses',
    years: 'Años',
    percentage: '%',
    currency: 'Moneda',
  },
  homeHeroHeading: 'Calculadora Online y Herramientas',
  homeHeroSubtitle: 'Calculadoras y utilidades precisas y privadas que funcionan 100% en tu navegador sin rastreo.',
  valuePropositionTitle: '¿Por qué elegir ToolsOfTools?',
  valueProps: [
    {
      title: '100% Privado en tu Navegador',
      desc: 'Todas las operaciones se procesan localmente en tu dispositivo. Ningún dato ni número se transmite a servidores externos.',
    },
    {
      title: 'Cero Latencia y Respuesta Inmediata',
      desc: 'Sin esperas de red ni retardos de procesamiento. Los resultados se actualizan al instante mientras introduces datos.',
    },
    {
      title: 'Matemáticamente Auditado',
      desc: 'Modelos y formulaciones contrastados según normativas oficiales vigentes y manuales académicos de referencia.',
    },
  ],
  topTools: 'Herramientas Populares',
  calculadoraTitle: 'Calculadora Básica y Científica',
  calculadoraSubtitle: 'Cálculo rápido, privado y seguro en tu navegador con soporte completo para teclado.',
  sources: 'Fuentes',
  sourcesVerified: 'Fórmulas verificadas según estándares matemáticos y normativos oficiales.',
  viewAllInHub: (hub: string) => `← Ver todas las herramientas de ${hub}`,
  openTool: 'Abrir herramienta →',
  open: 'Abrir →',
  toolsAvailable: (count: number) => `${count} herramientas disponibles`,
  widget: {
    primaryValue: 'Valor Principal',
    rateOrPct: 'Tasa / Porcentaje (%)',
    calculatedResult: 'Resultado Calculado',
    standardFormulaNote: 'Basado en la fórmula matemática estándar',
  },
};

