import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../services/auth.service';
import { CatalogueService } from '../../services/catalogue.service';
import { NotificationService } from '../../services/notification.service';
import { Formation } from '../../models/formation.model';

@Component({
  selector: 'app-choix-formations',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatProgressBarModule
  ],
  template: `
    <div class="choix-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-icon class="header-icon">school</mat-icon>
          <mat-card-title>Bienvenue {{ prenom }} !</mat-card-title>
          <mat-card-subtitle>Choisissez les formations que vous souhaitez suivre</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Sélectionnez une ou plusieurs formations pour commencer votre parcours d'apprentissage.</p>
        </mat-card-content>
      </mat-card>

      <div *ngIf="loading" class="loading-bar">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>

      <div class="formations-grid">
        <mat-card *ngFor="let f of formations"
          class="formation-card"
          [class.selected]="selection.has(f.id!)"
          (click)="toggle(f.id!)">
          <mat-card-header>
            <mat-checkbox [checked]="selection.has(f.id!)" (click)="$event.stopPropagation(); toggle(f.id!)"></mat-checkbox>
            <mat-card-title>{{ f.titre }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ f.description }}</p>
            <div class="tags">
              <span class="tag">{{ f.niveau }}</span>
              <span class="tag">{{ f.dureeHeures }}h</span>
              <span class="tag">{{ f.categorie?.nom }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="formations.length === 0 && !loading" class="empty-msg">
        Aucune formation disponible pour le moment.
      </div>

      <div class="actions">
        <button mat-raised-button color="primary" (click)="valider()" [disabled]="selection.size === 0 || saving">
          <mat-icon>check</mat-icon>
          Valider mes choix ({{ selection.size }})
        </button>
      </div>

      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
    </div>
  `,
  styles: [`
    .choix-container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
    .header-card { margin-bottom: 24px; text-align: center; }
    .header-icon { font-size: 48px; width: 48px; height: 48px; color: #3f51b5; }
    .loading-bar { margin-bottom: 16px; }
    .formations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .formation-card { cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
    .formation-card:hover { border-color: #3f51b5; box-shadow: 0 4px 12px rgba(63,81,181,0.15); }
    .formation-card.selected { border-color: #3f51b5; background: #f5f7ff; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .tag { padding: 4px 10px; background: #e8eaf6; border-radius: 12px; font-size: 12px; color: #3f51b5; }
    .empty-msg { text-align: center; padding: 40px; color: #888; }
    .actions { text-align: center; margin-bottom: 40px; }
    .error { padding: 12px; background: #fce4ec; color: #c62828; border-radius: 4px; text-align: center; }
  `]
})
export class ChoixFormationsComponent implements OnInit {
  formations: Formation[] = [];
  selection = new Set<number>();
  loading = false;
  saving = false;
  errorMsg = '';
  prenom = '';

  constructor(
    private auth: AuthService,
    private catalogue: CatalogueService,
    private notification: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.prenom = this.auth.getCurrentUser()?.prenom || '';
    this.loading = true;
    const user = this.auth.getCurrentUser();
    if (user?.email) {
      this.auth.getApprenantByEmail(user.email).subscribe({
        next: (apprenant) => {
          this.auth.getFormationsChoisies(apprenant.id!).subscribe({
            next: (ids) => {
              if (ids.length > 0) {
                this.router.navigate(['/mes-formations']);
                return;
              }
              this.chargerFormations();
            },
            error: () => this.chargerFormations()
          });
        },
        error: () => this.chargerFormations()
      });
    } else {
      this.chargerFormations();
    }
  }

  private chargerFormations(): void {
    this.catalogue.getFormations().subscribe({
      next: (data) => { this.formations = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  private notifierFormationsSansCours(formationIds: number[], apprenant: any): void {
    formationIds.forEach(fid => {
      this.catalogue.getChapitres(fid).subscribe({
        next: (chapitres) => {
          if (!chapitres || chapitres.length === 0) {
            const formation = this.formations.find(f => f.id === fid);
            const titre = formation?.titre || '#' + fid;
            this.notification.creer({
              message: `${apprenant.prenom} ${apprenant.nom} a choisi la formation "${titre}" qui n'a pas encore de cours`,
              type: 'FORMATION_SANS_COURS',
              lue: false
            }).subscribe();
          }
        },
        error: () => {}
      });
    });
  }

  toggle(id: number): void {
    if (this.selection.has(id)) this.selection.delete(id);
    else this.selection.add(id);
  }

  valider(): void {
    const user = this.auth.getCurrentUser();
    if (!user?.email || this.selection.size === 0) return;
    this.saving = true;
    this.errorMsg = '';

    this.auth.getApprenantByEmail(user.email).subscribe({
      next: (apprenant) => {
        const ids = Array.from(this.selection);
        this.auth.sauvegarderFormationsChoisies(apprenant.id!, ids).subscribe({
          next: () => {
            this.saving = false;
            this.notifierFormationsSansCours(ids, apprenant);
            this.router.navigate(['/mes-formations']);
          },
          error: (err) => {
            this.errorMsg = err.error?.error || err.message || 'Erreur';
            this.saving = false;
          }
        });
      },
      error: () => {
        this.errorMsg = 'Apprenant non trouvé. Contactez l\'administrateur.';
        this.saving = false;
      }
    });
  }
}
