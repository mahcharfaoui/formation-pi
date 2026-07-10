import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { CompteUser, RegisterRequest, LoginRequest, LoginResponse } from '../models/compte-user.model';
import { Apprenant } from '../models/apprenant.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private usersApiUrl = '/api/users';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  register(data: RegisterRequest): Observable<CompteUser> {
    return this.http.post<CompteUser>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  isFormateur(): boolean {
    return this.getCurrentUser()?.role === 'FORMATEUR';
  }

  isEtudiant(): boolean {
    return this.getCurrentUser()?.role === 'ETUDIANT';
  }

  getPendingUsers(): Observable<CompteUser[]> {
    return this.http.get<CompteUser[]>(`${this.apiUrl}/users/pending`);
  }

  getAllUsers(): Observable<CompteUser[]> {
    return this.http.get<CompteUser[]>(`${this.apiUrl}/users`);
  }

  approveUser(id: number): Observable<CompteUser> {
    return this.http.put<CompteUser>(`${this.apiUrl}/approve/${id}`, {});
  }

  rejectUser(id: number): Observable<CompteUser> {
    return this.http.put<CompteUser>(`${this.apiUrl}/reject/${id}`, {});
  }

  getApprenantByEmail(email: string): Observable<Apprenant> {
    return this.http.get<Apprenant>(`${this.usersApiUrl}/apprenants/email/${encodeURIComponent(email)}`);
  }

  getFormationsChoisies(apprenantId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/apprenant/${apprenantId}/formations`);
  }

  sauvegarderFormationsChoisies(apprenantId: number, formationIds: number[]): Observable<number[]> {
    return this.http.post<number[]>(`${this.apiUrl}/apprenant/${apprenantId}/formations`, formationIds);
  }
}
