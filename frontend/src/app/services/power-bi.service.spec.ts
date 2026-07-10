import { TestBed } from '@angular/core/testing';
import { PowerBiService } from './power-bi.service';

describe('PowerBiService', () => {
  let service: PowerBiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PowerBiService] });
    service = TestBed.inject(PowerBiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 3 default reports', () => {
    const reports = service.getReports();
    expect(reports.length).toBe(3);
    expect(reports[0].id).toBe('formations');
    expect(reports[1].id).toBe('sessions');
    expect(reports[2].id).toBe('apprenants');
  });

  it('should update embed URL', () => {
    service.updateEmbedUrl('formations', 'https://example.com/report');
    const reports = service.getReports();
    expect(reports[0].embedUrl).toBe('https://example.com/report');
  });

  it('should not update embed URL for unknown report', () => {
    service.updateEmbedUrl('unknown', 'https://example.com');
    const reports = service.getReports();
    expect(reports[0].embedUrl).toBe('');
  });
});
