import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CatalogueService } from './catalogue.service';
import { Formation, Chapitre, Categorie } from '../models/formation.model';

describe('CatalogueService', () => {
  let service: CatalogueService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CatalogueService]
    });
    service = TestBed.inject(CatalogueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get formations', () => {
    service.getFormations().subscribe();
    const req = httpMock.expectOne('/api/catalogue/formations');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get formation by id', () => {
    service.getFormationById(1).subscribe();
    const req = httpMock.expectOne('/api/catalogue/formations/1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should create formation', () => {
    const formation: Formation = { titre: 'Test', description: 'Desc', tarif: 0, dureeHeures: 10, niveau: 'DEBUTANT', active: true };
    service.creerFormation(formation).subscribe();
    const req = httpMock.expectOne('/api/catalogue/formations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(formation);
    req.flush({});
  });

  it('should update formation', () => {
    service.mettreAJourFormation(1, { titre: 'Updated' } as any).subscribe();
    const req = httpMock.expectOne('/api/catalogue/formations/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete formation', () => {
    service.supprimerFormation(1).subscribe();
    const req = httpMock.expectOne('/api/catalogue/formations/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should search formations with keyword', () => {
    service.rechercherFormations('java').subscribe();
    const req = httpMock.expectOne(r => r.url === '/api/catalogue/formations/recherche' && r.params.get('motCle') === 'java');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get chapitres', () => {
    service.getChapitres(1).subscribe();
    const req = httpMock.expectOne('/api/catalogue/formations/1/chapitres');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create chapitre', () => {
    const chapitre: Chapitre = { titre: 'Intro', description: 'Hello', formationId: 1, ordre: 1, dureeMinutes: 30, typeContenu: 'VIDEO' };
    service.creerChapitre(chapitre).subscribe();
    const req = httpMock.expectOne('/api/catalogue/chapitres');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(chapitre);
    req.flush({});
  });

  it('should update chapitre', () => {
    service.mettreAJourChapitre(1, { titre: 'Updated' } as any).subscribe();
    const req = httpMock.expectOne('/api/catalogue/chapitres/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete chapitre', () => {
    service.supprimerChapitre(1).subscribe();
    const req = httpMock.expectOne('/api/catalogue/chapitres/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should upload file', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    service.uploadFichier(file).subscribe();
    const req = httpMock.expectOne('/api/catalogue/upload');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush({ url: 'http://example.com/test.pdf', fileName: 'test.pdf' });
  });

  it('should get categories', () => {
    service.getCategories().subscribe();
    const req = httpMock.expectOne('/api/catalogue/categories');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create category', () => {
    service.creerCategorie({ nom: 'Dev', description: 'Developpement' } as Categorie).subscribe();
    const req = httpMock.expectOne('/api/catalogue/categories');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
