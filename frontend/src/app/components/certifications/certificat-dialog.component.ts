import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CertificationService } from '../../services/certification.service';
import { Certificat } from '../../models/certification.model';

@Component({
  selector: 'app-certificat-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule
  ],
  template: `
    <h2 mat-dialog-title>Générer un Certificat</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Apprenant ID *</mat-label>
          <input matInput type="number" [(ngModel)]="certificat.apprenantId" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Formation ID *</mat-label>
          <input matInput type="number" [(ngModel)]="certificat.formationId" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Score obtenu (%)</mat-label>
          <input matInput type="number" [(ngModel)]="certificat.scoreObtenu">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select [(ngModel)]="certificat.statut">
            <mat-option value="ACTIF">Actif</mat-option>
            <mat-option value="EXPIRE">Expiré</mat-option>
            <mat-option value="REVOQUE">Révoqué</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="loading">Annuler</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!isValid() || loading">
        <span *ngIf="loading">Génération...</span>
        <span *ngIf="!loading">Générer</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid { display: flex; flex-direction: column; gap: 16px; min-width: 400px; padding: 8px 0; }
    .error { padding: 8px 12px; background: #fce4ec; color: #c62828; border-radius: 4px; font-size: 13px; }
  `]
})
export class CertificatDialogComponent implements OnInit {
  certificat: Certificat = { apprenantId: 0, formationId: 0, statut: 'ACTIF' };
  loading = false;
  errorMsg = '';

  constructor(
    private service: CertificationService,
    private dialogRef: MatDialogRef<CertificatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Certificat
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.certificat = { ...this.data };
    }
  }

  save(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.genererCertificat(this.certificat).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => { this.errorMsg = err.error?.message || err.message || 'Erreur'; this.loading = false; }
    });
  }

  isValid(): boolean {
    return this.certificat.apprenantId > 0 && this.certificat.formationId > 0;
  }
}
