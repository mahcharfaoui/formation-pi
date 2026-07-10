import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CatalogueService } from '../../services/catalogue.service';
import { SuiviService } from '../../services/suivi.service';
import { SessionService } from '../../services/session.service';
import { CertificationService } from '../../services/certification.service';
import { HttpClient } from '@angular/common/http';
import { Formation, Chapitre } from '../../models/formation.model';
import { SessionFormation } from '../../models/session.model';

interface PlanningJour {
  date: Date;
  jour: string;
  seances: { formation: Formation; chapitre: Chapitre; conseil: string; liens: { titre: string; url: string; type: string }[] }[];
}

interface Recommandation {
  formationId: number;
  titre: string;
  score: number;
  raison: string;
}

@Component({
  selector: 'app-recommandations',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatDividerModule, MatChipsModule
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <button mat-stroked-button (click)="retourDashboard()">
          <mat-icon>arrow_back</mat-icon> Retour
        </button>
        <div>
          <h1>Recommandations personnalisées</h1>
          <p class="subtitle">Basées sur vos formations choisies</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><mat-progress-bar mode="indeterminate"></mat-progress-bar></div>

      <div *ngIf="!loading && formations.length === 0" class="empty">
        <mat-icon class="empty-icon">info</mat-icon>
        <h2>Aucune formation choisie</h2>
        <p>Choisissez des formations pour obtenir des recommandations.</p>
        <button mat-raised-button color="primary" routerLink="/choix-formations">
          <mat-icon>add</mat-icon> Choisir mes formations
        </button>
      </div>

      <div *ngIf="!loading && formations.length > 0">
        <div class="stats-row">
          <mat-card class="stat-card">
            <mat-icon>school</mat-icon>
            <div>
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">Formations</div>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <div class="stat-number">{{ stats.terminees }}</div>
              <div class="stat-label">Terminées</div>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>pending</mat-icon>
            <div>
              <div class="stat-number">{{ stats.restantes }}</div>
              <div class="stat-label">En cours</div>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>trending_up</mat-icon>
            <div>
              <div class="stat-number">{{ stats.progression }}%</div>
              <div class="stat-label">Global</div>
            </div>
          </mat-card>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <h2>Planning de révision</h2>
        <p class="section-desc">Répartissez vos chapitres restants sur la semaine.</p>
        <div *ngIf="planning.length === 0" class="empty-section">
          Tous les chapitres sont terminés ! Félicitations.
        </div>
        <div class="planning-grid" *ngIf="planning.length > 0">
          <mat-card *ngFor="let jour of planning" class="day-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>{{ jour.seances.length > 0 ? 'check_circle' : 'event_busy' }}</mat-icon>
              <mat-card-title>{{ jour.jour }}</mat-card-title>
              <mat-card-subtitle>{{ jour.date | date:'dd MMM yyyy' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngFor="let s of jour.seances" class="seance-item">
                <div class="seance-time">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ s.formation.titre }}</span>
                </div>
                <div class="seance-chapitre">{{ s.chapitre.titre }}</div>
                <div class="seance-duree">{{ s.chapitre.dureeMinutes }} min</div>
                <div class="seance-conseil">
                  <mat-icon>lightbulb</mat-icon>
                  <span>{{ s.conseil }}</span>
                </div>
                <div class="seance-liens" *ngIf="s.liens.length > 0">
                  <a *ngFor="let l of s.liens" [href]="l.url" target="_blank" class="lien-btn">
                    <mat-icon>{{ l.type === 'video' ? 'play_circle' : l.type === 'exercice' ? 'assignment' : 'link' }}</mat-icon>
                    {{ l.titre }}
                  </a>
                </div>
              </div>
              <div *ngIf="jour.seances.length === 0" class="seance-empty">Libre</div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <h2>Prochains chapitres à étudier</h2>
        <div *ngIf="prochainsChapitres.length === 0" class="empty-section">
          Tous les chapitres sont terminés.
        </div>
        <div class="chapitres-list" *ngIf="prochainsChapitres.length > 0">
          <div class="chapitre-card" *ngFor="let item of prochainsChapitres">
            <mat-icon class="chapitre-icon">play_circle</mat-icon>
            <div class="chapitre-info">
              <div class="chapitre-formation">{{ item.formation.titre }}</div>
              <div class="chapitre-titre">{{ item.chapitre.titre }}</div>
              <div class="chapitre-meta">{{ item.chapitre.dureeMinutes }} min</div>
            </div>
            <button mat-stroked-button color="primary" (click)="lireChapitre(item.formation, item.chapitre)">
              <mat-icon>menu_book</mat-icon> Lire
            </button>
          </div>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <h2>Formations similaires</h2>
        <div *ngIf="formationsSimilaires.length === 0" class="empty-section">
          Aucune formation similaire trouvée.
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
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
    .page-header h1 { margin: 0; font-size: 24px; color: #1a237e; }
    .subtitle { color: #888; margin-top: 2px; font-size: 14px; }
    .loading { margin-bottom: 16px; }
    .empty { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 64px; width: 64px; height: 64px; color: #c5cae9; margin-bottom: 16px; }
    .empty h2 { color: #555; }
    .empty p { color: #888; margin-bottom: 20px; }
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 24px; }
    .stat-card { display: flex; align-items: center; gap: 14px; padding: 16px; }
    .stat-card mat-icon { font-size: 32px; width: 32px; height: 32px; color: #3f51b5; }
    .stat-number { font-size: 22px; font-weight: bold; color: #1a237e; }
    .stat-label { font-size: 12px; color: #888; }
    .section-divider { margin: 28px 0; }
    h2 { color: #333; margin-bottom: 6px; font-size: 20px; }
    .section-desc { color: #888; font-size: 13px; margin-bottom: 16px; }
    .empty-section { text-align: center; padding: 32px; color: #888; background: #fafafa; border-radius: 8px; }
    .planning-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-bottom: 8px; }
    .day-card { }
    .day-card mat-card-header mat-icon { color: #4caf50; }
    .seance-item { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .seance-item:last-child { border-bottom: none; }
    .seance-time { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #3f51b5; font-weight: 600; }
    .seance-time mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .seance-chapitre { font-size: 13px; color: #444; margin: 2px 0; }
    .seance-duree { font-size: 11px; color: #888; }
    .seance-conseil { display: flex; align-items: flex-start; gap: 4px; margin-top: 6px; padding: 6px 8px; background: #fffde7; border-radius: 6px; font-size: 11px; color: #795548; line-height: 1.4; }
    .seance-conseil mat-icon { font-size: 14px; width: 14px; height: 14px; color: #f9a825; flex-shrink: 0; margin-top: 1px; }
    .seance-liens { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
    .lien-btn { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; background: #e8eaf6; border-radius: 4px; font-size: 11px; color: #3f51b5; text-decoration: none; transition: background 0.2s; }
    .lien-btn:hover { background: #c5cae9; }
    .lien-btn mat-icon { font-size: 12px; width: 12px; height: 12px; }
    .seance-empty { color: #bbb; font-style: italic; padding: 8px 0; text-align: center; }
    .chapitres-list { display: flex; flex-direction: column; gap: 10px; }
    .chapitre-card { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: #f0f4ff; border-radius: 10px; border-left: 4px solid #3f51b5; }
    .chapitre-icon { color: #3f51b5; }
    .chapitre-info { flex: 1; }
    .chapitre-formation { font-size: 11px; color: #666; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .chapitre-titre { font-weight: 600; color: #333; font-size: 14px; }
    .chapitre-meta { font-size: 12px; color: #888; margin-top: 2px; }
    .similaires-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .similaire-card { transition: box-shadow 0.2s; }
    .similaire-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .lecture-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; align-items: center; justify-content: center; }
    .lecture-panel { background: #fff; border-radius: 12px; width: 90%; max-width: 700px; max-height: 80vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
    .lecture-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #eee; }
    .lecture-header h3 { margin: 0; font-size: 18px; color: #1a237e; }
    .lecture-body { padding: 24px; line-height: 1.6; color: #444; }
    .contenu-link { margin-top: 16px; }
    .lecture-actions { padding: 16px 24px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; }
  `]
})
export class RecommandationsComponent implements OnInit {
  formations: Formation[] = [];
  chapitresParFormation = new Map<number, Chapitre[]>();
  progressions = new Map<string, number>();
  planning: PlanningJour[] = [];
  prochainsChapitres: { formation: Formation; chapitre: Chapitre }[] = [];
  formationsSimilaires: Formation[] = [];
  loading = true;
  stats = { total: 0, terminees: 0, restantes: 0, progression: 0 };
  apprenantId = 0;

  chapitreEnLecture: Chapitre | null = null;
  formationEnLecture: Formation | null = null;

  constructor(
    private auth: AuthService,
    private catalogue: CatalogueService,
    private suivi: SuiviService,
    private sessionService: SessionService,
    private certificationService: CertificationService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user?.email) { this.loading = false; return; }
    if (this.auth.isFormateur() || this.auth.isAdmin()) { this.router.navigate(['/dashboard']); return; }

    this.auth.getApprenantByEmail(user.email).subscribe({
      next: (apprenant) => {
        this.apprenantId = apprenant.id!;
        this.chargerDonnees();
      },
      error: () => { this.loading = false; }
    });
  }

  chargerDonnees(): void {
    this.auth.getFormationsChoisies(this.apprenantId).subscribe({
      next: (ids) => {
        if (ids.length === 0) { this.loading = false; return; }
        this.catalogue.getFormations().subscribe({
          next: (all) => {
            this.formations = all.filter(f => f.id && ids.includes(f.id));
            this.formations.forEach(f => this.chargerChapitresEtProgression(f));
            this.chargerFormationsSimilaires();
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  chargerChapitresEtProgression(formation: Formation): void {
    if (!formation.id) return;
    this.catalogue.getChapitres(formation.id).subscribe(chapitres => {
      this.chapitresParFormation.set(formation.id!, chapitres.sort((a, b) => a.ordre - b.ordre));
      this.suivi.getProgressions(this.apprenantId).subscribe({
        next: (progs) => {
          progs.forEach(p => {
            if (p.formationId === formation.id) {
              const key = `${p.formationId}-${p.chapitreId}`;
              this.progressions.set(key, p.pourcentage);
            }
          });
          this.apresChargement();
        },
        error: () => this.apresChargement()
      });
    });
  }

  apresChargement(): void {
    if (this.chapitresParFormation.size < this.formations.filter(f => f.id).length) return;
    this.calculerStats();
    this.construirePlanning();
    this.trouverProchainsChapitres();
    this.loading = false;
  }

  calculerStats(): void {
    const total = this.formations.length;
    const terminees = this.formations.filter(f => this.getProgression(f.id!) === 100).length;
    const restantes = total - terminees;
    const progressionTotal = this.formations.reduce((s, f) => s + this.getProgression(f.id!), 0);
    this.stats = { total, terminees, restantes, progression: total > 0 ? Math.round(progressionTotal / total) : 0 };
  }

  getProgression(formationId: number): number {
    const chapitres = this.chapitresParFormation.get(formationId) || [];
    if (chapitres.length === 0) return 0;
    const termines = chapitres.filter(c => this.estTermine(formationId, c.id!)).length;
    return Math.round((termines / chapitres.length) * 100);
  }

  estTermine(formationId: number, chapitreId: number): boolean {
    return this.progressions.has(`${formationId}-${chapitreId}`) && this.progressions.get(`${formationId}-${chapitreId}`)! >= 100;
  }

  getChapitres(formationId: number): Chapitre[] {
    return this.chapitresParFormation.get(formationId) || [];
  }

  trouverProchainsChapitres(): void {
    this.prochainsChapitres = [];
    for (const f of this.formations) {
      if (!f.id) continue;
      for (const ch of this.getChapitres(f.id)) {
        if (!this.estTermine(f.id, ch.id!)) {
          this.prochainsChapitres.push({ formation: f, chapitre: ch });
          break;
        }
      }
    }
  }

  construirePlanning(): void {
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const chapitresRestants: { formation: Formation; chapitre: Chapitre }[] = [];
    for (const f of this.formations) {
      if (!f.id) continue;
      for (const ch of this.getChapitres(f.id)) {
        if (!this.estTermine(f.id, ch.id!)) {
          chapitresRestants.push({ formation: f, chapitre: ch });
        }
      }
    }

    this.planning = jours.map((nom, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const seances = [];
      if (index < chapitresRestants.length) {
        const item = chapitresRestants[index];
        seances.push({
          ...item,
          conseil: this.genererConseil(item.chapitre),
          liens: this.genererLiens(item.chapitre)
        });
      }
      return { date, jour: nom, seances };
    });
  }

  genererConseil(chapitre: Chapitre): string {
    const type = (chapitre.typeContenu || '').toUpperCase();
    if (type === 'VIDEO') {
      return 'Regardez la vidéo attentivement, prenez des notes et mettez sur pause pour reproduire les exemples.';
    }
    if (type === 'EXERCICE' || type === 'EXERCICES') {
      return 'Essayez de résoudre les exercices seul d\'abord, puis vérifiez les corrigés.';
    }
    if (type === 'PDF' || type === 'DOCUMENT') {
      return 'Lisez le document en diagonale d\'abord, puis relisez en détail les sections importantes.';
    }
    if (type === 'QUIZ') {
      return 'Testez vos connaissances ! Notez les questions où vous hésitez pour les réviser.';
    }
    if (chapitre.dureeMinutes > 60) {
      return 'Session longue : prévoyez une pause à mi-parcours pour rester concentré.';
    }
    if (chapitre.dureeMinutes < 15) {
      return 'Session rapide : idéal pour un apprentissage ciblé. Restez focus !';
    }
    return 'Lisez attentivement le contenu et notez les points clés à retenir.';
  }

  genererLiens(chapitre: Chapitre): { titre: string; url: string; type: string }[] {
    const liens: { titre: string; url: string; type: string }[] = [];
    if (chapitre.contenuUrl) {
      liens.push({
        titre: 'Document principal',
        url: chapitre.contenuUrl,
        type: 'document'
      });
    }
    if (chapitre.videoUrl) {
      liens.push({
        titre: 'Voir la vidéo',
        url: chapitre.videoUrl,
        type: 'video'
      });
    }
    return liens;
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
        this.construirePlanning();
        this.trouverProchainsChapitres();
        this.fermerLecture();
      },
      error: () => {}
    });
  }

  genererCertificat(formationId: number): void {
    this.certificationService.getCertificatsApprenant(this.apprenantId).subscribe({
      next: (existants) => {
        const dejaCree = existants.some(c => c.formationId === formationId);
        if (!dejaCree) {
          this.certificationService.genererCertificat({
            apprenantId: this.apprenantId,
            formationId,
            statut: 'ACTIF',
            scoreObtenu: 100
          }).subscribe({ next: () => {}, error: () => {} });
        }
      },
      error: () => {}
    });
  }

  fermerLecture(): void {
    this.chapitreEnLecture = null;
    this.formationEnLecture = null;
  }

  retourDashboard(): void {
    this.router.navigate(['/mes-formations']);
  }
}