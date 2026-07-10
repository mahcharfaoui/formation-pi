export interface Certificat {
  id?: number;
  numeroCertificat?: string;
  apprenantId: number;
  formationId: number;
  dateObtention?: string;
  dateExpiration?: string;
  valide?: boolean;
  statut: string;
  scoreObtenu?: number;
}
