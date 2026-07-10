import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, Question, Tentative } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = '/api/quiz';

  constructor(private http: HttpClient) { }

  getQuiz(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  getQuizParChapitre(chapitreId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/chapitre/${chapitreId}`);
  }

  creerQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz);
  }

  mettreAJourQuiz(id: number, quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, quiz);
  }

  getQuestions(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${quizId}/questions`);
  }

  ajouterQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, question);
  }

  mettreAJourQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`, question);
  }

  supprimerQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${id}`);
  }

  supprimerQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  demarrerTentative(quizId: number, apprenantId: number): Observable<Tentative> {
    return this.http.post<Tentative>(`${this.apiUrl}/${quizId}/tentatives/apprenant/${apprenantId}`, {});
  }

  soumettreTentative(tentativeId: number, score: number): Observable<Tentative> {
    return this.http.put<Tentative>(`${this.apiUrl}/tentatives/${tentativeId}/soumettre?score=${score}`, {});
  }

  getDerniereTentative(quizId: number, apprenantId: number): Observable<Tentative> {
    return this.http.get<Tentative>(`${this.apiUrl}/${quizId}/apprenant/${apprenantId}/derniere-tentative`);
  }
}
