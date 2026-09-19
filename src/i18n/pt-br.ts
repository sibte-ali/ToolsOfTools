import type { UIStrings } from './types';

export const ptBr: UIStrings = {
  nav: {
    home: 'Início',
    categories: 'Categorias',
    tools: 'Todas as Ferramentas',
    search: 'Buscar ferramentas...',
  },
  footer: {
    description:
      'Calculadoras e conversores online rápidos e gratuitos. Executados com total privacidade no seu navegador.',
    allRightsReserved: 'Todos os direitos reservados.',
    privacy: 'Política de Privacidade',
    terms: 'Termos de Uso',
    about: 'Sobre Nós',
    contact: 'Contato',
    methodology: 'Metodologia de Cálculo',
  },
  howItWorks: 'Como funciona',
  formula: 'Fórmula',
  workedExample: 'Exemplo prático',
  faq: 'Perguntas frequentes',
  relatedTools: 'Ferramentas relacionadas',
  lastUpdated: 'Última atualização',
  methodologyLinkText: 'Saiba como nossas fórmulas são revisadas e auditadas em nosso Guia de Metodologia.',
  disclaimer: {
    none: '',
    finance:
      'Aviso: Esta ferramenta destina-se unicamente a fins informativos e educacionais, não constituindo recomendação financeira, contábil ou jurídica. Sempre verifique os cálculos de forma independente.',
    health:
      'Aviso: Esta ferramenta tem caráter estritamente educativo e informativo, não substituindo a consulta, diagnóstico ou acompanhamento médico profissional.',
    entertainment:
      'Aviso: Esta ferramenta destina-se exclusivamente a entretenimento e diversão. Os resultados são lúdicos e não possuem respaldo científico.',
  },
  copy: 'Copiar',
  reset: 'Limpar',
  calculate: 'Calcular',
  errorMessages: {
    required: 'Campo obrigatório.',
    invalidNumber: 'Por favor, insira um número válido.',
    general: 'Ocorreu um erro ao processar o cálculo.',
  },
  unitLabels: {
    days: 'Dias',
    months: 'Meses',
    years: 'Anos',
    percentage: '%',
    currency: 'Moeda',
  },
  homeHeroHeading: 'Ferramentas e Calculadoras Rápidas',
  homeHeroSubtitle: 'Calculadoras e utilitários precisos e privados que rodam direto no seu navegador sem rastreamento.',
  valuePropositionTitle: 'Por que usar o ToolsOfTools?',
  valueProps: [
    {
      title: '100% Privado no Navegador',
      desc: 'Todas as operações são executadas localmente no seu computador ou celular. Seus dados nunca são enviados a servidores remotos.',
    },
    {
      title: 'Zero Latência e Resposta Instantânea',
      desc: 'Sem tempo de carregamento de rede ou espera de servidor. Os resultados são calculados em tempo real.',
    },
    {
      title: 'Matematicamente Auditado',
      desc: 'Algoritmos e equações calibrados de acordo com normas técnicas vigentes e referências acadêmicas.',
    },
  ],
  topTools: 'Ferramentas Mais Acessadas',
  calculadoraTitle: 'Calculadora Básica e Científica',
  calculadoraSubtitle: 'Cálculos matemáticos rápidos e privados com suporte completo a teclado e painel numérico.',
  sources: 'Fontes',
  sourcesVerified: 'Fórmulas verificadas de acordo com padrões matemáticos e normativos vigentes.',
  viewAllInHub: (hub: string) => `← Ver todas as ferramentas de ${hub}`,
  openTool: 'Abrir ferramenta →',
  open: 'Abrir →',
  toolsAvailable: (count: number) => `${count} ferramentas disponíveis`,
  widget: {
    primaryValue: 'Valor Principal',
    rateOrPct: 'Taxa / Porcentagem (%)',
    calculatedResult: 'Resultado Calculado',
    standardFormulaNote: 'Com base na fórmula matemática padrão',
  },
};

