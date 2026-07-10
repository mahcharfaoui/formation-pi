import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CatalogueService } from '../../services/catalogue.service';
import { Formation, Chapitre } from '../../models/formation.model';

@Component({
  selector: 'app-gestion-chapitres',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, MatTableModule, MatButtonModule,
    MatIconModule, MatCardModule, MatDialogModule, MatInputModule,
    MatFormFieldModule, MatProgressBarModule, MatSelectModule, MatTooltipModule, MatSnackBarModule
  ],
  template: `
    <div class="gestion-container">
      <div class="header">
        <div>
          <button mat-button routerLink="/catalogue" class="back-btn">
            <mat-icon>arrow_back</mat-icon> Retour au catalogue
          </button>
          <h1 *ngIf="formation">{{ formation.titre }}</h1>
          <p class="subtitle" *ngIf="formation">{{ formation.description }}</p>
        </div>
        <button mat-raised-button color="primary" (click)="ajouter()">
          <mat-icon>add</mat-icon> Ajouter un cours
        </button>
      </div>

      <mat-card *ngIf="chapitres.length === 0 && !loading" class="empty-card">
        <mat-card-content>
          <p>Aucun cours ajouté pour cette formation.</p>
          <p>Cliquez sur "Ajouter un cours" pour ajouter des chapitres (PDF, vidéos, exercices).</p>
        </mat-card-content>
      </mat-card>

      <div *ngIf="!edition" class="table-wrapper">
        <table mat-table [dataSource]="chapitres" class="chapitres-table">
          <ng-container matColumnDef="ordre">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let ch">{{ ch.ordre }}</td>
          </ng-container>

          <ng-container matColumnDef="titre">
            <th mat-header-cell *matHeaderCellDef>Titre</th>
            <td mat-cell *matCellDef="let ch">{{ ch.titre }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let ch">
              <span class="type-badge" [class.document]="ch.typeContenu === 'DOCUMENT'" [class.video]="ch.typeContenu === 'VIDEO'" [class.exercice]="ch.typeContenu === 'EXERCICE'">
                {{ ch.typeContenu }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="duree">
            <th mat-header-cell *matHeaderCellDef>Durée</th>
            <td mat-cell *matCellDef="let ch">{{ ch.dureeMinutes }} min</td>
          </ng-container>

          <ng-container matColumnDef="contenu">
            <th mat-header-cell *matHeaderCellDef>Contenu</th>
            <td mat-cell *matCellDef="let ch">
              <span *ngIf="ch.contenuUrl" class="url-cell" [title]="ch.contenuUrl">
                <mat-icon>link</mat-icon> {{ ch.contenuUrl }}
              </span>
              <span *ngIf="!ch.contenuUrl" class="no-url">-</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let ch">
              <button mat-icon-button color="primary" (click)="modifier(ch)" matTooltip="Modifier">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="supprimer(ch)" matTooltip="Supprimer">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="colonnes"></tr>
          <tr mat-row *matRowDef="let row; columns: colonnes;"></tr>
        </table>
      </div>

      <mat-card *ngIf="edition" class="form-card">
        <mat-card-header>
          <mat-card-title>{{ chapitreForm.id ? 'Modifier' : 'Ajouter' }} un cours</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Titre du cours</mat-label>
              <input matInput [(ngModel)]="chapitreForm.titre" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Type de contenu</mat-label>
              <mat-select [(ngModel)]="chapitreForm.typeContenu">
                <mat-option value="DOCUMENT">PDF / Document</mat-option>
                <mat-option value="VIDEO">Vidéo</mat-option>
                <mat-option value="EXERCICE">Exercice</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Ordre</mat-label>
              <input matInput type="number" [(ngModel)]="chapitreForm.ordre" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Durée (minutes)</mat-label>
              <input matInput type="number" [(ngModel)]="chapitreForm.dureeMinutes" required>
            </mat-form-field>

            <div class="full-width upload-section" *ngIf="chapitreForm.typeContenu === 'DOCUMENT'">
              <div class="upload-area" (click)="fileInput.click()" [class.has-file]="fichierChoisi">
                <input #fileInput type="file" accept=".pdf" hidden (change)="uploaderFichier($event)">
                <mat-icon>{{ fichierChoisi ? 'description' : 'cloud_upload' }}</mat-icon>
                <span *ngIf="!fichierChoisi">Cliquez pour sélectionner un fichier PDF depuis votre bureau</span>
                <span *ngIf="fichierChoisi">{{ fichierChoisi.name }}</span>
                <mat-progress-bar *ngIf="uploadEnCours" mode="indeterminate" style="margin-top:8px"></mat-progress-bar>
              </div>
              <input matInput [(ngModel)]="chapitreForm.contenuUrl" placeholder="URL du fichier" *ngIf="chapitreForm.contenuUrl" class="url-result">
            </div>

            <mat-form-field appearance="outline" class="full-width" *ngIf="chapitreForm.typeContenu === 'VIDEO'">
              <mat-label>URL YouTube</mat-label>
              <input matInput [(ngModel)]="chapitreForm.videoUrl" placeholder="https://youtube.com/watch?v=...">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width" *ngIf="chapitreForm.typeContenu === 'EXERCICE'">
              <mat-label>URL du contenu</mat-label>
              <input matInput [(ngModel)]="chapitreForm.contenuUrl" placeholder="https://...">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="chapitreForm.description" rows="3"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="annuler()">Annuler</button>
          <button mat-raised-button color="primary" (click)="sauvegarder()" [disabled]="!chapitreForm.titre || !chapitreForm.ordre">
            <mat-icon>save</mat-icon> {{ chapitreForm.id ? 'Enregistrer' : 'Ajouter' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .gestion-container { padding: 20px; max-width: 1000px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header h1 { margin: 8px 0 4px; font-size: 24px; color: #1a237e; }
    .subtitle { color: #666; font-size: 14px; margin: 0; }
    .back-btn { margin-bottom: 8px; }
    .empty-card { text-align: center; padding: 40px; color: #888; }
    .table-wrapper { overflow-x: auto; }
    .chapitres-table { width: 100%; }
    .type-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; background: #e0e0e0; color: #555; }
    .type-badge.document { background: #e3f2fd; color: #1565c0; }
    .type-badge.video { background: #fce4ec; color: #c62828; }
    .type-badge.exercice { background: #e8f5e9; color: #2e7d32; }
    .url-cell { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #1565c0; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .url-cell mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .no-url { color: #bbb; }
    .form-card { max-width: 700px; margin: 0 auto; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .full-width { grid-column: 1 / -1; }
    mat-card-actions { padding: 16px; display: flex; justify-content: flex-end; gap: 8px; }
    .upload-section { margin-bottom: 8px; }
    .upload-area { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; border: 2px dashed #c5cae9; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: #888; }
    .upload-area:hover { border-color: #3f51b5; background: #f5f7ff; color: #3f51b5; }
    .upload-area.has-file { border-color: #4caf50; background: #f1f8e9; color: #2e7d32; }
    .upload-area mat-icon { font-size: 36px; width: 36px; height: 36px; }
    .url-result { margin-top: 8px; width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 13px; color: #555; }
  `]
})
export class GestionChapitresComponent implements OnInit {
  formationId = 0;
  formation: Formation | null = null;
  chapitres: Chapitre[] = [];
  colonnes = ['ordre', 'titre', 'type', 'duree', 'contenu', 'actions'];
  loading = true;
  edition = false;
  chapitreForm: Partial<Chapitre> = {};
  fichierChoisi: File | null = null;
  uploadEnCours = false;

