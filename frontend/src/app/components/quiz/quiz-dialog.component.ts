import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { QuizService } from '../../services/quiz.service';
import { CatalogueService } from '../../services/catalogue.service';
import { Quiz, Question } from '../../models/quiz.model';
import { Formation, Chapitre } from '../../models/formation.model';
import { map, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-quiz-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    MatCheckboxModule, MatCardModule, MatIconModule, MatTooltipModule, MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Nouveau' }} Quiz</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Titre *</mat-label>
          <input matInput [(ngModel)]="quiz.titre" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="quiz.description" rows="2"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Formation *</mat-label>
          <mat-select [(ngModel)]="quiz.formationId" (selectionChange)="onFormationChange()" required>
            <mat-option *ngFor="let f of formations" [value]="f.id">{{ f.titre }}</mat-option>
            <mat-option *ngIf="formations.length === 0" [value]="0" disabled>Aucune formation avec des cours disponibles</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Durée (minutes)</mat-label>
          <input matInput type="number" [(ngModel)]="quiz.dureeMinutes">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Score minimum (%)</mat-label>
          <input matInput type="number" [(ngModel)]="quiz.scoreMinimum">
        </mat-form-field>
        <mat-checkbox [(ngModel)]="quiz.actif">Actif</mat-checkbox>
      </div>

      <mat-divider class="divider"></mat-divider>

      <div *ngIf="quiz.formationId && chapitres.length > 0" class="chapitres-section">
        <h3>Questions par cours</h3>
        <div *ngFor="let chapitre of chapitres" class="chapitre-block">
          <div class="chapitre-header">
            <mat-icon>menu_book</mat-icon>
            <span>{{ chapitre.titre }}</span>
            <button mat-icon-button color="primary" (click)="ajouterQuestion(chapitre)" matTooltip="Ajouter une question">
              <mat-icon>add_circle</mat-icon>
            </button>
          </div>
          <div *ngFor="let q of getQuestionsByChapitre(chapitre.id!); let i = index" class="question-item">
            <span class="q-enonce">{{ q.enonce }}</span>
            <span class="q-type">{{ q.type }}</span>
            <span class="q-points">{{ q.points }} pts</span>
            <button mat-icon-button color="warn" (click)="retirerQuestion(i, chapitre)" size="small">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="loading">Annuler</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!peutSauvegarder() || loading">
        <span *ngIf="loading">Enregistrement...</span>
        <span *ngIf="!loading">{{ data ? 'Modifier' : 'Créer' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid { display: flex; flex-direction: column; gap: 16px; min-width: 500px; padding: 8px 0; }
    .divider { margin: 16px 0; }
    .chapitres-section h3 { margin: 0 0 12px; color: #333; font-size: 16px; }
    .chapitre-block { margin-bottom: 16px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; }
    .chapitre-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #3f51b5; font-weight: 500; }
    .chapitre-header mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .chapitre-header span { flex: 1; }
    .question-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: #f5f7ff; border-radius: 4px; margin-bottom: 4px; font-size: 13px; }
    .q-enonce { flex: 1; color: #333; }
    .q-type { color: #666; font-size: 11px; background: #e8eaf6; padding: 2px 6px; border-radius: 4px; }
    .q-points { color: #888; font-size: 11px; min-width: 30px; text-align: right; }
    .question-item button { width: 24px; height: 24px; line-height: 24px; }
    .question-item button mat-icon { font-size: 16px; width: 16px; height: 16px; line-height: 16px; }
    .error { padding: 8px 12px; background: #fce4ec; color: #c62828; border-radius: 4px; font-size: 13px; margin-top: 12px; }
  `]
})
export class QuizDialogComponent implements OnInit {
  quiz: Quiz = { titre: '', description: '', chapitreId: 0, formationId: undefined, dureeMinutes: 30, scoreMinimum: 50, actif: true };
  formations: Formation[] = [];
  chapitres: Chapitre[] = [];
  questions: { chapitreId: number; question: Partial<Question> }[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private service: QuizService,
    private catalogue: CatalogueService,
    private dialogRef: MatDialogRef<QuizDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Quiz
  ) {}

  ngOnInit(): void {
    this.catalogue.getFormations().subscribe(fs => {
      const checks = fs.map(f =>
        f.id ? this.catalogue.getChapitres(f.id).pipe(map(cs => ({ formation: f, chapitres: cs }))) : of(null)
      );
      forkJoin(checks).subscribe(results => {
        this.formations = results
          .filter(r => r && r.chapitres.length > 0)
          .map(r => r!.formation);
        if (this.data) {
          this.quiz = { ...this.data };
          if (this.quiz.formationId) this.onFormationChange();
        }
      });
    });
  }

  onFormationChange(): void {
    if (!this.quiz.formationId) { this.chapitres = []; return; }
    this.catalogue.getChapitres(this.quiz.formationId).subscribe(cs => {
      this.chapitres = cs;
      if (cs.length && !this.quiz.chapitreId) this.quiz.chapitreId = cs[0].id!;
    });
  }

  getQuestionsByChapitre(chapitreId: number): Partial<Question>[] {
    return this.questions.filter(q => q.chapitreId === chapitreId).map(q => q.question);
  }

  ajouterQuestion(chapitre: Chapitre): void {
    const enonce = prompt('Énoncé de la question pour "' + chapitre.titre + '" :');
    if (!enonce) return;
    const type = prompt('Type (QCM / VRAI_FALSAIRE / REPONSE_COURTE) :', 'QCM') || 'QCM';
    const points = parseInt(prompt('Points :', '1') || '1', 10);
    const reponse = prompt('Réponse correcte :');
    if (!reponse) return;
    this.questions.push({
      chapitreId: chapitre.id!,
      question: { enonce, type, points, reponseCorrecte: reponse, choixProposes: undefined }
    });
  }

  retirerQuestion(index: number, chapitre: Chapitre): void {
    const chapitreQuestions = this.questions.filter(q => q.chapitreId === chapitre.id!);
    const globalIndex = this.questions.indexOf(chapitreQuestions[index]);
    if (globalIndex >= 0) this.questions.splice(globalIndex, 1);
  }

  save(): void {
    this.loading = true;
    this.errorMsg = '';
    this.quiz.chapitreId = this.chapitres[0]?.id || 0;

    const request = this.data
      ? this.service.mettreAJourQuiz(this.data.id!, this.quiz)
      : this.service.creerQuiz(this.quiz);

    request.subscribe({
      next: (saved) => {
        if (this.questions.length && saved.id) {
          let completed = 0;
          for (const q of this.questions) {
            this.service.ajouterQuestion({
              enonce: q.question.enonce!,
              type: q.question.type!,
              points: q.question.points!,
              reponseCorrecte: q.question.reponseCorrecte!,
              quizId: saved.id,
              choixProposes: q.question.choixProposes
            }).subscribe({
              next: () => { completed++; if (completed === this.questions.length) this.dialogRef.close(true); },
              error: () => { completed++; if (completed === this.questions.length) this.dialogRef.close(true); }
            });
          }
        } else {
          this.dialogRef.close(true);
        }
      },
      error: (err) => { this.errorMsg = err.error?.message || err.message || 'Erreur'; this.loading = false; }
    });
  }

  isValid(): boolean {
    return !!this.quiz.titre && !!this.quiz.formationId;
  }

  peutSauvegarder(): boolean {
    return this.isValid() && this.chapitres.length > 0;
  }
}
