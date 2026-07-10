export interface Apprenant {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;
  photoUrl?: string;
  statut: string;
  dateCreation?: string;
}

export interface Profil {
  id?: number;
  type: string;
  entreprise?: string;
  poste?: string;
  domaine?: string;
  bio?: string;
  apprenantId: number;
}

export interface Competence {
  id?: number;
  nom: string;
  categorie?: string;
  niveau: string;
  dateObtention?: string;
  apprenantId: number;
}
