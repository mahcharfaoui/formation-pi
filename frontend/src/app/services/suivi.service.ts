import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Progression, Avis } from '../models/suivi.model';

@Injectable({
  providedIn: 'root'
})
export class SuiviService {
  private apiUrl = '/api/suivi';

  constructor(private http: HttpClient) { }

  getProgressions(apprenantId: number): Observable<Progression[]> {
    return this.http.get<Progression[]>(`${this.apiUrl}/apprenant/${apprenantId}/progressions`);
  }

  getProgressionsParFormation(apprenantId: number, formationId: number): Observable<Progression[]> {
    return this.http.get<Progression[]>(`${this.apiUrl}/apprenant/${apprenantId}/formation/${formationId}/progressions`);
  }

  mettreAJourProgression(apprenantId: number, formationId: number, chapitreId: number, pourcentage: number): Observable<Progression> {
    return this.http.post<Progression>(`${this.apiUrl}/progressions?apprenantId=${apprenantId}&formationId=${formationId}&chapitreId=${chapitreId}&pourcentage=${pourcentage}`, {});
  }

  getProgressionGlobale(apprenantId: number, formationId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/apprenant/${apprenantId}/formation/${formationId}/progression-globale`);
  }

  ajouterAvis(avis: Avis): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/avis`, avis);
  }

  getAvisParFormation(formationId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/formation/${formationId}/avis`);
  }
}
