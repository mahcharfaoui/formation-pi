import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { CertificationService } from '../../services/certification.service';
import { AuthService } from '../../services/auth.service';
import { Certificat } from '../../models/certification.model';
import { CertificatDialogComponent } from './certificat-dialog.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    CertificatDialogComponent
  ],
  template: `
    <div class="certifications-container">
      <div class="header">
        <div class="header-left">
          <button mat-stroked-button (click)="retour()">
            <mat-icon>arrow_back</mat-icon> Retour
          </button>
          <h1>{{ isEtudiant ? 'Mes Certificats' : 'Certifications & Diplômes' }}</h1>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" *ngIf="!isEtudiant">
          <mat-icon>add</mat-icon>
          Générer Certificat
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="certificats" class="certificats-table">
            <ng-container matColumnDef="numero">
              <th mat-header-cell *matHeaderCellDef>Numéro</th>
              <td mat-cell *matCellDef="let cert">{{ cert.numeroCertificat }}</td>
            </ng-container>

            <ng-container matColumnDef="formation">
              <th mat-header-cell *matHeaderCellDef>Formation</th>
              <td mat-cell *matCellDef="let cert">Formation #{{ cert.formationId }}</td>
            </ng-container>

            <ng-container matColumnDef="dateObtention">
              <th mat-header-cell *matHeaderCellDef>Date Obtention</th>
              <td mat-cell *matCellDef="let cert">{{ cert.dateObtention }}</td>
            </ng-container>

            <ng-container matColumnDef="dateExpiration">
              <th mat-header-cell *matHeaderCellDef>Expiration</th>
              <td mat-cell *matCellDef="let cert">{{ cert.dateExpiration }}</td>
            </ng-container>

            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let cert">
                <mat-chip [color]="cert.valide ? 'primary' : 'warn'" selected>
                  {{ cert.statut }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="score">
              <th mat-header-cell *matHeaderCellDef>Score</th>
              <td mat-cell *matCellDef="let cert">{{ cert.scoreObtenu }}%</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let cert">
                <button mat-icon-button color="primary" (click)="verifier(cert.numeroCertificat!)">
                  <mat-icon>verified</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="telecharger(cert)">
                  <mat-icon>download</mat-icon>
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
    .certifications-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-left h1 { margin: 0; }
    .certificats-table {
      width: 100%;
    }
  `]
})
export class CertificationsComponent implements OnInit {
  certificats: Certificat[] = [];
  colonnes = ['numero', 'formation', 'dateObtention', 'dateExpiration', 'statut', 'score', 'actions'];
  isEtudiant = false;
  apprenantId = 0;

  constructor(
    private certificationService: CertificationService,
    private auth: AuthService,
    private dialog: MatDialog,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.isEtudiant = this.auth.isEtudiant();
    if (this.isEtudiant) {
      const user = this.auth.getCurrentUser();
      if (user?.email) {
        this.auth.getApprenantByEmail(user.email).subscribe({
          next: (apprenant) => {
            this.apprenantId = apprenant.id!;
            this.chargerCertificatsApprenant();
          },
          error: () => this.chargerCertificats()
        });
      }
    } else {
      this.chargerCertificats();
    }
  }

  chargerCertificats(): void {
    this.certificationService.getCertificats().subscribe(data => {
      this.certificats = data;
    });
  }

  chargerCertificatsApprenant(): void {
    this.certificationService.getCertificatsApprenant(this.apprenantId).subscribe(data => {
      this.certificats = data;
    });
  }

  retour(): void {
    this.location.back();
  }

  openDialog(): void {
    const ref = this.dialog.open(CertificatDialogComponent, { width: '500px' });
    ref.afterClosed().subscribe(r => { if (r) this.chargerCertificats(); });
  }

  verifier(numero: string): void {
    this.certificationService.verifierValidite(numero).subscribe({
      next: (valide: boolean) => alert(valide ? 'Certificat valide' : 'Certificat invalide ou expiré'),
      error: () => alert('Erreur lors de la vérification')
    });
  }

  telecharger(certificat: Certificat): void {
    if (!certificat.id) return;
    this.certificationService.telechargerPdf(certificat.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificat-${certificat.numeroCertificat || certificat.id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
