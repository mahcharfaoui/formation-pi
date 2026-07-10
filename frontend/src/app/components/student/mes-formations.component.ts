import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { CatalogueService } from '../../services/catalogue.service';
import { SuiviService } from '../../services/suivi.service';
import { QuizService } from '../../services/quiz.service';
import { SessionService } from '../../services/session.service';
import { CertificationService } from '../../services/certification.service';
import { Formation, Chapitre } from '../../models/formation.model';
import { Quiz } from '../../models/quiz.model';
import { SessionFormation, Inscription } from '../../models/session.model';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-mes-formations',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule,
    MatExpansionModule, MatProgressBarModule, MatDividerModule, MatTabsModule,
    MatChipsModule, MatDialogModule, MatSnackBarModule
  ],
  template: `
    <div class="dashboard">
      <div class="header">
        <div>
          <h1>Bonjour, {{ prenom }} !</h1>
          <p class="subtitle">Bienvenue sur votre espace d'apprentissage</p>
        </div>
        <div class="stats" *ngIf="stats.total > 0">
          <span class="stat"><strong>{{ stats.terminees }}</strong> terminées</span>
          <span class="stat"><strong>{{ stats.enCours }}</strong> en cours</span>
          <span class="stat"><strong>{{ stats.progression }}%</strong> global</span>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><mat-progress-bar mode="indeterminate"></mat-progress-bar></div>

      <div *ngIf="formations.length === 0 && !loading" class="empty">
        <mat-icon class="empty-icon">school</mat-icon>
        <h2>Bienvenue sur la plateforme !</h2>
        <p>Commencez par choisir les formations qui vous intéressent.</p>
        <button mat-raised-button color="primary" routerLink="/choix-formations">
          <mat-icon>add</mat-icon> Choisir mes formations
        </button>
      </div>

      <div *ngIf="formations.length > 0 && !loading">
        <mat-tab-group dynamicHeight>
          <mat-tab label="Mes Formations">
            <mat-accordion class="formations-list" multi>
              <mat-expansion-panel *ngFor="let f of formations" class="formation-panel" [expanded]="true">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>school</mat-icon> {{ f.titre }}
                  </mat-panel-title>
                  <mat-panel-description>
                    <span class="panel-info">{{ f.niveau }} · {{ f.dureeHeures }}h</span>
                    <span class="progression-label">{{ getProgression(f.id!) }}%</span>
                  </mat-panel-description>
                </mat-expansion-panel-header>

                <mat-progress-bar mode="determinate" [value]="getProgression(f.id!)" class="progression-bar"></mat-progress-bar>

                <div class="chapitres">
                  <div *ngFor="let ch of getChapitres(f.id!)" class="chapitre-item" [class.termine]="estTermine(f.id!, ch.id!)">
                    <div class="chapitre-info">
                      <mat-icon class="chapitre-icon">{{ estTermine(f.id!, ch.id!) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                      <div>
                        <div class="chapitre-titre">{{ ch.titre }}</div>
                        <div class="chapitre-meta">{{ ch.dureeMinutes }} min · {{ ch.typeContenu }}</div>
                      </div>
                    </div>
                    <button mat-stroked-button color="primary" (click)="lireChapitre(f, ch)" *ngIf="!estTermine(f.id!, ch.id!)">
                      <mat-icon>menu_book</mat-icon> Lire
                    </button>
                    <button mat-stroked-button disabled *ngIf="estTermine(f.id!, ch.id!)">
                      <mat-icon>check</mat-icon> Terminé
                    </button>
                  </div>
                  <div *ngIf="(!chapitresParFormation.get(f.id!) || chapitresParFormation.get(f.id!)!.length === 0)" class="no-chapitres">
                    Aucun contenu disponible pour cette formation.
                  </div>
                </div>

                <mat-action-row>
                  <span class="progression-text">Progression : {{ getProgression(f.id!) }}%</span>
                </mat-action-row>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-tab>

          <mat-tab label="Quiz" [disabled]="quizList.length === 0">
            <div class="tab-content">
              <h2>Quiz disponibles</h2>
              <div class="quiz-grid">
                <mat-card *ngFor="let q of quizList" class="quiz-card">
                  <mat-card-header>
                    <mat-card-title>{{ q.titre }}</mat-card-title>
                    <mat-card-subtitle>{{ q.dureeMinutes }} min · Score min : {{ q.scoreMinimum }}%</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ q.description }}</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="passerQuiz(q)">
                      <mat-icon>play_arrow</mat-icon> Passer le quiz
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
              <div *ngIf="quizList.length === 0" class="empty-section">Aucun quiz disponible pour vos formations.</div>
            </div>
          </mat-tab>

          <mat-tab label="Recommandations">
            <div class="tab-content">
              <h2>Prochaines étapes</h2>
              <div *ngIf="recommandationsChapitres.length === 0" class="empty-section">
                Tous les chapitres sont terminés ! Bon travail.
              </div>
              <div class="next-chapters" *ngIf="recommandationsChapitres.length > 0">
                <div class="next-chapter-card" *ngFor="let rec of recommandationsChapitres">
                  <div class="next-chapter-icon"><mat-icon>play_circle</mat-icon></div>
                  <div class="next-chapter-content">
                    <div class="next-chapter-formation">{{ rec.formation.titre }}</div>
                    <div class="next-chapter-title">{{ rec.chapitre.titre }}</div>
                    <div class="next-chapter-meta">{{ rec.chapitre.dureeMinutes }} min · {{ rec.chapitre.typeContenu }}</div>
                  </div>
                  <button mat-stroked-button color="primary" (click)="lireChapitre(rec.formation, rec.chapitre)">
                    <mat-icon>menu_book</mat-icon> Lire
                  </button>
                </div>
              </div>

              <mat-divider class="section-divider"></mat-divider>

              <h2>Emploi du temps</h2>
              <div *ngIf="emploiDuTemps.length === 0" class="empty-section">
                Aucune session planifiée pour vos formations.
              </div>
              <div class="timetable" *ngIf="emploiDuTemps.length > 0">
                <div class="session-card" *ngFor="let item of emploiDuTemps"
                     [class.passee]="estPassee(item.session)"
                     [class.en-cours-session]="estEnCoursSession(item.session)">
                  <div class="session-date">
                    <div class="session-date-day">{{ item.session.dateDebut | date:'dd' }}</div>
                    <div class="session-date-month">{{ item.session.dateDebut | date:'MMM' }}</div>
                  </div>
                  <div class="session-content">
                    <div class="session-formations">{{ item.formations }}</div>
                    <div class="session-detail">
                      <span><mat-icon>schedule</mat-icon> {{ item.session.dateDebut | date:'shortDate' }} - {{ item.session.dateFin | date:'shortDate' }}</span>
                      <span><mat-icon>{{ item.session.enLigne ? 'videocam' : 'location_on' }}</mat-icon> {{ item.session.enLigne ? 'En ligne' : item.session.lieu }}</span>
                    </div>
                    <span class="session-statut" [class]="item.session.statut">{{ item.session.statut }}</span>
                  </div>
                  <div class="session-action">
                    <button mat-raised-button color="primary" (click)="inscrireSession(item.session)"
                            *ngIf="!estInscrite(item.session.id!) && item.session.statut !== 'TERMINEE' && item.session.statut !== 'ANNULEE'">
                      <mat-icon>assignment</mat-icon> S'inscrire
                    </button>
                    <button mat-raised-button disabled *ngIf="estInscrite(item.session.id!)">
                      <mat-icon>check</mat-icon> Inscrit
                    </button>
                  </div>
                </div>
              </div>

              <mat-divider class="section-divider"></mat-divider>

              <h2>Formations similaires</h2>
              <div *ngIf="formationsSimilaires.length === 0" class="empty-section">
                Explorez d'autres formations dans le catalogue.
              </div>
              <div class="similaires-grid" *ngIf="formationsSimilaires.length > 0">
                <mat-card *ngFor="let f of formationsSimilaires" class="similaire-card">
                  <mat-card-header>
                    <mat-card-title>{{ f.titre }}</mat-card-title>
                    <mat-card-subtitle>{{ f.niveau }} · {{ f.dureeHeures }}h</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ (f.description || '').slice(0, 100) }}...</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-stroked-button color="accent" routerLink="/choix-formations">
                      <mat-icon>add</mat-icon> Ajouter
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>

              <mat-divider class="section-divider"></mat-divider>

              <div class="ml-link">
                <button mat-raised-button color="accent" routerLink="/recommandations">
                  <mat-icon>smart_toy</mat-icon> Recommandations intelligentes (ML)
                </button>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Certificats">
            <div class="tab-content">
              <h2>Mes Certificats</h2>
              <button mat-raised-button color="primary" routerLink="/certifications">
                <mat-icon>verified</mat-icon> Voir mes certificats
              </button>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>

    <div *ngIf="chapitreEnLecture" class="lecture-overlay" (click)="fermerLecture()">
      <div class="lecture-panel" (click)="$event.stopPropagation()">
        <div class="lecture-header">
          <h3>{{ chapitreEnLecture.titre }}</h3>
          <button mat-icon-button (click)="fermerLecture()"><mat-icon>close</mat-icon></button>
        </div>
        <div class="lecture-body">
          <p>{{ chapitreEnLecture.description || 'Aucun contenu disponible pour ce chapitre.' }}</p>
          <p *ngIf="chapitreEnLecture.contenuUrl" class="contenu-link">
            <a [href]="chapitreEnLecture.contenuUrl" target="_blank">Ouvrir le contenu externe</a>
          </p>
        </div>
        <div class="lecture-actions">
          <button mat-raised-button color="primary" (click)="marquerTermine()">
            <mat-icon>check_circle</mat-icon> Marquer comme terminé
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 24px; max-width: 1000px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .header h1 { margin: 0; font-size: 26px; color: #1a237e; }
    .subtitle { color: #666; margin-top: 4px; }
    .stats { display: flex; gap: 20px; background: #f5f7ff; padding: 12px 20px; border-radius: 10px; }
    .stat { font-size: 13px; color: #555; }
    .stat strong { color: #3f51b5; font-size: 15px; }
    .loading { margin-bottom: 16px; }
    .empty { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 72px; width: 72px; height: 72px; color: #c5cae9; margin-bottom: 16px; }
    .empty h2 { color: #333; }
    .empty p { color: #888; margin-bottom: 24px; }
    .formations-list { margin-top: 16px; }
    .formation-panel { margin-bottom: 12px; border-radius: 8px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important; }
    .panel-info { font-size: 12px; color: #888; }
    .progression-label { font-weight: 600; color: #3f51b5; margin-left: 12px; }
    .progression-bar { margin: 0 0 16px 0; border-radius: 4px; }
    .chapitres { display: flex; flex-direction: column; gap: 8px; }
    .chapitre-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8f9ff; border-radius: 8px; transition: background 0.2s; }
    .chapitre-item:hover { background: #eef0ff; }
    .chapitre-item.termine { opacity: 0.6; background: #f0faf0; }
    .chapitre-info { display: flex; align-items: center; gap: 12px; }
    .chapitre-icon { color: #c5cae9; font-size: 20px; width: 20px; height: 20px; }
    .chapitre-item.termine .chapitre-icon { color: #4caf50; }
    .chapitre-titre { font-weight: 500; color: #333; }
    .chapitre-meta { font-size: 12px; color: #888; margin-top: 2px; }
    .no-chapitres { padding: 20px; text-align: center; color: #999; }
    .progression-text { color: #3f51b5; font-weight: 500; }
    .tab-content { padding: 24px 0; }
    .tab-content h2 { margin-bottom: 16px; color: #333; }
    .quiz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .quiz-card { transition: box-shadow 0.2s; }
    .quiz-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .empty-section { text-align: center; padding: 40px; color: #888; }
    .lecture-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; align-items: center; justify-content: center; }
    .lecture-panel { background: #fff; border-radius: 12px; width: 90%; max-width: 700px; max-height: 80vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
    .lecture-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #eee; }
    .lecture-header h3 { margin: 0; font-size: 18px; color: #1a237e; }
    .lecture-body { padding: 24px; line-height: 1.6; color: #444; }
    .contenu-link { margin-top: 16px; }
    .lecture-actions { padding: 16px 24px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; }
    .section-divider { margin: 32px 0; }
    .next-chapters { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
    .next-chapter-card { display: flex; align-items: center; gap: 16px; padding: 14px 18px; background: #f0f4ff; border-radius: 10px; border-left: 4px solid #3f51b5; }
    .next-chapter-icon { color: #3f51b5; }
    .next-chapter-content { flex: 1; }
    .next-chapter-formation { font-size: 12px; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .next-chapter-title { font-weight: 600; color: #333; font-size: 15px; }
    .next-chapter-meta { font-size: 12px; color: #888; margin-top: 2px; }
    .timetable { display: flex; flex-direction: column; gap: 12px; }
    .session-card { display: flex; align-items: center; gap: 16px; padding: 14px 18px; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid #3f51b5; }
    .session-card.passee { opacity: 0.5; border-left-color: #999; }
    .session-card.en-cours-session { border-left-color: #4caf50; background: #f0faf0; }
    .session-date { text-align: center; min-width: 50px; }
    .session-date-day { font-size: 22px; font-weight: bold; color: #1a237e; line-height: 1; }
    .session-date-month { font-size: 11px; color: #666; text-transform: uppercase; }
    .session-content { flex: 1; }
    .session-formations { font-weight: 600; color: #333; margin-bottom: 4px; }
    .session-detail { display: flex; gap: 16px; font-size: 12px; color: #666; }
    .session-detail mat-icon { font-size: 14px; width: 14px; height: 14px; vertical-align: middle; margin-right: 2px; }
    .session-statut { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; background: #e8eaf6; color: #3f51b5; display: inline-block; margin-top: 4px; }
    .session-statut.EN_COURS { background: #e8f5e9; color: #2e7d32; }
    .session-statut.TERMINEE { background: #f5f5f5; color: #999; }
    .session-statut.PLANIFIEE { background: #e3f2fd; color: #1565c0; }
    .session-statut.ANNULEE { background: #fce4ec; color: #c62828; }
    .session-action { flex-shrink: 0; }
    .similaires-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-bottom: 16px; }
    .similaire-card { transition: box-shadow 0.2s; }
    .similaire-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .ml-link { text-align: center; margin-top: 16px; }
    ::ng-deep .snackbar-success { background: #1a237e; color: #fff; font-weight: 500; }
    ::ng-deep .snackbar-success .mat-simple-snackbar-action { color: #ffd54f; }
  `]
})
export class MesFormationsComponent implements OnInit {
  formations: Formation[] = [];
  chapitresParFormation = new Map<number, Chapitre[]>();
  progressions = new Map<string, number>();
  quizList: Quiz[] = [];
  loading = true;
  prenom = '';
  apprenantId = 0;