  constructor(
    private route: ActivatedRoute,
    private catalogueService: CatalogueService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formationId = Number(this.route.snapshot.paramMap.get('id'));
    this.chargerFormation();
    this.chargerChapitres();
  }

  chargerFormation(): void {
    this.catalogueService.getFormationById(this.formationId).subscribe({
      next: (f) => { this.formation = f; },
      error: () => {}
    });
  }

  chargerChapitres(): void {
    this.loading = true;
    this.catalogueService.getChapitres(this.formationId).subscribe({
      next: (data) => {
        this.chapitres = data.sort((a, b) => a.ordre - b.ordre);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  ajouter(): void {
    this.fichierChoisi = null;
    this.chapitreForm = {
      titre: '',
      description: '',
      ordre: this.chapitres.length + 1,
      dureeMinutes: 30,
      typeContenu: 'DOCUMENT',
      contenuUrl: '',
      formation: { id: this.formationId }
    };
    this.edition = true;
  }

  modifier(ch: Chapitre): void {
    this.chapitreForm = { ...ch };
    this.edition = true;
  }

  annuler(): void {
    this.edition = false;
    this.chapitreForm = {};
    this.fichierChoisi = null;
  }

  uploaderFichier(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.name.endsWith('.pdf')) {
      this.snackBar.open('Veuillez sélectionner un fichier PDF', 'OK', { duration: 4000 });
      return;
    }
    this.fichierChoisi = file;
    this.uploadEnCours = true;
    this.catalogueService.uploadFichier(file).subscribe({
      next: (res) => {
        this.chapitreForm.contenuUrl = res.url;
        this.uploadEnCours = false;
        this.snackBar.open('Fichier PDF uploadé avec succès', 'OK', { duration: 3000 });
      },
      error: () => {
        this.uploadEnCours = false;
        this.fichierChoisi = null;
        this.snackBar.open('Erreur lors de l\'upload du fichier', 'OK', { duration: 5000 });
      }
    });
  }

  sauvegarder(): void {
    if (!this.chapitreForm.titre || !this.chapitreForm.ordre) return;

    const chapitre = {
      ...this.chapitreForm,
      formation: { id: this.formationId }
    } as Chapitre;

    if (chapitre.id) {
      this.catalogueService.mettreAJourChapitre(chapitre.id, chapitre).subscribe({
        next: () => {
          this.snackBar.open('Cours modifié avec succès', 'OK', { duration: 3000 });
          this.edition = false;
          this.chargerChapitres();
        },
        error: (err) => {
          this.snackBar.open(err.error?.error || 'Erreur lors de la modification', 'OK', { duration: 5000 });
        }
      });
    } else {
      this.catalogueService.creerChapitre(chapitre).subscribe({
        next: () => {
          this.snackBar.open('Cours ajouté avec succès', 'OK', { duration: 3000 });
          this.edition = false;
          this.chargerChapitres();
        },
        error: (err) => {
          this.snackBar.open(err.error?.error || 'Erreur lors de l\'ajout', 'OK', { duration: 5000 });
        }
      });
    }
  }

  supprimer(ch: Chapitre): void {
    if (confirm(`Supprimer le cours "${ch.titre}" ?`)) {
      this.catalogueService.supprimerChapitre(ch.id!).subscribe({
        next: () => {
          this.snackBar.open('Cours supprimé', 'OK', { duration: 3000 });
          this.chargerChapitres();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 5000 });
        }
      });
    }
  }
}
