import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-power-bi-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, SafeUrlPipe],
  template: `
    <mat-card class="pb-report-card">
      <mat-card-header>
        <mat-icon mat-card-avatar class="pb-icon">insights</mat-icon>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="!embedUrl" class="pb-placeholder">
          <mat-icon class="placeholder-icon">dashboard_customize</mat-icon>
          <p class="placeholder-text">Rapport Power BI non configuré</p>
          <p class="placeholder-hint">
            Publie un rapport depuis Power BI Desktop vers le Service Power BI,<br>
            puis utilise "Publier sur le web" pour obtenir l'URL d'embed.
          </p>
          <code class="placeholder-code">
            1. Power BI Desktop → Publier<br>
            2. Service Power BI → Fichier → Intégrer → Publier sur le web<br>
            3. Copier le lien iframe
          </code>
        </div>
        <iframe
          *ngIf="embedUrl"
          [src]="embedUrl | safeUrl"
          [width]="width"
          [height]="height"
          style="border: none;"
          allowFullScreen>
        </iframe>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .pb-report-card { margin-bottom: 20px; }
    .pb-icon { color: #f2c811; }
    .pb-placeholder {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 40px 20px;
      background: #fafafa; border: 2px dashed #ddd; border-radius: 8px;
      text-align: center;
    }
    .placeholder-icon { font-size: 56px; width: 56px; height: 56px; color: #bbb; margin-bottom: 16px; }
    .placeholder-text { font-size: 16px; color: #666; margin: 0 0 8px; }
    .placeholder-hint { font-size: 13px; color: #999; margin: 0 0 16px; line-height: 1.6; }
    .placeholder-code {
      font-size: 12px; background: #f0f0f0; padding: 12px 16px;
      border-radius: 6px; color: #555; text-align: left; line-height: 1.8;
    }
    iframe { border-radius: 4px; }
  `]
})
export class PowerBiReportComponent {
  @Input() title = 'Rapport Power BI';
  @Input() embedUrl = '';
  @Input() width = '100%';
  @Input() height = '400';
}
