import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CatalogueService } from '../../services/catalogue.service';
import { Formation } from '../../models/formation.model';
import { FormationDialogComponent } from './formation-dialog.component';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormationDialogComponent
  ],
  template: `
    <div class="catalogue-container">
      <div class="header">
        <h1>Catalogue des Formations</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nouvelle Formation
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher</mat-label>
            <input matInput [(ngModel)]="motCle" (keyup)="rechercher()">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="formations" class="formations-table">
            <ng-container matColumnDef="titre">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let formation">
                <a class="titre-lien" [routerLink]="['/catalogue', formation.id, 'chapitres']" matTooltip="Gérer les cours de cette formation">
                  {{ formation.titre }}
                </a>
              </td>
            </ng-container>

            <ng-container matColumnDef="categorie">
              <th mat-header-cell *matHeaderCellDef>Catégorie</th>
              <td mat-cell *matCellDef="let formation">{{ formation.categorie?.nom }}</td>
            </ng-container>

            <ng-container matColumnDef="niveau">
              <th mat-header-cell *matHeaderCellDef>Niveau</th>
              <td mat-cell *matCellDef="let formation">{{ formation.niveau }}</td>
            </ng-container>

            <ng-container matColumnDef="duree">
              <th mat-header-cell *matHeaderCellDef>Durée</th>
              <td mat-cell *matCellDef="let formation">{{ formation.dureeHeures }}h</td>
            </ng-container>

            <ng-container matColumnDef="tarif">
              <th mat-header-cell *matHeaderCellDef>Tarif</th>
              <td mat-cell *matCellDef="let formation">{{ formation.tarif }} €</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let formation">
                <button mat-icon-button color="primary" (click)="modifier(formation)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="supprimer(formation.id!)">
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
    .catalogue-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .formations-table {
      width: 100%;
    }
    .titre-lien {
      color: #1a237e;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
    }
    .titre-lien:hover {
      color: #3f51b5;
      text-decoration: underline;
    }
  `]
})
export class CatalogueComponent implements OnInit {
  formations: Formation[] = [];
  motCle = '';
  colonnes = ['titre', 'categorie', 'niveau', 'duree', 'tarif', 'actions'];

  constructor(private catalogueService: CatalogueService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.chargerFormations();
  }

  chargerFormations(): void {
    this.catalogueService.getFormations().subscribe(data => {
      this.formations = data;
    });
  }

  rechercher(): void {
    if (this.motCle) {
      this.catalogueService.rechercherFormations(this.motCle).subscribe(data => {
        this.formations = data;
      });
    } else {
      this.chargerFormations();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormationDialogComponent);
    dialogRef.afterClosed().subscribe((result: boolean | undefined) => { if (result) this.chargerFormations(); });
  }

  modifier(formation: Formation): void {
    const dialogRef = this.dialog.open(FormationDialogComponent, { data: formation });
    dialogRef.afterClosed().subscribe((result: boolean | undefined) => { if (result) this.chargerFormations(); });
  }

  supprimer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.catalogueService.supprimerFormation(id).subscribe(() => {
        this.chargerFormations();
      });
    }
  }
}
