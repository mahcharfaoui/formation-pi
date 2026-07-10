import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogueService } from '../../services/catalogue.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { FormateurService } from '../../services/formateur.service';
import { SessionService } from '../../services/session.service';
import { CertificationService } from '../../services/certification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-logo">
          <mat-icon>auto_stories</mat-icon>
          <span>Formation<span class="logo-accent">Pro</span></span>
        </a>
        <div class="nav-actions">
          <a routerLink="/login" class="nav-btn nav-btn-outline">Connexion</a>
          <a routerLink="/register" class="nav-btn nav-btn-solid">Inscription</a>
        </div>
      </div>
    </nav>

    <!-- Hero / Slider -->
    <section class="hero">
      <div class="hero-slide">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="hero-badge">Formation professionnelle certifiante</span>
          <h1>Construisez l'avenir<br/>avec les compétences <span class="highlight">de demain</span></h1>
          <p>Accédez à un catalogue complet de formations en ligne, encadré par des experts<br/>et validé par des certifications reconnues.</p>
          <div class="hero-actions">
            <a mat-raised-button color="primary" (click)="scrollToFormations()">Découvrir nos formations</a>
            <a mat-stroked-button routerLink="/register">Commencer gratuitement</a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><span class="hero-stat-nb">{{ stats.formations }}</span><span class="hero-stat-lbl">Formations</span></div>
            <div class="hero-stat"><span class="hero-stat-nb">{{ stats.apprenants }}</span><span class="hero-stat-lbl">Apprenants</span></div>
            <div class="hero-stat"><span class="hero-stat-nb">{{ stats.formateurs }}</span><span class="hero-stat-lbl">Formateurs</span></div>
            <div class="hero-stat"><span class="hero-stat-nb">{{ stats.certifications }}</span><span class="hero-stat-lbl">Certifiés</span></div>
            <div class="hero-stat"><span class="hero-stat-nb">{{ stats.sessions }}</span><span class="hero-stat-lbl">Sessions</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Formations / Diplômes -->
    <section class="formations">
      <h2>Nos formations</h2>
      <p class="section-sub">Des parcours complets pour maîtriser les technologies modernes</p>
      <div class="formation-grid">
        <div class="formation-block" *ngFor="let f of popularFormations">
          <div class="formation-icon">
            <mat-icon>{{ f.niveau === 'DEBUTANT' ? 'engineering' : f.niveau === 'AVANCE' ? 'rocket_launch' : 'trending_up' }}</mat-icon>
          </div>
          <h3>{{ f.titre }}</h3>
          <p class="formation-desc">{{ f.description || 'Formation complète pour acquérir les compétences essentielles.' }}</p>
          <span class="formation-niveau" [class.debutant]="f.niveau === 'DEBUTANT'" [class.intermediaire]="f.niveau === 'INTERMEDIAIRE'" [class.avance]="f.niveau === 'AVANCE'">{{ f.niveau || 'Débutant' }}</span>
          <span class="formation-cat">{{ f.categorieNom || 'Général' }}</span>
        </div>
      </div>
    </section>

    <!-- Actualités / Fonctionnalités -->
    <section class="actu">
      <h2>Actualités & Fonctionnalités</h2>
      <div class="actu-grid">
        <mat-card class="actu-card">
          <div class="actu-img actu-img-ia"></div>
          <mat-card-header><mat-card-title>Recommandations IA</mat-card-title><mat-card-subtitle>Nouveauté 2026</mat-card-subtitle></mat-card-header>
          <mat-card-content><p>Notre algorithme analyse votre profil et vos compétences pour vous recommander les formations les plus pertinentes.</p></mat-card-content>
        </mat-card>
        <mat-card class="actu-card">
          <div class="actu-img actu-img-cert"></div>
          <mat-card-header><mat-card-title>Certifications automatiques</mat-card-title><mat-card-subtitle>Reconnaissance des acquis</mat-card-subtitle></mat-card-header>
          <mat-card-content><p>Obtenez votre certificat dès la fin de votre formation. Téléchargeable et partageable.</p></mat-card-content>
        </mat-card>
        <mat-card class="actu-card">
          <div class="actu-img actu-img-quiz"></div>
          <mat-card-header><mat-card-title>Quiz interactifs</mat-card-title><mat-card-subtitle>Évaluation continue</mat-card-subtitle></mat-card-header>
          <mat-card-content><p>Des quiz corrigés automatiquement pour valider chaque module avant de passer au suivant.</p></mat-card-content>
        </mat-card>
      </div>
    </section>

    <!-- Chiffres -->
    <section class="chiffres">
      <div class="chiffres-bg"></div>
      <h2>La plateforme en chiffres</h2>
      <div class="chiffres-grid">
        <div class="chiffre-item"><span class="chiffre-nb">{{ stats.formations }}+</span><span class="chiffre-lbl">Formations disponibles</span></div>
        <div class="chiffre-item"><span class="chiffre-nb">{{ stats.apprenants > 0 ? stats.apprenants : 0 }}+</span><span class="chiffre-lbl">Apprenants inscrits</span></div>
        <div class="chiffre-item"><span class="chiffre-nb">{{ stats.formateurs > 0 ? stats.formateurs : 0 }}</span><span class="chiffre-lbl">Formateurs experts</span></div>
        <div class="chiffre-item"><span class="chiffre-nb">{{ stats.certifications > 0 ? stats.certifications : 0 }}+</span><span class="chiffre-lbl">Certificats délivrés</span></div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-content">
        <h2>Rejoignez FormationPro</h2>
        <p>Inscrivez-vous gratuitement et commencez votre parcours dès aujourd'hui.</p>
        <a mat-raised-button color="primary" routerLink="/register">Créer un compte gratuit</a>
      </div>
    </section>

    <!-- Contact & Localisation -->
    <section class="contact-section">
      <h2>Nous trouver</h2>
      <div class="contact-grid">
        <div class="contact-map">
          <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=10.1800%2C36.8900%2C10.1978%2C36.9066&amp;layer=mapnik&amp;marker=36.8983%2C10.1889" width="100%" height="100%" frameborder="0" style="border:0; border-radius: 12px;" allowfullscreen loading="lazy"></iframe>
          <a href="https://www.openstreetmap.org/?mlat=36.8983&amp;mlon=10.1889#map=16/36.8983/10.1889" target="_blank" class="map-link">Voir sur OpenStreetMap</a>
        </div>
        <div class="contact-infos">
          <div class="contact-item">
            <div class="contact-icon"><mat-icon>location_on</mat-icon></div>
            <div>
              <h4>Adresse</h4>
              <p>Esprit Ghazella, Zone Industrielle Chotrana II,<br/>Ariana, Tunisie</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon"><mat-icon>phone</mat-icon></div>
            <div>
              <h4>Téléphone</h4>
              <p>(+216) 52 056 778</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon"><mat-icon>email</mat-icon></div>
            <div>
              <h4>Email</h4>
              <p>contact&#64;formationpro.com</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon"><mat-icon>schedule</mat-icon></div>
            <div>
              <h4>Horaires</h4>
              <p>Lun - Sam : 8h00 - 19h30</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <mat-icon>auto_stories</mat-icon>
            <span>FormationPro</span>
          </div>
          <p>Plateforme intelligente de gestion et de suivi de formations professionnelles.</p>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="mailto:contact&#64;formationpro.com">contact&#64;formationpro.com</a>
          <p class="footer-phone">(+216) 52 056 778</p>
          <p class="footer-addr">Esprit Ghazella, Ariana, Tunisie</p>
        </div>
      </div>
      <div class="footer-social">
        <a href="#"><mat-icon>facebook</mat-icon></a>
        <a href="#"><mat-icon>linkedin</mat-icon></a>
        <a href="#"><mat-icon>youtube</mat-icon></a>
        <a href="#"><mat-icon>twitter</mat-icon></a>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 FormationPro. Tous droits réservés.</p>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; font-family: 'Segoe UI', Roboto, sans-serif; }

    .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
    .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 6px; text-decoration: none; color: #1a237e; font-size: 20px; font-weight: 700; flex-shrink: 0; }
    .nav-logo mat-icon { font-size: 26px; width: 26px; height: 26px; }
    .logo-accent { color: #3f51b5; }
    .nav-actions { display: flex; gap: 10px; }
    .nav-btn { padding: 7px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .nav-btn-outline { color: #3f51b5; border: 1px solid #3f51b5; }
    .nav-btn-outline:hover { background: #f0f2ff; }
    .nav-btn-solid { background: #3f51b5; color: #fff; }
    .nav-btn-solid:hover { background: #303f9f; }

    .hero { position: relative; margin-top: 64px; background: linear-gradient(135deg, #0d1b4a 0%, #1a237e 40%, #283593 70%, #3f51b5 100%); min-height: 520px; display: flex; align-items: center; overflow: hidden; }
    .hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 10% 30%, rgba(124,77,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(63,81,181,0.2) 0%, transparent 50%); }
    .hero-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 80px 24px; width: 100%; }
    .hero-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; background: rgba(255,255,255,0.12); color: #b3c5ff; font-size: 13px; font-weight: 500; margin-bottom: 20px; backdrop-filter: blur(4px); }
    .hero h1 { font-size: 44px; font-weight: 800; color: #fff; margin-bottom: 16px; line-height: 1.15; letter-spacing: -0.5px; }
    .highlight { background: linear-gradient(135deg, #7c4dff, #448aff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p { font-size: 17px; color: rgba(255,255,255,0.8); margin-bottom: 32px; line-height: 1.6; }
    .hero-actions { display: flex; gap: 16px; margin-bottom: 56px; }
    .hero-actions a[mat-stroked-button] { color: #fff; border-color: rgba(255,255,255,0.4); }
    .hero-actions a[mat-stroked-button]:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
    .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
    .hero-stat { text-align: center; }
    .hero-stat-nb { display: block; font-size: 32px; font-weight: 800; color: #fff; }
    .hero-stat-lbl { font-size: 13px; color: rgba(255,255,255,0.7); }

    .formations { padding: 80px 24px; max-width: 1100px; margin: 0 auto; text-align: center; }
    .formations h2 { font-size: 30px; font-weight: 700; color: #1a237e; margin-bottom: 8px; }
    .section-sub { color: #666; margin-bottom: 40px; }
    .formation-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .formation-block { padding: 32px 20px; border-radius: 12px; background: #f8f9ff; border: 1px solid #e8eaf6; transition: all 0.25s; cursor: default; }
    .formation-block:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(63,81,181,0.12); border-color: #c5cae9; }
    .formation-icon mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; margin-bottom: 12px; }
    .formation-block h3 { font-size: 16px; color: #1a237e; margin-bottom: 6px; }
    .formation-desc { font-size: 13px; color: #666; line-height: 1.4; margin-bottom: 10px; }
    .formation-niveau { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; margin-bottom: 4px; }
    .formation-niveau.debutant { background: #fff3e0; color: #e65100; }
    .formation-niveau.intermediaire { background: #e3f2fd; color: #1565c0; }
    .formation-niveau.avance { background: #e8f5e9; color: #2e7d32; }
    .formation-cat { display: block; font-size: 12px; color: #999; margin-top: 4px; }


    .actu { padding: 80px 24px; background: #f5f7ff; }
    .actu h2 { font-size: 30px; font-weight: 700; color: #1a237e; text-align: center; margin-bottom: 40px; }
    .actu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; }
    .actu-card { overflow: hidden; }
    .actu-img { height: 160px; background-size: cover; background-position: center; }
    .actu-img-ia { background: linear-gradient(135deg, #7c4dff, #448aff); }
    .actu-img-cert { background: linear-gradient(135deg, #1a237e, #3f51b5); }
    .actu-img-quiz { background: linear-gradient(135deg, #e65100, #ff9800); }

    .chiffres { position: relative; padding: 80px 24px; background: #0d1b4a; text-align: center; overflow: hidden; }
    .chiffres-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(124,77,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(63,81,181,0.1) 0%, transparent 60%); }
    .chiffres h2 { position: relative; font-size: 30px; font-weight: 700; color: #fff; margin-bottom: 48px; }
    .chiffres-grid { position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; max-width: 900px; margin: 0 auto; }
    .chiffre-item { }
    .chiffre-nb { display: block; font-size: 40px; font-weight: 800; color: #7c4dff; margin-bottom: 4px; }
    .chiffre-lbl { font-size: 15px; color: rgba(255,255,255,0.7); }

    .cta { padding: 80px 24px; text-align: center; }
    .cta-content { max-width: 600px; margin: 0 auto; }
    .cta h2 { font-size: 30px; font-weight: 700; color: #1a237e; margin-bottom: 12px; }
    .cta p { font-size: 17px; color: #666; margin-bottom: 32px; }

    .contact-section { padding: 80px 24px; max-width: 1100px; margin: 0 auto; }
    .contact-section h2 { font-size: 30px; font-weight: 700; color: #1a237e; text-align: center; margin-bottom: 40px; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
    .contact-map { position: relative; height: 320px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .contact-map iframe { position: absolute; top: 0; left: 0; }
    .map-link { display: block; text-align: center; margin-top: 8px; font-size: 12px; color: #3f51b5; text-decoration: none; }
    .map-link:hover { text-decoration: underline; }
    .contact-infos { display: flex; flex-direction: column; gap: 24px; }
    .contact-item { display: flex; gap: 16px; align-items: flex-start; padding: 20px; background: #f8f9ff; border-radius: 12px; border: 1px solid #e8eaf6; }
    .contact-icon { width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, #e8eaf6, #c5cae9); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .contact-icon mat-icon { color: #3f51b5; font-size: 22px; width: 22px; height: 22px; }
    .contact-item h4 { font-size: 13px; color: #1a237e; margin-bottom: 2px; }
    .contact-item p { font-size: 14px; color: #555; line-height: 1.5; }
    @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .contact-map { height: 220px; } }

    .footer { background: #0a0f2c; color: #fff; padding: 60px 24px 0; }
    .footer-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr; gap: 48px; }
    .footer-logo { display: flex; align-items: center; gap: 6px; font-size: 18px; font-weight: 700; margin-bottom: 12px; }
    .footer-logo mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .footer-brand p { font-size: 14px; opacity: 0.6; line-height: 1.6; }
    .footer-col h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; opacity: 0.5; }
    .footer-col a { display: block; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; margin-bottom: 8px; transition: color 0.2s; }
    .footer-col a:hover { color: #fff; }
    .footer-phone, .footer-addr { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
    .footer-social { max-width: 1100px; margin: 40px auto 0; display: flex; gap: 16px; justify-content: center; }
    .footer-social a { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); text-decoration: none; transition: all 0.2s; }
    .footer-social a:hover { border-color: #7c4dff; color: #7c4dff; }
    .footer-social mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .footer-bottom { text-align: center; padding: 24px 0; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); }
    .footer-bottom p { font-size: 13px; opacity: 0.4; }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero h1 { font-size: 30px; }
      .hero-stats { gap: 20px; justify-content: center; }
      .hero-stat { min-width: 80px; }
      .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    }
  `]
})
export class HomeComponent implements OnInit {
  stats = { formations: 0, apprenants: 0, formateurs: 0, certifications: 0, sessions: 0, quiz: 0 };
  popularFormations: any[] = [];

  constructor(
    private catalogueService: CatalogueService,
    private utilisateurService: UtilisateurService,
    private formateurService: FormateurService,
    private sessionService: SessionService,
    private certificationService: CertificationService
  ) {}

  scrollToFormations(): void {
    const el = document.querySelector('.formations');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit(): void {
    forkJoin({
      formations: this.catalogueService.getFormations().pipe(catchError(() => of([]))),
      apprenants: this.utilisateurService.getApprenants().pipe(catchError(() => of([]))),
      formateurs: this.formateurService.getFormateurs().pipe(catchError(() => of([]))),
      sessions: this.sessionService.getSessions().pipe(catchError(() => of([]))),
      certificats: this.certificationService.getCertificats().pipe(catchError(() => of([])))
    }).subscribe(data => {
      this.stats.formations = data.formations.length;
      this.stats.apprenants = data.apprenants.length;
      this.stats.formateurs = data.formateurs.length;
      this.stats.certifications = data.certificats.length;
      this.stats.sessions = data.sessions.length;
      this.popularFormations = data.formations.slice(0, 5);
    });
  }
}
