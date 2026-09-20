import type { UIStrings } from './types';

export const fr: UIStrings = {
  nav: {
    home: 'Accueil',
    categories: 'Catégories',
    tools: 'Tous les outils',
    search: 'Rechercher des outils...',
  },
  footer: {
    description: 'Calculateurs et utilitaires en ligne rapides, exécutés côté client. 100% privés et basés sur navigateur.',
    allRightsReserved: 'Tous droits réservés.',
    privacy: 'Politique de confidentialité',
    terms: "Conditions d'utilisation",
    about: 'À propos',
    contact: 'Contact',
    methodology: 'Méthodologie de calcul',
  },
  howItWorks: 'Comment ça marche',
  formula: 'Formule',
  workedExample: 'Exemple détaillé',
  faq: 'Foire aux questions',
  relatedTools: 'Outils associés',
  lastUpdated: 'Dernière mise à jour',
  methodologyLinkText: 'En savoir plus sur la vérification de nos formules dans notre Guide méthodologique.',
  disclaimer: {
    none: '',
    finance:
      'Avertissement : Cet outil est fourni à des fins purement éducatives et informatives et ne constitue pas un conseil financier ou juridique.',
    health:
      'Avertissement : Cet outil est fourni à des fins de bien-être général et ne constitue pas un avis médical.',
    entertainment:
      'Avertissement : Cet outil est destiné au divertissement uniquement.',
  },
  copy: 'Copier',
  reset: 'Réinitialiser',
  calculate: 'Calculer',
  errorMessages: {
    required: 'Ce champ est requis.',
    invalidNumber: 'Veuillez saisir un nombre valide.',
    general: 'Une erreur est survenue lors du calcul.',
  },
  unitLabels: {
    days: 'Jours',
    months: 'Mois',
    years: 'Ans',
    percentage: '%',
    currency: 'Devise',
  },
  homeHeroHeading: 'Rechercher des Outils & Calculateurs en Ligne',
  homeHeroSubtitle: 'Trouvez et utilisez des calculateurs gratuits, convertisseurs et utilitaires fonctionnant directement dans votre navigateur.',
  valuePropositionTitle: 'Pourquoi choisir ToolsOfTools ?',
  valueProps: [
    {
      title: '100% Privé côté client',
      desc: 'Tous les calculs sont exécutés localement dans votre navigateur. Aucune donnée n’est envoyée à des serveurs distants.',
    },
    {
      title: 'Zéro latence & Réponse instantanée',
      desc: 'Aucun aller-retour réseau ni délai serveur. Les résultats se mettent à jour instantanément à la saisie.',
    },
    {
      title: 'Mathématiquement vérifié',
      desc: 'Formules et moteurs de calcul rigoureusement vérifiés selon les normes académiques et réglementaires.',
    },
  ],
  topTools: 'Outils et Calculateurs Populaires',
  calculadoraTitle: 'Calculatrice de base et scientifique',
  calculadoraSubtitle: 'Calcul rapide et privé directement dans votre navigateur avec prise en charge clavier.',
  sources: 'Sources',
  sourcesVerified: 'Formules vérifiées selon les standards mathématiques établis.',
  viewAllInHub: (hub: string) => `← Voir tous les outils ${hub}`,
  openTool: 'Ouvrir l’outil →',
  open: 'Ouvrir →',
  toolsAvailable: (count: number) => `${count} outils disponibles`,
  widget: {
    primaryValue: 'Valeur principale',
    rateOrPct: 'Taux / Pourcentage (%)',
    calculatedResult: 'Résultat calculé',
    standardFormulaNote: 'Basé sur une formule mathématique standard',
  },
};
