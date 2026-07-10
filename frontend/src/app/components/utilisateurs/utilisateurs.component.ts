import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Apprenant } from '../../models/apprenant.model';
import { ApprenantDialogComponent } from './apprenant-dialog.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="utilisateurs-container">
      <div class="header">
        <h1>Gestion des Apprenants</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nouvel Apprenant
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="apprenants" class="apprenants-table">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let apprenant">{{ apprenant.nom }}</td>
            </ng-container>

            <ng-container matColumnDef="prenom">
              <th mat-header-cell *matHeaderCellDef>Prénom</th>
              <td mat-cell *matCellDef="let apprenant">{{ apprenant.prenom }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let apprenant">{{ apprenant.email }}</td>
            </ng-container>

            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let apprenant">
                <span [class]="'statut-' + apprenant.statut.toLowerCase()">
                  {{ apprenant.statut }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let apprenant">
                <button mat-icon-button color="primary" (click)="voirCompetences(apprenant.id!)">
                  <mat-icon>emoji_events</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="modifier(apprenant)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="supprimer(apprenant.id!)">
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
    .utilisateurs-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .apprenants-table {
      width: 100%;
    }
    .statut-actif { color: green; font-weight: bold; }
    .statut-inactif { color: gray; }
    .statut-suspendu { color: orange; }
  `]
})
export class UtilisateursComponent implements OnInit {
  apprenants: Apprenant[] = [];
  colonnes = ['nom', 'prenom', 'email', 'statut', 'actions'];

  constructor(
    private auth: AuthService,
    private router: Router,
    private utilisateurService: UtilisateurService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.auth.isFormateur()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.chargerApprenants();
  }

  chargerApprenants(): void {
    this.utilisateurService.getApprenants().subscribe(data => {
      this.apprenants = data;
    });
  }

  openDialog(): void {
    const ref = this.dialog.open(ApprenantDialogComponent, { width: '550px' });
    ref.afterClosed().subscribe(r => { if (r) this.chargerApprenants(); });
  }

  modifier(apprenant: Apprenant): void {
    const ref = this.dialog.open(ApprenantDialogComponent, { width: '550px', data: apprenant });
    ref.afterClosed().subscribe(r => { if (r) this.chargerApprenants(); });
  }

  voirCompetences(apprenantId: number): void {
    this.utilisateurService.getCompetences(apprenantId).pipe(
      catchError(() => {
        this.snackBar.open('Erreur lors du chargement des compétences', 'Fermer', { duration: 4000 });
        return of([]);
      })
    ).subscribe(competences => {
      const msg = competences.map(c => `- ${c.nom} (${c.niveau})`).join('\n');
      alert(`Compétences de l'apprenant :\n${msg}`);
    });
  }

  supprimer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet apprenant ?')) {
      this.utilisateurService.supprimerApprenant(id).subscribe(() => {
        this.chargerApprenants();
      });
    }
  }
}
