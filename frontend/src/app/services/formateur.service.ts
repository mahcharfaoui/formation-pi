import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formateur, Expertise } from '../models/formateur.model';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = '/api/formateurs';

  constructor(private http: HttpClient) { }

  getFormateurs(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(this.apiUrl);
  }

  getFormateurById(id: number): Observable<Formateur> {
    return this.http.get<Formateur>(`${this.apiUrl}/${id}`);
  }

  creerFormateur(formateur: Formateur): Observable<Formateur> {
    return this.http.post<Formateur>(this.apiUrl, formateur);
  }

  mettreAJourFormateur(id: number, formateur: Formateur): Observable<Formateur> {
    return this.http.put<Formateur>(`${this.apiUrl}/${id}`, formateur);
  }

  supprimerFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getExpertises(formateurId: number): Observable<Expertise[]> {
    return this.http.get<Expertise[]>(`${this.apiUrl}/${formateurId}/expertises`);
  }

  ajouterExpertise(expertise: Expertise): Observable<Expertise> {
    return this.http.post<Expertise>(`${this.apiUrl}/expertises`, expertise);
  }
}
