import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation, Categorie, Chapitre } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private apiUrl = '/api/catalogue';

  constructor(private http: HttpClient) { }

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`);
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/formations/${id}`);
  }

  creerFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/formations`, formation);
  }

  mettreAJourFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/formations/${id}`, formation);
  }

  supprimerFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/formations/${id}`);
  }

  rechercherFormations(motCle: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations/recherche`, {
      params: { motCle }
    });
  }

  getChapitres(formationId: number): Observable<Chapitre[]> {
    return this.http.get<Chapitre[]>(`${this.apiUrl}/formations/${formationId}/chapitres`);
  }

  creerChapitre(chapitre: Chapitre): Observable<Chapitre> {
    return this.http.post<Chapitre>(`${this.apiUrl}/chapitres`, chapitre);
  }

  mettreAJourChapitre(id: number, chapitre: Chapitre): Observable<Chapitre> {
    return this.http.put<Chapitre>(`${this.apiUrl}/chapitres/${id}`, chapitre);
  }

  supprimerChapitre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/chapitres/${id}`);
  }

  uploadFichier(file: File): Observable<{ url: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; fileName: string }>(`${this.apiUrl}/upload`, formData);
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categories`);
  }

  creerCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiUrl}/categories`, categorie);
  }
}
