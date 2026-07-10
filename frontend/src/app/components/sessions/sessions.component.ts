import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from '../../services/session.service';
import { SessionFormation, Inscription } from '../../models/session.model';
import { Formation } from '../../models/formation.model';
import { CatalogueService } from '../../services/catalogue.service';
import { SessionDialogComponent } from './session-dialog.component';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule,
    MatDialogModule, MatChipsModule, MatTooltipModule, SessionDialogComponent
  ],
  template: `
    <div class="sessions-container">
      <div class="header">
        <h1>Sessions de Formation</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nouvelle Session
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="sessions" class="sessions-table">
            <ng-container matColumnDef="formations">
              <th mat-header-cell *matHeaderCellDef>Formations</th>
              <td mat-cell *matCellDef="let session">
                <div class="formations-cell">
                  <span *ngFor="let fid of session.formationIds" class="formation-tag">
                    {{ getFormationTitre(fid) || '#' + fid }}
                  </span>
                  <span *ngIf="!session.formationIds?.length" class="no-formations">-</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="totalHeures">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let session">
                <span class="heure-badge">{{ calculerTotalHeures(session) }}h</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="dateDebut">
              <th mat-header-cell *matHeaderCellDef>Date Début</th>
              <td mat-cell *matCellDef="let session">{{ session.dateDebut }}</td>
            </ng-container>

            <ng-container matColumnDef="dateFin">
              <th mat-header-cell *matHeaderCellDef>Date Fin</th>
              <td mat-cell *matCellDef="let session">{{ session.dateFin }}</td>
            </ng-container>

            <ng-container matColumnDef="participants">
              <th mat-header-cell *matHeaderCellDef>Participants</th>
              <td mat-cell *matCellDef="let session">
                {{ session.participantsActuels }}/{{ session.capaciteMax }}
              </td>
            </ng-container>

            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let session">
                <span [class]="'statut-' + (session.statut || '').toLowerCase()">
                  {{ session.statut }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let session">
                <button mat-icon-button color="primary" (click)="voirInscriptions(session.id!)" matTooltip="Voir les inscriptions">
                  <mat-icon>people</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="modifier(session)" matTooltip="Modifier">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="supprimer(session)" matTooltip="Supprimer">
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
    .sessions-container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .sessions-table { width: 100%; }
    .formations-cell { display: flex; flex-wrap: wrap; gap: 4px; }
    .formation-tag { display: inline-block; padding: 2px 8px; background: #e8eaf6; color: #1a237e; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .no-formations { color: #bbb; }
    .heure-badge { font-weight: 600; color: #3f51b5; font-size: 14px; }
    .statut-a_planifier { color: gray; font-weight: 500; }
    .statut-planifiee { color: blue; font-weight: 500; }
    .statut-en_cours { color: green; font-weight: 500; }
    .statut-terminee { color: purple; font-weight: 500; }
    .statut-annulee { color: red; font-weight: 500; }
  `]
})
export class SessionsComponent implements OnInit {
  sessions: SessionFormation[] = [];
  formationsMap = new Map<number, Formation>();
  colonnes = ['formations', 'totalHeures', 'dateDebut', 'dateFin', 'participants', 'statut', 'actions'];

  constructor(
    private sessionService: SessionService,
    private catalogue: CatalogueService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.chargerFormations();
    this.chargerSessions();
  }

  chargerFormations(): void {
    this.catalogue.getFormations().subscribe(fs => {
      fs.forEach(f => { if (f.id) this.formationsMap.set(f.id, f); });
    });
  }

  chargerSessions(): void {
    this.sessionService.getSessions().subscribe(data => {
      this.sessions = data;
    });
  }

  getFormationTitre(id: number): string {
    return this.formationsMap.get(id)?.titre || '';
  }

  calculerTotalHeures(session: SessionFormation): number {
    return (session.formationIds || []).reduce((sum, fid) => {
      return sum + (this.formationsMap.get(fid)?.dureeHeures || 0);
    }, 0);
  }

  openDialog(): void {
    const ref = this.dialog.open(SessionDialogComponent, { width: '650px' });
    ref.afterClosed().subscribe(r => { if (r) this.chargerSessions(); });
  }

  modifier(session: SessionFormation): void {
    const ref = this.dialog.open(SessionDialogComponent, { width: '650px', data: session });
    ref.afterClosed().subscribe(r => { if (r) this.chargerSessions(); });
  }

  supprimer(session: SessionFormation): void {
    if (!confirm(`Supprimer la session #${session.id} ?`)) return;
    this.sessionService.supprimerSession(session.id!).subscribe({
      next: () => this.chargerSessions(),
      error: (err) => alert('Erreur lors de la suppression : ' + (err.error?.message || err.message))
    });
  }

  voirInscriptions(sessionId: number): void {
    this.sessionService.getInscriptions(sessionId).subscribe((inscriptions: Inscription[]) => {
      const msg = inscriptions.map(i => `- Apprenant #${i.apprenantId}: ${i.statut} (${i.dateInscription})`).join('\n');
      alert(`Inscriptions de la session #${sessionId} :\n${msg || 'Aucune inscription'}`);
    });
  }
}
