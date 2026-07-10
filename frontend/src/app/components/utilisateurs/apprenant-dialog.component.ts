import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Apprenant } from '../../models/apprenant.model';

@Component({
  selector: 'app-apprenant-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatCardModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Nouvel' }} Apprenant</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Nom *</mat-label>
          <input matInput [(ngModel)]="apprenant.nom" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Prénom *</mat-label>
          <input matInput [(ngModel)]="apprenant.prenom" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email *</mat-label>
          <input matInput type="email" [(ngModel)]="apprenant.email" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Téléphone</mat-label>
          <input matInput [(ngModel)]="apprenant.telephone">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Date de naissance</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="apprenant.dateNaissance">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Adresse</mat-label>
          <input matInput [(ngModel)]="apprenant.adresse">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select [(ngModel)]="apprenant.statut" required>
            <mat-option value="ACTIF">Actif</mat-option>
            <mat-option value="INACTIF">Inactif</mat-option>
            <mat-option value="SUSPENDU">Suspendu</mat-option>
            <mat-option value="ARCHIVE">Archivé</mat-option>
          </mat-select>
        </mat-form-field>
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
export class ApprenantDialogComponent implements OnInit {
  apprenant: Apprenant = { nom: '', prenom: '', email: '', telephone: '', statut: 'ACTIF' };
  loading = false;
  errorMsg = '';

  constructor(
    private service: UtilisateurService,
    private dialogRef: MatDialogRef<ApprenantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Apprenant
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.apprenant = { ...this.data };
    }
  }

  save(): void {
    if (!this.isValid()) return;
    this.loading = true;
    this.errorMsg = '';
    const request = this.data
      ? this.service.mettreAJourApprenant(this.data.id!, this.apprenant)
      : this.service.creerApprenant(this.apprenant);
    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => { this.errorMsg = err.error?.message || err.message || 'Erreur lors de la création'; this.loading = false; }
    });
  }

  isValid(): boolean {
    return !!this.apprenant.nom && !!this.apprenant.prenom && !!this.apprenant.email;
  }
}
