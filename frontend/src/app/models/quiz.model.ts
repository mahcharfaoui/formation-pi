export interface Quiz {
  id?: number;
  titre: string;
  description: string;
  chapitreId: number;
  formationId?: number;
  dureeMinutes: number;
  scoreMinimum: number;
  actif: boolean;
}

export interface Question {
  id?: number;
  enonce: string;
  type: string;
  points: number;
  reponseCorrecte: string;
  choixProposes?: string[];
  quizId: number;
}

export interface Tentative {
  id?: number;
  apprenantId: number;
  quizId: number;
  score?: number;
  scoreMax?: number;
  reussi?: boolean;
  dateDebut?: string;
  dateFin?: string;
}
