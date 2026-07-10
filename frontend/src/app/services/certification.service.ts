import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificat } from '../models/certification.model';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private apiUrl = '/api/certifications';

  constructor(private http: HttpClient) { }

  getCertificats(): Observable<Certificat[]> {
    return this.http.get<Certificat[]>(this.apiUrl);
  }

  getCertificatById(id: number): Observable<Certificat> {
    return this.http.get<Certificat>(`${this.apiUrl}/${id}`);
  }

  genererCertificat(certificat: Certificat): Observable<Certificat> {
    return this.http.post<Certificat>(this.apiUrl, certificat);
  }

  validerCertificat(id: number): Observable<Certificat> {
    return this.http.put<Certificat>(`${this.apiUrl}/${id}/valider`, {});
  }

  revoquerCertificat(id: number): Observable<Certificat> {
    return this.http.put<Certificat>(`${this.apiUrl}/${id}/revoquer`, {});
  }

  getCertificatsApprenant(apprenantId: number): Observable<Certificat[]> {
    return this.http.get<Certificat[]>(`${this.apiUrl}/apprenant/${apprenantId}`);
  }

  verifierValidite(numero: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verifier/${numero}`);
  }

  telechargerPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