  chapitreEnLecture: Chapitre | null = null;
  formationEnLecture: Formation | null = null;

  stats = { total: 0, terminees: 0, enCours: 0, progression: 0 };

  sessions: SessionFormation[] = [];
  inscriptions: Inscription[] = [];
  emploiDuTemps: { session: SessionFormation; formations: string }[] = [];
  recommandationsChapitres: { formation: Formation; chapitre: Chapitre }[] = [];
  formationsSimilaires: Formation[] = [];

  constructor(
    private auth: AuthService,
    private catalogue: CatalogueService,
    private suivi: SuiviService,
    private quizService: QuizService,
    private sessionService: SessionService,
    private certificationService: CertificationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user?.email) { this.loading = false; return; }
    this.prenom = user.prenom || '';

    this.auth.getApprenantByEmail(user.email).subscribe({
      next: (apprenant) => {
        this.apprenantId = apprenant.id!;
        this.chargerFormations();
      },
      error: () => { this.loading = false; }
    });
  }

  chargerFormations(): void {
    this.auth.getFormationsChoisies(this.apprenantId).subscribe({
      next: (ids) => {
        if (ids.length === 0) {
          this.loading = false;
          if (this.auth.isEtudiant()) {
            this.router.navigate(['/choix-formations']);
          }
          return;
        }
        this.catalogue.getFormations().subscribe({
          next: (all) => {
            this.formations = all.filter(f => f.id && ids.includes(f.id));
            this.formations.forEach(f => this.chargerChapitres(f));
            this.chargerProgressions();
            this.chargerQuiz();
            this.chargerSessionsEtEmploiDuTemps();
            this.chargerRecommandationsChapitres();
            this.chargerFormationsSimilaires();
            this.showNotification();
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  chargerChapitres(formation: Formation): void {
    if (!formation.id) return;
    this.catalogue.getChapitres(formation.id).subscribe(chapitres => {
      this.chapitresParFormation.set(formation.id!, chapitres.sort((a, b) => a.ordre - b.ordre));
      this.calculerStats();
    });
  }

  chargerProgressions(): void {
    this.suivi.getProgressions(this.apprenantId).subscribe({
      next: (progs) => {
        progs.forEach(p => {
          const key = `${p.formationId}-${p.chapitreId}`;
          this.progressions.set(key, p.pourcentage);
        });
        this.calculerStats();
      },
      error: () => {}
    });
  }

  chargerQuiz(): void {
    this.quizService.getQuiz().subscribe({
      next: (all) => {
        const formationIds = new Set(this.formations.filter(f => f.id).map(f => f.id!));
        this.quizList = all.filter(q => q.chapitreId && this.chapitreAssocieAFormation(q.chapitreId, formationIds));
      },
      error: () => {}
    });
  }

  chargerSessionsEtEmploiDuTemps(): void {
    const formationIds = this.formations.filter(f => f.id).map(f => f.id!);
    if (formationIds.length === 0) return;

    this.sessionService.getSessions().subscribe({
      next: (all) => {
        this.sessions = all.filter(s =>
          s.formationIds?.some(fid => formationIds.includes(fid))
        );
        this.construireEmploiDuTemps();
      },
      error: () => {}
    });

    this.sessionService.getInscriptionsByApprenant(this.apprenantId).subscribe({
      next: (ins) => this.inscriptions = ins,
      error: () => {}
    });
  }

  construireEmploiDuTemps(): void {
    const formationMap = new Map(this.formations.filter(f => f.id).map(f => [f.id!, f.titre]));
    this.emploiDuTemps = this.sessions
      .filter(s => s.dateDebut)
      .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
      .map(s => ({
        session: s,
        formations: (s.formationIds || [])
          .map(fid => formationMap.get(fid) || `Formation #${fid}`)
          .join(', ')
      }));
  }

  chargerRecommandationsChapitres(): void {
    this.recommandationsChapitres = [];
    for (const f of this.formations) {
      if (!f.id) continue;
      const chapitres = this.getChapitres(f.id);
      for (const ch of chapitres) {
        if (!this.estTermine(f.id, ch.id!)) {
          this.recommandationsChapitres.push({ formation: f, chapitre: ch });
          break;
        }
      }
    }
  }

  chargerFormationsSimilaires(): void {
    this.catalogue.getFormations().subscribe({
      next: (all) => {
        const mesIds = new Set(this.formations.filter(f => f.id).map(f => f.id!));
        const mesCategories = new Set(
          this.formations.filter(f => f.categorie?.id).map(f => f.categorie!.id!)
        );
        this.formationsSimilaires = all
          .filter(f => f.id && !mesIds.has(f.id) && f.categorie?.id && mesCategories.has(f.categorie.id))
          .slice(0, 4);
      },
      error: () => {}
    });
  }

  estPassee(session: SessionFormation): boolean {
    return !!session.dateFin && new Date(session.dateFin) < new Date();
  }

  estEnCoursSession(session: SessionFormation): boolean {
    return !!session.dateDebut && !!session.dateFin &&
      new Date(session.dateDebut) <= new Date() && new Date(session.dateFin) >= new Date();
  }

  estInscrite(sessionId: number): boolean {
    return this.inscriptions.some(i => i.sessionId === sessionId);
  }

  inscrireSession(session: SessionFormation): void {
    if (!session.id) return;
    this.sessionService.inscrireApprenant(session.id, this.apprenantId).subscribe({
      next: () => {
        this.inscriptions.push({ apprenantId: this.apprenantId, sessionId: session.id!, statut: 'CONFIRMEE', dateInscription: new Date().toISOString() });
        this.snackBar.open('Inscription confirmée !', 'OK', { duration: 3000, panelClass: ['snackbar-success'] });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Erreur lors de l\'inscription', 'OK', { duration: 3000 });
      }
    });
  }

  showNotification(): void {
    if (this.formations.length > 0) {
      const noms = this.formations.map(f => f.titre).join(', ');
      this.snackBar.open(`Cours choisis : ${noms}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success']
      });
    }
  }

  chapitreAssocieAFormation(chapitreId: number, formationIds: Set<number>): boolean {
    for (const fid of formationIds) {
      const chaps = this.chapitresParFormation.get(fid);
      if (chaps?.some(c => c.id === chapitreId)) return true;
    }
    return false;
  }

  getChapitres(formationId: number): Chapitre[] {
    return this.chapitresParFormation.get(formationId) || [];
  }

  getProgression(formationId: number): number {
    const chapitres = this.getChapitres(formationId);
    if (chapitres.length === 0) return 0;
    const termines = chapitres.filter(c => this.estTermine(formationId, c.id!)).length;
    return Math.round((termines / chapitres.length) * 100);
  }

  estTermine(formationId: number, chapitreId: number): boolean {
    return this.progressions.has(`${formationId}-${chapitreId}`) && this.progressions.get(`${formationId}-${chapitreId}`)! >= 100;
  }

  calculerStats(): void {
    const total = this.formations.length;
    const terminees = this.formations.filter(f => this.getProgression(f.id!) === 100).length;
    const enCours = total - terminees;
    const progressionTotal = this.formations.reduce((s, f) => s + this.getProgression(f.id!), 0);
    this.stats = { total, terminees, enCours, progression: total > 0 ? Math.round(progressionTotal / total) : 0 };
  }

  lireChapitre(formation: Formation, chapitre: Chapitre): void {
    this.formationEnLecture = formation;
    this.chapitreEnLecture = chapitre;
  }

  marquerTermine(): void {
    if (!this.chapitreEnLecture?.id || !this.formationEnLecture?.id) return;
    const chapitreId = this.chapitreEnLecture.id;
    const formationId = this.formationEnLecture.id;
    const key = `${formationId}-${chapitreId}`;
    this.suivi.mettreAJourProgression(this.apprenantId, formationId, chapitreId, 100).subscribe({
      next: () => {
        this.progressions.set(key, 100);
        this.calculerStats();
        if (this.getProgression(formationId) === 100) {
          this.genererCertificat(formationId);
        }
        this.fermerLecture();
      },
      error: () => {}
    });
  }

  genererCertificat(formationId: number): void {
    const chapitres = this.getChapitres(formationId);
    const quizChecks = chapitres
      .filter(ch => ch.id)
      .map(ch => this.quizService.getQuizParChapitre(ch.id!).pipe(
        map(quizList => quizList.length === 0 ? [] : quizList.filter(q => q.id).map(q =>
          this.quizService.getDerniereTentative(q.id!, this.apprenantId).pipe(
            map(t => t?.reussi === true),
            catchError(() => of(false))
          )
        )),
        switchMap(obs => obs.length === 0 ? of([true]) : forkJoin(obs)),
        catchError(() => of([false]))
      ));

    forkJoin(quizChecks).subscribe({
      next: (results) => {
        const allQuizPassed = results.every(r => r.every(v => v === true));
        if (!allQuizPassed) {
          this.snackBar.open('Vous devez réussir tous les quiz pour obtenir le certificat.', 'OK', { duration: 5000 });
          return;
        }
        this.certificationService.getCertificatsApprenant(this.apprenantId).subscribe({
          next: (existants) => {
            const dejaCree = existants.some(c => c.formationId === formationId);
            if (!dejaCree) {
              this.certificationService.genererCertificat({
                apprenantId: this.apprenantId,
                formationId,
                statut: 'ACTIF',
                scoreObtenu: 100
              }).subscribe({
                next: () => this.snackBar.open('Félicitations ! Certificat obtenu !', 'OK', { duration: 5000 }),
                error: () => {}
              });
            }
          },
          error: () => {}
        });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la vérification des quiz.', 'OK', { duration: 3000 });
      }
    });
  }

  fermerLecture(): void {
    this.chapitreEnLecture = null;
    this.formationEnLecture = null;
  }

  passerQuiz(quiz: Quiz): void {
    this.quizService.demarrerTentative(quiz.id!, this.apprenantId).subscribe({
      next: (tentative) => {
        alert(`Quiz "${quiz.titre}" démarré ! Tentative #${tentative.id}`);
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors du démarrage du quiz');
      }
    });
  }
}
