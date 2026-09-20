import type { UIStrings } from './types';

export const it: UIStrings = {
  nav: {
    home: 'Home',
    categories: 'Categorie',
    tools: 'Tutti gli strumenti',
    search: 'Cerca strumenti...',
  },
  footer: {
    description: 'Calcolatori e utilità online veloci e lato client. 100% privati e basati su browser.',
    allRightsReserved: 'Tutti i diritti riservati.',
    privacy: 'Informativa sulla privacy',
    terms: 'Termini di utilizzo',
    about: 'Chi siamo',
    contact: 'Contatto',
    methodology: 'Metodologia di calcolo',
  },
  howItWorks: 'Come funziona',
  formula: 'Formula',
  workedExample: 'Esempio pratico',
  faq: 'Domande frequenti',
  relatedTools: 'Strumenti correlati',
  lastUpdated: 'Ultimo aggiornamento',
  methodologyLinkText: 'Scopri di più su come verifichiamo le nostre formule nella nostra Guida metodologica.',
  disclaimer: {
    none: '',
    finance:
      'Dichiarazione di non responsabilità: Questo strumento è solo a scopo informativo ed educativo e non deve essere interpretato come consulenza finanziaria, legale o di investimento. Verificare tutti i calcoli in modo indipendente.',
    health:
      'Dichiarazione di non responsabilità: Questo strumento è fornito solo a scopo educativo e di benessere generale e non costituisce consulenza medica, diagnosi o trattamento.',
    entertainment:
      'Dichiarazione di non responsabilità: Questo strumento è solo a scopo di intrattenimento. I risultati sono generati per divertimento e non hanno validità scientifica.',
  },
  copy: 'Copia',
  reset: 'Reimposta',
  calculate: 'Calcola',
  errorMessages: {
    required: 'Questo campo è obbligatorio.',
    invalidNumber: 'Inserisci un numero valido.',
    general: 'Si è verificato un errore durante il calcolo.',
  },
  unitLabels: {
    days: 'Giorni',
    months: 'Mesi',
    years: 'Anni',
    percentage: '%',
    currency: 'Valuta',
  },
  homeHeroHeading: 'Cerca Strumenti e Calcolatori Online',
  homeHeroSubtitle: 'Trova e utilizza calcolatori gratuiti, convertitori di unità e utilità che funzionano direttamente nel tuo browser.',
  valuePropositionTitle: 'Perché scegliere ToolsOfTools?',
  valueProps: [
    {
      title: '100% Privato lato client',
      desc: 'Tutti i calcoli vengono eseguiti nel runtime locale del browser. Nessun dato o cifra viene mai inviato a server remoti.',
    },
    {
      title: 'Zero latenza e risposta immediata',
      desc: 'Nessun ritardo di elaborazione del server. I calcoli si aggiornano istantaneamente mentre digiti o modifichi i valori.',
    },
    {
      title: 'Matematicamente verificato',
      desc: 'Le formule e i motori di calcolo sono testati secondo standard normativi e specifiche accademiche ufficiali.',
    },
  ],
  topTools: 'Strumenti e Calcolatori Popolari',
  calculadoraTitle: 'Calcolatrice di base e scientifica',
  calculadoraSubtitle: 'Calcolo veloce e privato direttamente nel tuo browser con supporto tastiera.',
  sources: 'Fonti',
  sourcesVerified: 'Formule verificate secondo standard matematici e di legge.',
  viewAllInHub: (hub: string) => `← Visualizza tutti gli strumenti ${hub}`,
  openTool: 'Apri strumento →',
  open: 'Apri →',
  toolsAvailable: (count: number) => `${count} strumenti disponibili`,
  widget: {
    primaryValue: 'Valore principale',
    rateOrPct: 'Tasso / Percentuale (%)',
    calculatedResult: 'Risultato calcolato',
    standardFormulaNote: 'Basato su formula matematica standard',
  },
};
