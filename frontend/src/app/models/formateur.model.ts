export interface Formateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  photoUrl?: string;
  cv?: string;
  actif: boolean;
  tarifHoraire?: number;
}

export interface Expertise {
  id?: number;
  domaine: string;
  specialite?: string;
  anneesExperience?: number;
  niveau: string;
  formateurId: number;
}

export interface Disponibilite {
  id?: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
  commentaires?: string;
  formateurId: number;
}
