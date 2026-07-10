import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UtilisateurService } from './utilisateur.service';
import { Apprenant } from '../models/apprenant.model';

describe('UtilisateurService', () => {
  let service: UtilisateurService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UtilisateurService]
    });
    service = TestBed.inject(UtilisateurService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get apprenants', () => {
    service.getApprenants().subscribe();
    const req = httpMock.expectOne('/api/users/apprenants');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get apprenant by id', () => {
    service.getApprenantById(1).subscribe();
    const req = httpMock.expectOne('/api/users/apprenants/1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should create apprenant', () => {
    const a: Apprenant = { nom: 'Test', prenom: 'User', email: 't@t.com', statut: 'ACTIF' };
    service.creerApprenant(a).subscribe();
    const req = httpMock.expectOne('/api/users/apprenants');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(a);
    req.flush({});
  });

  it('should update apprenant', () => {
    service.mettreAJourApprenant(1, { nom: 'Updated' } as any).subscribe();
    const req = httpMock.expectOne('/api/users/apprenants/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete apprenant', () => {
    service.supprimerApprenant(1).subscribe();
    const req = httpMock.expectOne('/api/users/apprenants/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get competences', () => {
    service.getCompetences(1).subscribe();
    const req = httpMock.expectOne('/api/users/apprenants/1/competences');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should add competence', () => {
    service.ajouterCompetence({ nom: 'Java', niveau: 'EXPERT' } as any).subscribe();
    const req = httpMock.expectOne('/api/users/competences');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
