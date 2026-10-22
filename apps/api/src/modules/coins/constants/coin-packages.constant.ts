export enum CoinPackageId {
  STARTER_100 = 'STARTER_100',
  PRO_350 = 'PRO_350',
  MASTER_1000 = 'MASTER_1000',
}

export interface CoinPackageDefinition {
  id: CoinPackageId;
  name: string;
  coins: number;
  priceCents: number; // in EUR cents, e.g. 499 = €4.99
  formattedPrice: string;
  badge?: string;
  description: string;
  features: string[];
}

export const COIN_PACKAGES: Record<CoinPackageId, CoinPackageDefinition> = {
  [CoinPackageId.STARTER_100]: {
    id: CoinPackageId.STARTER_100,
    name: 'Starter Coin Pack',
    coins: 100,
    priceCents: 499,
    formattedPrice: '€4,99',
    description: 'Perfekt für zusätzliche Vokabel-Tests und erste Tandem-Sitzungen.',
    features: [
      '100 Ausbildungs-Coins',
      'Sofortige Gutschrift',
      '4x geführte Tandem-Sprachpraxis',
      'Kein Ablaufdatum',
    ],
  },
  [CoinPackageId.PRO_350]: {
    id: CoinPackageId.PRO_350,
    name: 'Pro Applicant Pack',
    coins: 350,
    priceCents: 1299,
    formattedPrice: '€12,99',
    badge: 'Am beliebtesten',
    description: 'Für intensive Bewerber: deckt Fachkurse und Vorstellungsgesprächs-Simulationen ab.',
    features: [
      '350 Ausbildungs-Coins (+50 Bonus)',
      '14x geführte Tandem-Sprachpraxis',
      '1x Fachkurs-Freischaltung (z.B. Pflege B2)',
      'Prioritäts-Matching im WebRTC-Tandem',
    ],
  },
  [CoinPackageId.MASTER_1000]: {
    id: CoinPackageId.MASTER_1000,
    name: 'Vocational Master Pack',
    coins: 1000,
    priceCents: 2999,
    formattedPrice: '€29,99',
    badge: 'Bester Wert (40% Ersparnis)',
    description: 'Das Komplettpaket für die 100%ige Vorbereitung auf Ausbildung und Visumsinterview.',
    features: [
      '1.000 Ausbildungs-Coins (+250 Bonus)',
      'Unbegrenzte Tandem-Sprachdrills',
      'Freischaltung aller Spezialkurse & Zertifikate',
      'Exklusive B2-Musterinterviews mit Fachprüfern',
    ],
  },
};
