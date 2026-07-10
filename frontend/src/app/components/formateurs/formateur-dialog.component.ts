import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { FormateurService } from '../../services/formateur.service';
import { Formateur } from '../../models/formateur.model';

@Component({
  selector: 'app-formateur-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatCheckboxModule, MatCardModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Nouveau' }} Formateur</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Nom *</mat-label>
          <input matInput [(ngModel)]="formateur.nom" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Prénom *</mat-label>
          <input matInput [(ngModel)]="formateur.prenom" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email *</mat-label>
          <input matInput type="email" [(ngModel)]="formateur.email" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Téléphone</mat-label>
          <input matInput [(ngModel)]="formateur.telephone">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Tarif horaire (€)</mat-label>
          <input matInput type="number" [(ngModel)]="formateur.tarifHoraire">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>CV</mat-label>
          <textarea matInput [(ngModel)]="formateur.cv" rows="4"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Photo URL</mat-label>
          <input matInput [(ngModel)]="formateur.photoUrl">
        </mat-form-field>
        <mat-checkbox [(ngModel)]="formateur.actif">Actif</mat-checkbox>
      </div>
      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="loading">Annuler</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!isValid() || loading">
        <span *ngIf="loading">Enregistrement...</span>
        <span *ngIf="!loading">{{ data ? 'Modifier' : 'Créer' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid { display: flex; flex-direction: column; gap: 16px; min-width: 450px; padding: 8px 0; }
    .error { padding: 8px 12px; background: #fce4ec; color: #c62828; border-radius: 4px; font-size: 13px; }
  `]
})
export class FormateurDialogComponent implements OnInit {
  formateur: Formateur = { nom: '', prenom: '', email: '', actif: true };
  loading = false;
  errorMsg = '';

  constructor(
    private service: FormateurService,
    private dialogRef: MatDialogRef<FormateurDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Formateur
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.formateur = { ...this.data };
    }
  }

  save(): void {
    this.loading = true;
    this.errorMsg = '';
    const request = this.data
      ? this.service.mettreAJourFormateur(this.data.id!, this.formateur)
      : this.service.creerFormateur(this.formateur);
    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => { this.errorMsg = err.error?.message || err.message || 'Erreur'; this.loading = false; }
    });
  }

  isValid(): boolean {
    return !!this.formateur.nom && !!this.formateur.prenom && !!this.formateur.email;
  }
}
