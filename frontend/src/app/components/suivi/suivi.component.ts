import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { SuiviService } from '../../services/suivi.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CatalogueService } from '../../services/catalogue.service';
import { AuthService } from '../../services/auth.service';
import { Progression } from '../../models/suivi.model';
import { Apprenant } from '../../models/apprenant.model';
import { Formation, Chapitre } from '../../models/formation.model';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-suivi',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatProgressBarModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatChipsModule, MatDividerModule
  ],
  template: `
    <div class="suivi-container">
      <h1>Suivi Pédagogique</h1>

      <div class="filters">
        <mat-form-field appearance="outline" class="apprenant-select">
          <mat-label>Sélectionner un apprenant</mat-label>
          <mat-select [(ngModel)]="apprenantSelectionne" (selectionChange)="onApprenantChange()">
            <mat-option *ngFor="let a of apprenants" [value]="a">
              {{ a.prenom }} {{ a.nom }} ({{ a.email }})
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>

      <div *ngIf="!apprenantSelectionne && !loading" class="empty">
        <mat-icon class="empty-icon">groups</mat-icon>
        <h2>Sélectionnez un apprenant</h2>
        <p>Choisissez un apprenant pour voir son suivi pédagogique détaillé.</p>
      </div>

      <div *ngIf="apprenantSelectionne && !loading">
        <mat-card class="apprenant-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="avatar-icon">account_circle</mat-icon>
            <mat-card-title>{{ apprenantSelectionne.prenom }} {{ apprenantSelectionne.nom }}</mat-card-title>
            <mat-card-subtitle>{{ apprenantSelectionne.email }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stats">
              <div class="stat">
                <span class="stat-value">{{ stats.totalFormations }}</span>
                <span class="stat-label">Formations</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ stats.terminees }}</span>
                <span class="stat-label">Terminées</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ stats.enCours }}</span>
                <span class="stat-label">En cours</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ stats.progressionGlobale }}%</span>
                <span class="stat-label">Global</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="formations-list">
          <mat-card *ngFor="let f of formations" class="formation-card">
            <mat-card-header>
              <mat-card-title>{{ f.titre }}</mat-card-title>
              <mat-card-subtitle>{{ f.niveau }} · {{ f.dureeHeures }}h</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="formation-progress">
                <div class="progress-header">
                  <span>Progression</span>
                  <span class="progress-pct">{{ getProgressionFormation(f.id!) }}%</span>
                </div>
                <mat-progress-bar
                  [value]="getProgressionFormation(f.id!)"
                  [color]="getProgressionFormation(f.id!) >= 100 ? 'accent' : 'primary'">
                </mat-progress-bar>
              </div>

              <mat-divider class="section-divider"></mat-divider>

              <div class="chapitres-list">
                <div class="chapitre-title">Cours</div>
                <div *ngFor="let ch of getChapitres(f.id!)" class="chapitre-row"
                     [class.termine]="estChapitreTermine(f.id!, ch.id!)">
                  <mat-icon class="ch-icon">
                    {{ estChapitreTermine(f.id!, ch.id!) ? 'check_circle' : 'radio_button_unchecked' }}
                  </mat-icon>
                  <span class="ch-nom">{{ ch.titre }}</span>
                  <span class="ch-pct">{{ getChapitrePct(f.id!, ch.id!) }}%</span>
                  <mat-progress-bar class="ch-bar"
                    [value]="getChapitrePct(f.id!, ch.id!)"
                    [color]="getChapitrePct(f.id!, ch.id!) >= 100 ? 'accent' : 'primary'">
                  </mat-progress-bar>
                </div>
              </div>

              <mat-divider class="section-divider"></mat-divider>

              <div class="formation-footer">
                <span class="chapitre-count">{{ getChapitresTermines(f.id!) }}/{{ getChapitres(f.id!).length }} cours terminés</span>
                <mat-chip [color]="getProgressionFormation(f.id!) >= 100 ? 'accent' : 'primary'" selected>
                  {{ getProgressionFormation(f.id!) >= 100 ? 'Terminée' : 'En cours' }}
                </mat-chip>
              </div>
            </mat-card-content>
          </mat-card>

          <div *ngIf="formations.length === 0" class="empty-section">
            Aucune formation choisie par cet apprenant.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suivi-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
    h1 { margin-bottom: 24px; color: #1a237e; }
    .filters { margin-bottom: 24px; }
    .apprenant-select { width: 100%; max-width: 500px; }
    .loading { margin-bottom: 16px; }
    .empty { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 72px; width: 72px; height: 72px; color: #c5cae9; margin-bottom: 16px; }
    .empty h2 { color: #333; }
    .empty p { color: #888; }
    .apprenant-card { margin-bottom: 24px; }
    .avatar-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }
    .stats { display: flex; gap: 24px; justify-content: space-around; padding: 16px 0; }
    .stat { text-align: center; }
    .stat-value { display: block; font-size: 28px; font-weight: bold; color: #3f51b5; }
    .stat-label { font-size: 12px; color: #888; text-transform: uppercase; }
    .formations-list { display: flex; flex-direction: column; gap: 16px; }
    .formation-card { border-left: 4px solid #3f51b5; }
    .formation-progress { margin: 16px 0; }
    .progress-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .progress-pct { font-weight: 600; color: #3f51b5; }
    .section-divider { margin: 16px 0; }
    .chapitres-list { display: flex; flex-direction: column; gap: 8px; }
    .chapitre-title { font-weight: 600; color: #555; font-size: 13px; text-transform: uppercase; margin-bottom: 4px; }
    .chapitre-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
    .chapitre-row.termine { opacity: 0.6; }
    .ch-icon { font-size: 18px; width: 18px; height: 18px; color: #c5cae9; }
    .chapitre-row.termine .ch-icon { color: #4caf50; }
    .ch-nom { flex: 1; font-size: 14px; color: #333; }
    .ch-pct { font-size: 12px; color: #888; min-width: 30px; text-align: right; }
    .ch-bar { width: 100px; height: 6px !important; border-radius: 3px; }
    .formation-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .chapitre-count { font-size: 13px; color: #888; }
    .empty-section { text-align: center; padding: 40px; color: #888; }
  `]
})
export class SuiviComponent implements OnInit {
  apprenants: Apprenant[] = [];
  apprenantSelectionne: Apprenant | null = null;
  formations: Formation[] = [];
  chapitresParFormation = new Map<number, Chapitre[]>();
  progressions: Progression[] = [];
  stats = { totalFormations: 0, terminees: 0, enCours: 0, progressionGlobale: 0 };
  loading = false;

