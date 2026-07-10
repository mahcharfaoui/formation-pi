import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apprenant, Competence } from '../models/apprenant.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  getApprenants(): Observable<Apprenant[]> {
    return this.http.get<Apprenant[]>(`${this.apiUrl}/apprenants`);
  }

  getApprenantById(id: number): Observable<Apprenant> {
    return this.http.get<Apprenant>(`${this.apiUrl}/apprenants/${id}`);
  }

  creerApprenant(apprenant: Apprenant): Observable<Apprenant> {
    return this.http.post<Apprenant>(`${this.apiUrl}/apprenants`, apprenant);
  }

  mettreAJourApprenant(id: number, apprenant: Apprenant): Observable<Apprenant> {
    return this.http.put<Apprenant>(`${this.apiUrl}/apprenants/${id}`, apprenant);
  }

  supprimerApprenant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/apprenants/${id}`);
  }

  getCompetences(apprenantId: number): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.apiUrl}/apprenants/${apprenantId}/competences`);
  }

  ajouterCompetence(competence: Competence): Observable<Competence> {
    return this.http.post<Competence>(`${this.apiUrl}/competences`, competence);
  }
}
