import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CertificationService } from './certification.service';

describe('CertificationService', () => {
  let service: CertificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CertificationService]
    });
    service = TestBed.inject(CertificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get certificats', () => {
    service.getCertificats().subscribe();
    const req = httpMock.expectOne('/api/certifications');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get certificat by id', () => {
    service.getCertificatById(1).subscribe();
    const req = httpMock.expectOne('/api/certifications/1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should generer certificat', () => {
    service.genererCertificat({ apprenantId: 1, formationId: 1 } as any).subscribe();
    const req = httpMock.expectOne('/api/certifications');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should valider certificat', () => {
    service.validerCertificat(1).subscribe();
    const req = httpMock.expectOne('/api/certifications/1/valider');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should revoquer certificat', () => {
    service.revoquerCertificat(1).subscribe();
    const req = httpMock.expectOne('/api/certifications/1/revoquer');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should get certificats by apprenant', () => {
    service.getCertificatsApprenant(1).subscribe();
    const req = httpMock.expectOne('/api/certifications/apprenant/1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should verify validite', () => {
    service.verifierValidite('CERT-123').subscribe(res => {
      expect(res).toBeTrue();
    });
    const req = httpMock.expectOne('/api/certifications/verifier/CERT-123');
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should telecharger pdf with blob responseType', () => {
    service.telechargerPdf(1).subscribe();
    const req = httpMock.expectOne('/api/certifications/1/pdf');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });
});
