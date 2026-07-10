import { Injectable } from '@angular/core';

export interface PowerBiReport {
  id: string;
  title: string;
  embedUrl: string;
  width?: string;
  height?: string;
}

@Injectable({ providedIn: 'root' })
export class PowerBiService {
  private reports: PowerBiReport[] = [
    {
      id: 'formations',
      title: 'Analyse des Formations',
      embedUrl: '',
      width: '100%',
      height: '400'
    },
    {
      id: 'sessions',
      title: 'Sessions & Inscriptions',
      embedUrl: '',
      width: '100%',
      height: '400'
    },
    {
      id: 'apprenants',
      title: 'Suivi Apprenants',
      embedUrl: '',
      width: '100%',
      height: '400'
    }
  ];

  getReports(): PowerBiReport[] {
    return this.reports;
  }

  updateEmbedUrl(reportId: string, url: string): void {
    const report = this.reports.find(r => r.id === reportId);
    if (report) report.embedUrl = url;
  }
}
