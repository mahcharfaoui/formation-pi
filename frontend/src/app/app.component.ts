import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatDividerModule,
    MatListModule, MatIconModule, MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav [opened]="sidenavOpen" mode="side" class="sidenav"
                   *ngIf="authService.isAdmin() || authService.isFormateur()">
        <div class="sidenav-header">
          <a routerLink="/" class="sidenav-logo">
            <mat-icon>auto_stories</mat-icon>
            <h2>Plateforme Formations</h2>
          </a>
        </div>
        <mat-nav-list>
          <ng-container *ngIf="authService.isLoggedIn()">
            <ng-container *ngIf="authService.isAdmin() || authService.isFormateur()">
              <a mat-list-item routerLink="/dashboard" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>dashboard</mat-icon><span>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/catalogue" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>school</mat-icon><span>Catalogue</span>
              </a>
              <a *ngIf="authService.isAdmin()" mat-list-item routerLink="/utilisateurs" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>people</mat-icon><span>Utilisateurs</span>
              </a>
              <a *ngIf="authService.isAdmin()" mat-list-item routerLink="/formateurs" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>person</mat-icon><span>Formateurs</span>
              </a>
              <a mat-list-item routerLink="/sessions" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>event</mat-icon><span>Sessions</span>
              </a>
              <a mat-list-item routerLink="/quiz" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>quiz</mat-icon><span>Quiz</span>
              </a>
              <a mat-list-item routerLink="/suivi" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>trending_up</mat-icon><span>Suivi</span>
              </a>
              <a mat-list-item routerLink="/certifications" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>verified</mat-icon><span>Certifications</span>
              </a>
              <mat-divider></mat-divider>
              <a *ngIf="authService.isAdmin()" mat-list-item routerLink="/admin/users" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon>admin_panel_settings</mat-icon><span>Gestion comptes</span>
              </a>
            </ng-container>
            <a mat-list-item style="cursor:pointer" (click)="deconnexion(); sidenav.close()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion ({{ authService.getCurrentUser()?.prenom }})</span>
            </a>
          </ng-container>
          <ng-container *ngIf="!authService.isLoggedIn()">
            <a mat-list-item routerLink="/login" (click)="sidenav.close()">
              <mat-icon>login</mat-icon><span>Connexion</span>
            </a>
            <a mat-list-item routerLink="/register" (click)="sidenav.close()">
              <mat-icon>person_add</mat-icon><span>Inscription</span>
            </a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="toggleSidenav()" *ngIf="authService.isAdmin() || authService.isFormateur()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Plateforme Intelligente de Gestion des Formations</span>
          <span class="toolbar-spacer"></span>
          <button mat-icon-button (click)="deconnexion()" *ngIf="authService.isEtudiant()" matTooltip="Déconnexion">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <div class="content" [class.content-full]="!sidenavOpen && (authService.isAdmin() || authService.isFormateur())">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav { width: 260px; background-color: #fff; }
    .sidenav-header { padding: 16px 20px; background: linear-gradient(135deg, #1a237e, #3f51b5); }
    .sidenav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; }
    .sidenav-logo mat-icon { font-size: 28px; width: 28px; height: 28px; }
    .sidenav-logo h2 { font-size: 17px; font-weight: 500; margin: 0; }
    mat-nav-list a.active { background-color: #e8eaf6; color: #3f51b5; border-right: 3px solid #3f51b5; }
    mat-nav-list a { display: flex; align-items: center; gap: 12px; border-radius: 0; }
    .toolbar-spacer { flex: 1; }
    .content { padding: 24px; background-color: #f5f5f5; min-height: calc(100vh - 64px); }
    .content-full { min-height: 100vh; padding: 0; }
  `]
})
export class AppComponent {
  title = 'Plateforme Formations';
  sidenavOpen = true;
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const navEnd = e as NavigationEnd;
      const hiddenRoutes = ['/', '/login', '/register', '/choix-formations'];
      this.sidenavOpen = !hiddenRoutes.includes(navEnd.urlAfterRedirects);
    });
  }

  toggleSidenav(): void {
    this.sidenav?.toggle();
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}