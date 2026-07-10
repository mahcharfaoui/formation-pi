import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../models/quiz.model';
import { QuizDialogComponent } from './quiz-dialog.component';
import { QuestionsDialogComponent } from './questions-dialog.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    QuizDialogComponent,
    QuestionsDialogComponent
  ],
  template: `
    <div class="quiz-container">
      <div class="header">
        <h1>Gestion des Quiz</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nouveau Quiz
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="quizList" class="quiz-table">
            <ng-container matColumnDef="titre">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let quiz">{{ quiz.titre }}</td>
            </ng-container>

            <ng-container matColumnDef="duree">
              <th mat-header-cell *matHeaderCellDef>Durée</th>
              <td mat-cell *matCellDef="let quiz">{{ quiz.dureeMinutes }} min</td>
            </ng-container>

            <ng-container matColumnDef="scoreMinimum">
              <th mat-header-cell *matHeaderCellDef>Score Min</th>
              <td mat-cell *matCellDef="let quiz">{{ quiz.scoreMinimum }}%</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let quiz">
                <button mat-icon-button color="primary" (click)="voirQuestions(quiz)">
                  <mat-icon>help_outline</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="modifier(quiz)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="supprimer(quiz)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="colonnes"></tr>
            <tr mat-row *matRowDef="let row; columns: colonnes;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .quiz-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .quiz-table {
      width: 100%;
    }
  `]
})
export class QuizComponent implements OnInit {
  quizList: Quiz[] = [];
  colonnes = ['titre', 'duree', 'scoreMinimum', 'actions'];

  constructor(
    private auth: AuthService,
    private quizService: QuizService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.auth.isEtudiant()) {
      this.router.navigate(['/mes-formations']);
      return;
    }
    this.chargerQuiz();
  }

  chargerQuiz(): void {
    this.quizService.getQuiz().subscribe(data => {
      this.quizList = data;
    });
  }

  openDialog(): void {
    const ref = this.dialog.open(QuizDialogComponent, { width: '550px' });
    ref.afterClosed().subscribe(r => { if (r) this.chargerQuiz(); });
  }

  modifier(quiz: Quiz): void {
    const ref = this.dialog.open(QuizDialogComponent, { width: '550px', data: quiz });
    ref.afterClosed().subscribe(r => { if (r) this.chargerQuiz(); });
  }

  supprimer(quiz: Quiz): void {
    if (!confirm(`Supprimer le quiz "${quiz.titre}" ?`)) return;
    this.quizService.supprimerQuiz(quiz.id!).subscribe(() => this.chargerQuiz());
  }

  voirQuestions(quiz: Quiz): void {
    this.dialog.open(QuestionsDialogComponent, { width: '800px', data: quiz })
      .afterClosed().subscribe();
  }
}
