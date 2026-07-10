import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { CompteUser } from '../../models/compte-user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatTabsModule],
  template: `
    <div class="admin-container">
      <h1>Gestion des comptes utilisateurs</h1>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Comptes en attente d'approbation</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="pendingUsers.length === 0" class="empty-msg">Aucun compte en attente.</div>
          <table *ngIf="pendingUsers.length > 0" mat-table [dataSource]="pendingUsers" class="full-width">
            <ng-container matColumnDef="prenom">
              <th mat-header-cell *matHeaderCellDef>Prénom</th>
              <td mat-cell *matCellDef="let u">{{ u.prenom }}</td>
            </ng-container>
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let u">{{ u.nom }}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let u">{{ u.email }}</td>
            </ng-container>
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rôle</th>
              <td mat-cell *matCellDef="let u">{{ u.role }}</td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let u">{{ u.dateCreation | date:'short' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let u">
                <button mat-raised-button color="primary" (click)="approuver(u.id)" class="btn-action">Approuver</button>
                <button mat-raised-button color="warn" (click)="refuser(u.id)" class="btn-action">Refuser</button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card class="all-users-card">
        <mat-card-header>
          <mat-card-title>Tous les comptes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="allUsers.length === 0" class="empty-msg">Aucun utilisateur.</div>
          <table *ngIf="allUsers.length > 0" mat-table [dataSource]="allUsers" class="full-width">
            <ng-container matColumnDef="prenom">
              <th mat-header-cell *matHeaderCellDef>Prénom</th>
              <td mat-cell *matCellDef="let u">{{ u.prenom }}</td>
            </ng-container>
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let u">{{ u.nom }}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let u">{{ u.email }}</td>
            </ng-container>
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rôle</th>
              <td mat-cell *matCellDef="let u">{{ u.role }}</td>
            </ng-container>
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let u">
                <span [class.approved]="u.statut === 'APPROVED'" [class.pending]="u.statut === 'PENDING'" [class.rejected]="u.statut === 'REJECTED'">
                  {{ u.statut }}
                </span>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="allColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: allColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container { padding: 20px; }
    .full-width { width: 100%; }
    .all-users-card { margin-top: 24px; }
    .btn-action { margin-right: 8px; }
    .empty-msg { padding: 20px; text-align: center; color: #888; }
    .approved { color: #4caf50; font-weight: 500; }
    .pending { color: #ff9800; font-weight: 500; }
    .rejected { color: #f44336; font-weight: 500; }
  `]
})
export class AdminUsersComponent implements OnInit {
  pendingUsers: CompteUser[] = [];
  allUsers: CompteUser[] = [];
  displayedColumns = ['prenom', 'nom', 'email', 'role', 'date', 'actions'];
  allColumns = ['prenom', 'nom', 'email', 'role', 'statut'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.authService.getPendingUsers().subscribe(u => this.pendingUsers = u);
    this.authService.getAllUsers().subscribe(u => this.allUsers = u);
  }

  approuver(id: number): void {
    this.authService.approveUser(id).subscribe(() => this.charger());
  }

  refuser(id: number): void {
    this.authService.rejectUser(id).subscribe(() => this.charger());
  }
}
