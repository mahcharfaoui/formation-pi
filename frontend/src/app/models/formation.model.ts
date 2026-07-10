export interface Formation {
  id?: number;
  titre: string;
  description: string;
  tarif: number;
  dureeHeures: number;
  niveau: string;
  active: boolean;
  categorie?: Categorie;
  categorieId?: number;
  imageUrl?: string;
  competencesRequises?: string;
}

export interface Categorie {
  id?: number;
  nom: string;
  description: string;
  iconUrl?: string;
}

export interface Chapitre {
  id?: number;
  titre: string;
  description: string;
  ordre: number;
  dureeMinutes: number;
  contenuUrl?: string;
  videoUrl?: string;
  typeContenu: string;
  formationId: number;
  formation?: { id: number };
}
