import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionFormation, Inscription } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = '/api/sessions';

  constructor(private http: HttpClient) { }

  getSessions(): Observable<SessionFormation[]> {
    return this.http.get<SessionFormation[]>(this.apiUrl);
  }

  getSessionById(id: number): Observable<SessionFormation> {
    return this.http.get<SessionFormation>(`${this.apiUrl}/${id}`);
  }

  creerSession(session: SessionFormation): Observable<SessionFormation> {
    return this.http.post<SessionFormation>(this.apiUrl, session);
  }

  mettreAJourSession(id: number, session: SessionFormation): Observable<SessionFormation> {
    return this.http.put<SessionFormation>(`${this.apiUrl}/${id}`, session);
  }

  inscrireApprenant(sessionId: number, apprenantId: number): Observable<Inscription> {
    return this.http.post<Inscription>(`${this.apiUrl}/${sessionId}/inscriptions/apprenant/${apprenantId}`, {});
  }

  getInscriptions(sessionId: number): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.apiUrl}/${sessionId}/inscriptions`);
  }

  getInscriptionsByApprenant(apprenantId: number): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.apiUrl}/apprenant/${apprenantId}/inscriptions`);
  }

  getSessionsByFormation(formationId: number): Observable<SessionFormation[]> {
    return this.http.get<SessionFormation[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  supprimerSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
