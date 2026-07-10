import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogueService } from '../../services/catalogue.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { FormateurService } from '../../services/formateur.service';
import { SessionService } from '../../services/session.service';
import { CertificationService } from '../../services/certification.service';
import { QuizService } from '../../services/quiz.service';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de Bord</h1>

      <div class="stats-grid">
        <mat-card class="stat-card"><mat-card-header><mat-icon mat-card-avatar class="blue">school</mat-icon><mat-card-title>Formations</mat-card-title></mat-card-header><mat-card-content><div class="stat-value">{{stats.formations}}</div><div class="stat-label">Formations actives</div></mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-header><mat-icon mat-card-avatar class="green">people</mat-icon><mat-card-title>Apprenants</mat-card-title></mat-card-header><mat-card-content><div class="stat-value">{{stats.apprenants}}</div><div class="stat-label">Apprenants inscrits</div></mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-header><mat-icon mat-card-avatar class="orange">person</mat-icon><mat-card-title>Formateurs</mat-card-title></mat-card-header><mat-card-content><div class="stat-value">{{stats.formateurs}}</div><div class="stat-label">Formateurs actifs</div></mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-header><mat-icon mat-card-avatar class="purple">verified</mat-icon><mat-card-title>Certifications</mat-card-title></mat-card-header><mat-card-content><div class="stat-value">{{stats.certifications}}</div><div class="stat-label">Certificats délivrés</div></mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-header><mat-icon mat-card-avatar class="red">event</mat-icon><mat-card-title>Sessions</mat-card-title></mat-card-header><mat-card-content><div class="stat-value">{{stats.sessions}}</div><div class="stat-label">Sessions totales</div></mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-header><mat-icon mat-card-avatar class="teal">quiz</mat-icon><mat-card-title>Quiz</mat-card-title></mat-card-header><mat-card-content><div class="stat-value">{{stats.quiz}}</div><div class="stat-label">Quiz actifs</div></mat-card-content></mat-card>
      </div>

      <div class="charts-grid">
        <mat-card>
          <mat-card-header><mat-card-title>Formations par catégorie</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="bar-chart">
              <div class="bar-item" *ngFor="let cat of formationsParCategorie">
                <div class="bar-label">{{ cat.nom }}</div>
                <div class="bar-track"><div class="bar-fill" [style.width.%]="cat.pct" [style.background]="cat.color">{{ cat.count }}</div></div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header><mat-card-title>Sessions par statut</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="bar-chart">
              <div class="bar-item" *ngFor="let s of sessionsParStatut">
                <div class="bar-label">{{ s.label }}</div>
                <div class="bar-track"><div class="bar-fill" [style.width.%]="s.pct" [style.background]="s.color">{{ s.count }}</div></div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header><mat-card-title>Notifications</mat-card-title></mat-card-header>
          <mat-card-content>
            <div *ngIf="notifications.length === 0" class="no-data">Aucune notification</div>
            <div *ngFor="let n of notifications" class="notif-item" [class.non-lue]="!n.lue" (click)="marquerLue(n)">
              <mat-icon [color]="n.type === 'FORMATION_SANS_COURS' ? 'warn' : 'primary'">info</mat-icon>
              <span class="notif-msg">{{ n.message }}</span>
              <span class="notif-date">{{ n.dateCreation }}</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-header><mat-card-title>Formations récentes</mat-card-title></mat-card-header>
          <mat-card-content><p *ngFor="let f of recentFormations">{{f.titre}}</p></mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header><mat-card-title>Sessions à venir</mat-card-title></mat-card-header>
          <mat-card-content><p *ngFor="let s of upcomingSessions">#{{s.id}} - {{s.dateDebut}} ({{s.statut}})</p></mat-card-content>
        </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    h1 {
      margin-bottom: 24px;
      color: #333;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .stat-card {
      text-align: center;
    }
    .stat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
    mat-card-header .blue { color: #3f51b5; }
    mat-card-header .green { color: #4caf50; }
    mat-card-header .orange { color: #ff9800; }
    mat-card-header .purple { color: #9c27b0; }
    mat-card-header .red { color: #f44336; }
    mat-card-header .teal { color: #009688; }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      color: #333;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }
    .bar-chart { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .bar-item { display: flex; align-items: center; gap: 12px; }
    .bar-label { width: 100px; font-size: 13px; color: #555; flex-shrink: 0; }
    .bar-track { flex: 1; height: 28px; background: #f0f0f0; border-radius: 14px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 14px; display: flex; align-items: center; padding: 0 10px; color: #fff; font-size: 12px; font-weight: 600; min-width: 24px; transition: width 0.6s ease; }
    mat-card-content p { padding: 8px 0; border-bottom: 1px solid #eee; }
    mat-card-content p:last-child { border-bottom: none; }
    .notif-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; cursor: pointer; font-size: 13px; }
    .notif-item.non-lue { background: #f5f7ff; margin: 0 -12px; padding: 8px 12px; border-radius: 6px; font-weight: 500; }
    .notif-msg { flex: 1; }
    .notif-date { color: #999; font-size: 11px; white-space: nowrap; }
    .no-data { color: #999; padding: 12px 0; text-align: center; }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { formations: 0, apprenants: 0, formateurs: 0, certifications: 0, sessions: 0, quiz: 0 };
  recentFormations: any[] = [];
  upcomingSessions: any[] = [];
  formationsParCategorie: any[] = [];
  sessionsParStatut: any[] = [];
  notifications: Notification[] = [];
  couleurs = ['#3f51b5','#4caf50','#ff9800','#9c27b0','#f44336','#00bcd4','#795548'];
  constructor(
    private catalogueService: CatalogueService,
    private utilisateurService: UtilisateurService,
    private formateurService: FormateurService,
    private sessionService: SessionService,
    private certificationService: CertificationService,
    private quizService: QuizService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    forkJoin({
      formations: this.catalogueService.getFormations().pipe(catchError(() => of([]))),
      categories: this.catalogueService.getCategories().pipe(catchError(() => of([]))),
      apprenants: this.utilisateurService.getApprenants().pipe(catchError(() => of([]))),
      formateurs: this.formateurService.getFormateurs().pipe(catchError(() => of([]))),
      sessions: this.sessionService.getSessions().pipe(catchError(() => of([]))),
      certificats: this.certificationService.getCertificats().pipe(catchError(() => of([]))),
      quiz: this.quizService.getQuiz().pipe(catchError(() => of([])))
    }).subscribe(data => {
      this.stats.formations = data.formations.length;
      this.stats.apprenants = data.apprenants.length;
      this.stats.formateurs = data.formateurs.length;
      this.stats.certifications = data.certificats.length;
      this.stats.sessions = data.sessions.length;
      this.stats.quiz = data.quiz.length;
      this.recentFormations = data.formations.slice(-5).reverse();
      this.upcomingSessions = data.sessions.filter((s: any) => s.statut === 'A_PLANIFIER' || s.statut === 'PLANIFIEE').slice(0, 5);

      const catMap: any = {};
      data.categories.forEach((c: any) => catMap[c.id] = c.nom);
      const catCount: any = {};
      data.formations.forEach((f: any) => {
        const cid = f.categorie?.id || f.categorieId;
        if (cid) catCount[catMap[cid]] = (catCount[catMap[cid]] || 0) + 1;
      });
      const cats = Object.keys(catCount);
      const maxCat = Math.max(...Object.values(catCount) as number[], 1);
      this.formationsParCategorie = cats.map((n, i) => ({
        nom: n, count: catCount[n], color: this.couleurs[i % this.couleurs.length],
        pct: (catCount[n] / maxCat) * 100
      }));

      const statutLabels: any = { A_PLANIFIER: 'À planifier', PLANIFIEE: 'Planifiée', EN_COURS: 'En cours', TERMINEE: 'Terminée', ANNULEE: 'Annulée' };
      const statutColors: any = { A_PLANIFIER: '#9e9e9e', PLANIFIEE: '#2196f3', EN_COURS: '#4caf50', TERMINEE: '#9c27b0', ANNULEE: '#f44336' };
      const statutCount: any = {};
      data.sessions.forEach((s: any) => { statutCount[s.statut] = (statutCount[s.statut] || 0) + 1; });
      const sts = Object.keys(statutCount);
      const maxSt = Math.max(...Object.values(statutCount) as number[], 1);
      this.sessionsParStatut = sts.map(s => ({
        label: statutLabels[s] || s, count: statutCount[s], color: statutColors[s] || '#999',
        pct: (statutCount[s] / maxSt) * 100
      }));
    });
    this.notificationService.getNonLues().subscribe(ns => this.notifications = ns);
  }

  marquerLue(n: Notification): void {
    if (n.lue || !n.id) return;
    this.notificationService.marquerLue(n.id).subscribe(() => {
      n.lue = true;
      this.notifications = this.notifications.filter(x => !x.lue);
    });
  }
}
