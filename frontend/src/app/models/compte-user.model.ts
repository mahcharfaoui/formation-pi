export type RoleCompte = 'ADMIN' | 'FORMATEUR' | 'ETUDIANT';
export type StatutCompte = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CompteUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: RoleCompte;
  statut: StatutCompte;
  dateCreation: string;
}

export interface RegisterRequest {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  role: RoleCompte;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: RoleCompte;
  statut: StatutCompte;
  token: string;
}
