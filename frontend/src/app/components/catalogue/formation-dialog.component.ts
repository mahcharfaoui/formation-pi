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
import { CatalogueService } from '../../services/catalogue.service';
import { Formation, Categorie } from '../../models/formation.model';

@Component({
  selector: 'app-formation-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatCardModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Nouvelle' }} Formation</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Titre *</mat-label>
          <input matInput [(ngModel)]="formation.titre" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="formation.description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Catégorie *</mat-label>
          <mat-select [(ngModel)]="formation.categorieId" required>
            <mat-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.nom }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Niveau *</mat-label>
          <mat-select [(ngModel)]="formation.niveau" required>
            <mat-option value="DEBUTANT">Débutant</mat-option>
            <mat-option value="INTERMEDIAIRE">Intermédiaire</mat-option>
            <mat-option value="AVANCE">Avancé</mat-option>
            <mat-option value="EXPERT">Expert</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Durée (heures) *</mat-label>
          <input matInput type="number" [(ngModel)]="formation.dureeHeures" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tarif (€)</mat-label>
          <input matInput type="number" [(ngModel)]="formation.tarif">
        </mat-form-field>

        <mat-checkbox [(ngModel)]="formation.active">Active</mat-checkbox>

        <div class="hint">
          <span *ngIf="!isValid()">Champs requis manquants : 
            <span *ngIf="!formation.titre">Titre, </span>
            <span *ngIf="!formation.dureeHeures || formation.dureeHeures <= 0">Durée, </span>
            <span *ngIf="!formation.categorieId">Catégorie</span>
          </span>
        </div>
        <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
      </div>
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
    .form-grid { display: flex; flex-direction: column; gap: 16px; min-width: 400px; padding: 8px 0; }
    .hint { font-size: 12px; color: #f44336; min-height: 18px; }
    .error { padding: 8px 12px; background: #fce4ec; color: #c62828; border-radius: 4px; font-size: 13px; }
  `]
})
export class FormationDialogComponent implements OnInit {
  formation: Formation = {
    titre: '', description: '', tarif: 0, dureeHeures: 0,
    niveau: 'DEBUTANT', active: true, categorieId: 0
  };
  categories: Categorie[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private catalogueService: CatalogueService,
    private dialogRef: MatDialogRef<FormationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Formation
  ) {}

  ngOnInit(): void {
    this.catalogueService.getCategories().subscribe(cats => this.categories = cats);
    if (this.data) {
      this.formation = { ...this.data };
    }
  }

  save(): void {
    this.loading = true;
    this.errorMsg = '';
    const body = {
      titre: this.formation.titre,
      description: this.formation.description,
      tarif: this.formation.tarif || 0,
      dureeHeures: this.formation.dureeHeures,
      niveau: this.formation.niveau,
      active: this.formation.active,
      categorie: { id: this.formation.categorieId }
    };
    const request = this.data
      ? this.catalogueService.mettreAJourFormation(this.data.id!, body as Formation)
      : this.catalogueService.creerFormation(body as Formation);
    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Erreur création formation', err);
        this.errorMsg = err.error?.message || err.message || 'Erreur lors de la création';
        this.loading = false;
      }
    });
  }

  isValid(): boolean {
    return !!this.formation.titre && this.formation.dureeHeures > 0 && (this.formation.categorieId ?? 0) > 0;
  }
}
