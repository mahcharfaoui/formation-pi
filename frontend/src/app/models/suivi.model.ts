export interface Progression {
  id?: number;
  apprenantId: number;
  formationId: number;
  chapitreId: number;
  pourcentage: number;
  termine: boolean;
  dateDebut?: string;
  dateFin?: string;
}

export interface Avis {
  id?: number;
  apprenantId: number;
  formationId: number;
  note: number;
  commentaire?: string;
  dateAvis?: string;
}
