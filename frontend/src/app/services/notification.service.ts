import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id?: number;
  message: string;
  type: string;
  lue: boolean;
  dateCreation?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = '/api/notifications';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getNonLues(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/non-lues`);
  }

  countNonLues(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  creer(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  marquerLue(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/lu`, {});
  }
}
