import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormateurService } from '../../services/formateur.service';
import { Formateur } from '../../models/formateur.model';
import { FormateurDialogComponent } from './formateur-dialog.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-formateurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="formateurs-container">
      <div class="header">
        <h1>Gestion des Formateurs</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nouveau Formateur
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="formateurs" class="formateurs-table">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let formateur">{{ formateur.nom }}</td>
            </ng-container>

            <ng-container matColumnDef="prenom">
              <th mat-header-cell *matHeaderCellDef>Prénom</th>
              <td mat-cell *matCellDef="let formateur">{{ formateur.prenom }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let formateur">{{ formateur.email }}</td>
            </ng-container>

            <ng-container matColumnDef="tarif">
              <th mat-header-cell *matHeaderCellDef>Tarif Horaire</th>
              <td mat-cell *matCellDef="let formateur">{{ formateur.tarifHoraire }} €/h</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let formateur">
                <button mat-icon-button color="primary" (click)="voirExpertises(formateur.id!)">
                  <mat-icon>workspace_premium</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="modifier(formateur)">
                  <mat-icon>edit</mat-icon>
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
    .formateurs-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .formateurs-table {
      width: 100%;
    }
  `]
})
export class FormateursComponent implements OnInit {
  formateurs: Formateur[] = [];
  colonnes = ['nom', 'prenom', 'email', 'tarif', 'actions'];

  constructor(
    private auth: AuthService,
    private router: Router,
    private formateurService: FormateurService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.auth.isFormateur()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.chargerFormateurs();
  }

  chargerFormateurs(): void {
    this.formateurService.getFormateurs().subscribe(data => {
      this.formateurs = data;
    });
  }

  openDialog(): void {
    const ref = this.dialog.open(FormateurDialogComponent, { width: '550px' });
    ref.afterClosed().subscribe(r => { if (r) this.chargerFormateurs(); });
  }

  modifier(formateur: Formateur): void {
    const ref = this.dialog.open(FormateurDialogComponent, { width: '550px', data: formateur });
    ref.afterClosed().subscribe(r => { if (r) this.chargerFormateurs(); });
  }

  voirExpertises(formateurId: number): void {
    this.formateurService.getExpertises(formateurId).pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement des expertises', 'Fermer', { duration: 4000 });
        return of([]);
      })
    ).subscribe(expertises => {
      const msg = expertises.map(e => `- ${e.domaine} / ${e.specialite} (${e.niveau}) - ${e.anneesExperience}ans`).join('\n');
      alert(`Expertises du formateur :\n${msg}`);
    });
  }
}
