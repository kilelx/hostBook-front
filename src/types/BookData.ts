export enum RecommendationType {
  RESTAURANT = 'RESTAURANT',
  ACTIVITY = 'ACTIVITY',
  BAR = 'BAR',
  TOURISM = 'TOURISM',
  GROCERY = 'GROCERY'
}

export interface Recommendation {
  id?: string;
  name: string;
  address?: string;
  description?: string;
  type: RecommendationType;
}

export interface BookData {
  id?: string;

  // Arrivée
  arrivalTime: string;
  accessInstructions: string;
  arrivalAdditionalInfo: string;

  // Départ
  departureTime: string;
  exitInstructions: string;
  departureAdditionalInfo: string;

  // Hébergement
  wifiName: string;
  wifiPassword: string;
  houseRules: string;
  ownerContact: string;
  ownerName: string;
  generalInfo: string;

  // Sécurité
  accessPassword?: string;

  // Recommandations
  recommendations: Recommendation[];
}
