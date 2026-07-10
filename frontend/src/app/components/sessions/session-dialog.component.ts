import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SessionService } from '../../services/session.service';
import { SessionFormation } from '../../models/session.model';
import { Formation } from '../../models/formation.model';
import { Formateur } from '../../models/formateur.model';
import { CatalogueService } from '../../services/catalogue.service';
import { FormateurService } from '../../services/formateur.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-session-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, MatCheckboxModule, MatCardModule,
    MatChipsModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Nouvelle' }} Session</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Formateur *</mat-label>
          <mat-select [(ngModel)]="session.formateurId" required>
            <mat-option *ngFor="let f of formateurs" [value]="f.id">
              {{ f.prenom }} {{ f.nom }} ({{ f.email }})
            </mat-option>
            <mat-option *ngIf="formateurs.length === 0" [value]="0" disabled>Aucun formateur disponible</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date début *</mat-label>
          <input matInput [matDatepicker]="picker1" [(ngModel)]="session.dateDebut" required>
          <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
          <mat-datepicker #picker1></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date fin *</mat-label>
          <input matInput [matDatepicker]="picker2" [(ngModel)]="session.dateFin" required>
          <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
          <mat-datepicker #picker2></mat-datepicker>
        </mat-form-field>

        <div *ngIf="session.dateDebut && session.dateFin && session.dateFin < session.dateDebut" class="date-error">
          La date de fin doit être postérieure à la date de début
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Capacité max *</mat-label>
          <input matInput type="number" [(ngModel)]="session.capaciteMax" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select [(ngModel)]="session.statut">
            <mat-option value="A_PLANIFIER">À planifier</mat-option>
            <mat-option value="PLANIFIEE">Planifiée</mat-option>
            <mat-option value="EN_COURS">En cours</mat-option>
            <mat-option value="TERMINEE">Terminée</mat-option>
            <mat-option value="ANNULEE">Annulée</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Lieu</mat-label>
          <input matInput [(ngModel)]="session.lieu">
        </mat-form-field>

        <mat-checkbox [(ngModel)]="session.enLigne">En ligne</mat-checkbox>
      </div>

      <mat-card class="formations-card">
        <mat-card-header>
          <mat-card-title>Formations programmées</mat-card-title>
          <mat-card-subtitle *ngIf="totalHeures > 0">Total : {{ totalHeures }}h</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="formations-grid">
            <div *ngFor="let f of toutesLesFormations" class="formation-option"
                 [class.selected]="estSelectionne(f.id!)"
                 (click)="basculerFormation(f.id!)">
              <mat-icon>{{ estSelectionne(f.id!) ? 'check_box' : 'check_box_outline_blank' }}</mat-icon>
              <div class="formation-info">
                <span class="formation-titre">{{ f.titre }}</span>
                <span class="formation-duree">{{ f.dureeHeures }}h</span>
              </div>
            </div>
          </div>
          <div *ngIf="toutesLesFormations.length === 0" class="loading-formations">Chargement des formations...</div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="loading">Annuler</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!isValid() || loading">
        <span *ngIf="loading">Enregistrement...</span>
        <span *ngIf="!loading">{{ data ? 'Modifier' : 'Créer' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid { display: flex; flex-direction: column; gap: 16px; min-width: 500px; padding: 8px 0; }
    .formations-card { margin-top: 16px; }
    .formations-grid { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow-y: auto; margin-top: 8px; }
    .formation-option { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 6px; cursor: pointer; transition: background 0.15s; }
    .formation-option:hover { background: #f5f7ff; }
    .formation-option.selected { background: #e8eaf6; }
    .formation-option mat-icon { color: #757575; font-size: 20px; width: 20px; height: 20px; }
    .formation-option.selected mat-icon { color: #3f51b5; }
    .formation-info { display: flex; justify-content: space-between; flex: 1; }
    .formation-titre { font-weight: 500; color: #333; font-size: 14px; }
    .formation-duree { color: #888; font-size: 13px; }
    .loading-formations { color: #888; padding: 16px; text-align: center; }
    .date-error { padding: 8px 12px; background: #fce4ec; color: #c62828; border-radius: 4px; font-size: 13px; margin-bottom: 8px; }
    .error { padding: 8px 12px; background: #fce4ec; color: #c62828; border-radius: 4px; font-size: 13px; margin-top: 12px; }
  `]
})
export class SessionDialogComponent implements OnInit {
  session: SessionFormation = { formationIds: [], formateurId: 0, dateDebut: '', dateFin: '', capaciteMax: 0, statut: 'A_PLANIFIER', participantsActuels: 0, enLigne: false };
  toutesLesFormations: Formation[] = [];
  formateurs: Formateur[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private service: SessionService,
    private catalogue: CatalogueService,
    private formateurService: FormateurService,
    private dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: SessionFormation
  ) {}

  get totalHeures(): number {
    return this.toutesLesFormations
      .filter(f => f.id && this.session.formationIds.includes(f.id))
      .reduce((sum, f) => sum + (f.dureeHeures || 0), 0);
  }

  ngOnInit(): void {
    this.catalogue.getFormations().subscribe(fs => this.toutesLesFormations = fs);

    this.formateurService.getFormateurs().subscribe(fs => {
      this.formateurs = fs;
      if (!this.data && this.auth.isFormateur()) {
        const user = this.auth.getCurrentUser();
        const match = fs.find(f => f.email === user?.email);
        if (match?.id) {
          this.session.formateurId = match.id;
        }
      }
    });

    if (this.data) {
      this.session = { ...this.data, formationIds: [...(this.data.formationIds || [])] };
    } else {
      this.session.dateDebut = new Date().toISOString().split('T')[0];
    }
  }

  estSelectionne(id: number): boolean {
    return this.session.formationIds.includes(id);
  }

  basculerFormation(id: number): void {
    const idx = this.session.formationIds.indexOf(id);
    if (idx >= 0) {
      this.session.formationIds.splice(idx, 1);
    } else {
      this.session.formationIds.push(id);
    }
  }

  save(): void {
    if (this.session.dateFin < this.session.dateDebut) {
      this.errorMsg = 'La date de fin doit être postérieure à la date de début';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    const request = this.data
      ? this.service.mettreAJourSession(this.data.id!, this.session)
      : this.service.creerSession(this.session);
    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => { this.errorMsg = err.error?.message || err.message || 'Erreur'; this.loading = false; }
    });
  }

  isValid(): boolean {
    if (!this.session.formationIds.length || !this.session.formateurId || !this.session.capaciteMax) return false;
    if (!this.session.dateDebut || !this.session.dateFin) return false;
    return true;
  }
}
