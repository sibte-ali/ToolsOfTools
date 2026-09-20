import type { UIStrings } from './types';

export const de: UIStrings = {
  nav: {
    home: 'Startseite',
    categories: 'Kategorien',
    tools: 'Alle Tools',
    search: 'Tools suchen...',
  },
  footer: {
    description: 'Schnelle, clientseitige Online-Rechner und Tools. 100% privat und im Browser ausgeführt.',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    privacy: 'Datenschutzrichtlinie',
    terms: 'Nutzungsbedingungen',
    about: 'Über uns',
    contact: 'Kontakt',
    methodology: 'Berechnungsmethodik',
  },
  howItWorks: 'Wie es funktioniert',
  formula: 'Formel',
  workedExample: 'Praxisbeispiel',
  faq: 'Häufig gestellte Fragen',
  relatedTools: 'Ähnliche Tools',
  lastUpdated: 'Zuletzt aktualisiert',
  methodologyLinkText: 'Erfahren Sie mehr über unsere Formelprüfungen in unserem Leitfaden zur Methodik.',
  disclaimer: {
    none: '',
    finance:
      'Haftungsausschluss: Dieses Tool dient nur zu Informations- und Bildungszwecken und stellt keine Finanz- oder Rechtsberatung dar.',
    health:
      'Haftungsausschluss: Dieses Tool dient Bildungszwecken und stellt keine medizinische Beratung oder Diagnose dar.',
    entertainment:
      'Haftungsausschluss: Dieses Tool dient ausschließlich der Unterhaltung.',
  },
  copy: 'Kopieren',
  reset: 'Zurücksetzen',
  calculate: 'Berechnen',
  errorMessages: {
    required: 'Dieses Feld ist erforderlich.',
    invalidNumber: 'Bitte geben Sie eine gültige Zahl ein.',
    general: 'Bei der Berechnung ist ein Fehler aufgetreten.',
  },
  unitLabels: {
    days: 'Tage',
    months: 'Monate',
    years: 'Jahre',
    percentage: '%',
    currency: 'Währung',
  },
  homeHeroHeading: 'Online-Tools & Rechner Suchen',
  homeHeroSubtitle: 'Kostenlose Rechner, Einheitenumrechner und Hilfsprogramme direkt in Ihrem Browser nutzen.',
  valuePropositionTitle: 'Warum ToolsOfTools wählen?',
  valueProps: [
    {
      title: '100% Privat & Clientseitig',
      desc: 'Alle Berechnungen laufen lokal in Ihrem Browser. Keine Eingaben oder Daten werden an externe Server gesendet.',
    },
    {
      title: 'Null Latenz & Sofortige Antwort',
      desc: 'Keine Serververzögerungen. Berechnungen aktualisieren sich sofort bei der Eingabe.',
    },
    {
      title: 'Mathematisch verifiziert',
      desc: 'Formeln werden nach offiziellen akademischen und gesetzlichen Standards geprüft.',
    },
  ],
  topTools: 'Beliebte Tools & Rechner',
  calculadoraTitle: 'Einfacher & wissenschaftlicher Rechner',
  calculadoraSubtitle: 'Schnelle und private Berechnungen direkt im Browser mit Tastaturunterstützung.',
  sources: 'Quellen',
  sourcesVerified: 'Formeln anhand anerkannter mathematischer Standards verifiziert.',
  viewAllInHub: (hub: string) => `← Alle ${hub}-Tools anzeigen`,
  openTool: 'Tool öffnen →',
  open: 'Öffnen →',
  toolsAvailable: (count: number) => `${count} Tools verfügbar`,
  widget: {
    primaryValue: 'Hauptwert',
    rateOrPct: 'Zinssatz / Prozentsatz (%)',
    calculatedResult: 'Berechnetes Ergebnis',
    standardFormulaNote: 'Basierend auf mathematischer Standardformel',
  },
};