  constructor(
    private suiviService: SuiviService,
    private utilisateurService: UtilisateurService,
    private catalogueService: CatalogueService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.utilisateurService.getApprenants().subscribe(data => {
      this.apprenants = data.filter(a => a.statut === 'ACTIF');
    });
  }

  onApprenantChange(): void {
    if (!this.apprenantSelectionne?.id) return;
    this.loading = true;
    this.formations = [];
    this.chapitresParFormation.clear();
    this.progressions = [];

    this.authService.getFormationsChoisies(this.apprenantSelectionne.id).subscribe(ids => {
      if (ids.length === 0) { this.loading = false; return; }
      this.catalogueService.getFormations().subscribe(all => {
        this.formations = all.filter(f => f.id && ids.includes(f.id));
        const chapitreCalls = this.formations.filter(f => f.id).map(f =>
          this.catalogueService.getChapitres(f.id!).pipe(
            map(cs => ({ formationId: f.id!, chapitres: cs.sort((a, b) => a.ordre - b.ordre) })),
            catchError(() => of({ formationId: f.id!, chapitres: [] })))
        );
        forkJoin(chapitreCalls).subscribe(chResults => {
          chResults.forEach(r => this.chapitresParFormation.set(r.formationId, r.chapitres));
          this.suiviService.getProgressions(this.apprenantSelectionne!.id!).subscribe({
            next: (progs) => {
              this.progressions = progs;
              this.calculerStats();
              this.loading = false;
            },
            error: () => this.loading = false
          });
        });
      });
    });
  }

  getChapitres(formationId: number): Chapitre[] {
    return this.chapitresParFormation.get(formationId) || [];
  }

  getProgressionFormation(formationId: number): number {
    const chapitres = this.getChapitres(formationId);
    if (chapitres.length === 0) return 0;
    const termines = chapitres.filter(c => this.estChapitreTermine(formationId, c.id!)).length;
    return Math.round((termines / chapitres.length) * 100);
  }

  getChapitrePct(formationId: number, chapitreId: number): number {
    const prog = this.progressions.find(p => p.formationId === formationId && p.chapitreId === chapitreId);
    return prog?.pourcentage || 0;
  }

  estChapitreTermine(formationId: number, chapitreId: number): boolean {
    return this.getChapitrePct(formationId, chapitreId) >= 100;
  }

  getChapitresTermines(formationId: number): number {
    return this.getChapitres(formationId).filter(c => this.estChapitreTermine(formationId, c.id!)).length;
  }

  calculerStats(): void {
    const total = this.formations.length;
    const terminees = this.formations.filter(f => this.getProgressionFormation(f.id!) === 100).length;
    const totalPct = this.formations.reduce((s, f) => s + this.getProgressionFormation(f.id!), 0);
    this.stats = {
      totalFormations: total,
      terminees,
      enCours: total - terminees,
      progressionGlobale: total > 0 ? Math.round(totalPct / total) : 0
    };
  }
}
