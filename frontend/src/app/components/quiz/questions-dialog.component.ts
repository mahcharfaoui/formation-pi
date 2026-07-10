import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { QuizService } from '../../services/quiz.service';
import { Question, Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-questions-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatTableModule, MatCardModule, MatChipsModule, MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title>Questions du Quiz : {{ quiz.titre }}</h2>
    <mat-dialog-content>
      <table mat-table [dataSource]="questions" class="questions-table">
        <ng-container matColumnDef="enonce">
          <th mat-header-cell *matHeaderCellDef>Énoncé</th>
          <td mat-cell *matCellDef="let q">{{ q.enonce }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let q">
            <mat-chip>{{ q.type }}</mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="points">
          <th mat-header-cell *matHeaderCellDef>Points</th>
          <td mat-cell *matCellDef="let q">{{ q.points }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let q; let i = index">
            <button mat-icon-button color="primary" (click)="editerQuestion(q)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="supprimerQuestion(q, i)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="['enonce', 'type', 'points', 'actions']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['enonce', 'type', 'points', 'actions']"></tr>
      </table>

      <div *ngIf="questions.length === 0" class="empty-msg">Aucune question pour ce quiz.</div>

      <mat-divider class="divider"></mat-divider>

      <h3>{{ questionForm.id ? 'Modifier' : 'Nouvelle' }} Question</h3>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Énoncé *</mat-label>
          <textarea matInput [(ngModel)]="questionForm.enonce" rows="2" required></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Type *</mat-label>
          <mat-select [(ngModel)]="questionForm.type">
            <mat-option value="QCM">QCM</mat-option>
            <mat-option value="VRAI_FALSAIRE">Vrai/Faux</mat-option>
            <mat-option value="REPONSE_COURTE">Réponse courte</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Points *</mat-label>
          <input matInput type="number" [(ngModel)]="questionForm.points" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Réponse correcte *</mat-label>
          <input matInput [(ngModel)]="questionForm.reponseCorrecte" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Choix proposés (séparés par |)</mat-label>
          <input matInput [(ngModel)]="choixStr" placeholder="Option 1|Option 2|Option 3">
        </mat-form-field>
      </div>
      <div *ngIf="formError" class="error">{{ formError }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="annulerEdition()" *ngIf="questionForm.id">Annuler édition</button>
      <button mat-raised-button color="primary" (click)="saveQuestion()" [disabled]="!isFormValid() || loading">
        {{ questionForm.id ? 'Modifier' : 'Ajouter' }}
      </button>
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .questions-table { width: 100%; margin-bottom: 16px; }
    .empty-msg { text-align: center; padding: 24px; color: #888; }
    .divider { margin: 16px 0; }
    .form-grid { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .error { padding: 8px 12px; background: #fce4ec; color: #c62828; border-radius: 4px; font-size: 13px; }
  `]
})
export class QuestionsDialogComponent implements OnInit {
  questions: Question[] = [];
  questionForm: Partial<Question> = { enonce: '', type: 'QCM', points: 1, reponseCorrecte: '', quizId: 0 };
  choixStr = '';
  loading = false;
  formError = '';

  constructor(
    private service: QuizService,
    private dialogRef: MatDialogRef<QuestionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public quiz: Quiz
  ) { }

  ngOnInit(): void {
    this.chargerQuestions();
  }

  chargerQuestions(): void {
    if (!this.quiz.id) return;
    this.service.getQuestions(this.quiz.id).subscribe(data => {
      this.questions = data;
    });
  }

  editerQuestion(q: Question): void {
    this.questionForm = { ...q };
    this.choixStr = q.choixProposes?.join(' | ') || '';
  }

  annulerEdition(): void {
    this.questionForm = { enonce: '', type: 'QCM', points: 1, reponseCorrecte: '', quizId: 0 };
    this.choixStr = '';
    this.formError = '';
  }

  saveQuestion(): void {
    this.formError = '';
    this.loading = true;
    const question: Question = {
      ...this.questionForm as Question,
      quizId: this.quiz.id!,
      choixProposes: this.choixStr ? this.choixStr.split('|').map(s => s.trim()).filter(s => s) : undefined
    };

    const request = question.id
      ? this.service.mettreAJourQuestion(question.id, question)
      : this.service.ajouterQuestion(question);

    request.subscribe({
      next: () => {
        this.chargerQuestions();
        this.annulerEdition();
        this.loading = false;
      },
      error: (err) => {
        this.formError = err.error?.message || err.message || 'Erreur';
        this.loading = false;
      }
    });
  }

  supprimerQuestion(q: Question, index: number): void {
    if (!q.id) return;
    this.service.supprimerQuestion(q.id).subscribe({
      next: () => this.questions.splice(index, 1),
      error: (err) => this.formError = err.error?.message || err.message || 'Erreur'
    });
  }

  isFormValid(): boolean {
    return !!this.questionForm.enonce && !!this.questionForm.type && !!this.questionForm.reponseCorrecte && (this.questionForm.points ?? 0) > 0;
  }
}
