export interface SessionFormation {
  id?: number;
  formationIds: number[];
  formateurId: number;
  dateDebut: string;
  dateFin: string;
  capaciteMax: number;
  statut: string;
  participantsActuels: number;
  lieu?: string;
  enLigne: boolean;
  totalHeures?: number;
}

export interface Inscription {
  id?: number;
  apprenantId: number;
  dateInscription: string;
  statut: string;
  sessionId: number;
}
