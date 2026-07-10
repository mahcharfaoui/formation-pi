import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg"></div>
      <div class="top-bar">
        <a routerLink="/" class="top-logo">
          <mat-icon>auto_stories</mat-icon>
          <span>Formation<span class="logo-accent">Pro</span></span>
        </a>
        <div class="top-info">
          <span>Plateforme intelligente de gestion des formations</span>
          <a routerLink="/" class="top-home">
            <mat-icon>home</mat-icon>
            Accueil
          </a>
        </div>
      </div>
      <div class="auth-card">
        <h1>Connexion</h1>
        <p class="auth-sub">Accédez à votre espace personnel</p>

        <div *ngIf="error" class="msg msg-error">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error }}</span>
        </div>

        <form #loginForm="ngForm" (ngSubmit)="onLogin()">
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="exemple@email.com">
          </div>
          <div class="field">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="motDePasse" name="motDePasse" required placeholder="Votre mot de passe">
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            <mat-icon *ngIf="loading" class="spin">hourglass_top</mat-icon>
            <span *ngIf="!loading">Se connecter</span>
            <span *ngIf="loading">Connexion...</span>
          </button>
        </form>

        <p class="auth-link">
          Pas encore de compte ? <a routerLink="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      background: #f0f2f5;
    }
    .auth-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #0d1b4a 0%, #1a237e 40%, #3f51b5 100%);
      clip-path: polygon(0 0, 100% 0, 100% 35%, 0 60%);
      opacity: 0.05;
    }
    .top-bar {
      position: relative;
      width: 100%;
      max-width: 400px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .top-logo {
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      color: #1a237e;
      font-size: 18px;
      font-weight: 700;
    }
    .top-logo mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .top-info {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      color: #888;
    }
    .top-info span { display: none; }
    @media (min-width: 600px) { .top-info span { display: inline; } }
    .top-home {
      display: flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
      color: #3f51b5;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 8px;
      background: #fff;
      border: 1px solid #e0e0e0;
      transition: all 0.2s;
    }
    .top-home:hover { background: #f0f2ff; border-color: #3f51b5; }
    .top-home mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .auth-card {
      position: relative;
      width: 100%;
      max-width: 400px;
      background: #fff;
      border-radius: 16px;
      padding: 40px 40px 36px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      margin-top: 24px;
    }
    .logo-accent { color: #3f51b5; }
    h1 {
      text-align: center;
      font-size: 22px;
      color: #1a237e;
      margin-bottom: 4px;
    }
    .auth-sub {
      text-align: center;
      color: #888;
      font-size: 14px;
      margin-bottom: 28px;
    }
    .msg {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
    }
    .msg mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .msg-error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .field { margin-bottom: 20px; }
    .field label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    .field input {
      width: 100%;
      padding: 11px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      background: #fafafa;
    }
    .field input:focus {
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63,81,181,0.1);
      background: #fff;
    }
    .field input::placeholder { color: #bbb; }
    .btn-primary {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #1a237e, #3f51b5);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; }
    .btn-primary:active:not(:disabled) { transform: scale(0.98); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-link { text-align: center; margin-top: 24px; font-size: 14px; color: #666; }
    .auth-link a { color: #3f51b5; text-decoration: none; font-weight: 600; }
    .auth-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.motDePasse) return;
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: () => {
        this.loading = false;
        const user = this.authService.getCurrentUser();
        if (user?.role === 'ETUDIANT') {
          this.router.navigate(['/choix-formations']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erreur de connexion';
      }
    });
  }
}
