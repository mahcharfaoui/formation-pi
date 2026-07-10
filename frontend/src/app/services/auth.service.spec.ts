import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { RegisterRequest, LoginResponse } from '../models/compte-user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const req: RegisterRequest = { email: 'test@test.com', motDePasse: 'pwd', nom: 'Test', prenom: 'T', role: 'ETUDIANT' };

    service.register(req).subscribe(res => {
      expect(res).toBeDefined();
    });

    const reqMock = httpMock.expectOne('/api/auth/register');
    expect(reqMock.request.method).toBe('POST');
    expect(reqMock.request.body).toEqual(req);
    reqMock.flush({});
  });

  it('should login and store currentUser', () => {
    const mockResponse: LoginResponse = { id: 1, email: 'test@test.com', nom: 'Test', prenom: 'T', role: 'ADMIN', statut: 'APPROVED', token: 'abc123' };

    service.login({ email: 'test@test.com', motDePasse: 'pwd' }).subscribe(res => {
      expect(res.token).toBe('abc123');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('currentUser')).toBeTruthy();
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should logout and clear user', () => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 1, email: 'test@test.com', token: 'abc' }));
    service = new AuthService(TestBed.inject(HttpTestingController) as any);

    service.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return isAdmin true when role is ADMIN', () => {
    localStorage.setItem('currentUser', JSON.stringify({ role: 'ADMIN' }));
    service = new AuthService(TestBed.inject(HttpTestingController) as any);

    expect(service.isAdmin()).toBeTrue();
    expect(service.isFormateur()).toBeFalse();
    expect(service.isEtudiant()).toBeFalse();
  });

  it('should return isFormateur true when role is FORMATEUR', () => {
    localStorage.setItem('currentUser', JSON.stringify({ role: 'FORMATEUR' }));
    service = new AuthService(TestBed.inject(HttpTestingController) as any);

    expect(service.isFormateur()).toBeTrue();
    expect(service.isAdmin()).toBeFalse();
  });

  it('should return isEtudiant true when role is ETUDIANT', () => {
    localStorage.setItem('currentUser', JSON.stringify({ role: 'ETUDIANT' }));
    service = new AuthService(TestBed.inject(HttpTestingController) as any);

    expect(service.isEtudiant()).toBeTrue();
  });

  it('should get pending users', () => {
    service.getPendingUsers().subscribe();

    const req = httpMock.expectOne('/api/auth/users/pending');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get all users', () => {
    service.getAllUsers().subscribe();

    const req = httpMock.expectOne('/api/auth/users');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should approve user', () => {
    service.approveUser(1).subscribe();

    const req = httpMock.expectOne('/api/auth/approve/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should reject user', () => {
    service.rejectUser(1).subscribe();

    const req = httpMock.expectOne('/api/auth/reject/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should get apprenant by email', () => {
    service.getApprenantByEmail('test@test.com').subscribe();

    const req = httpMock.expectOne(req => req.url.includes('/api/users/apprenants/email/'));
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should get formations choisies', () => {
    service.getFormationsChoisies(1).subscribe(res => {
      expect(res).toEqual([10, 20]);
    });

    const req = httpMock.expectOne('/api/auth/apprenant/1/formations');
    expect(req.request.method).toBe('GET');
    req.flush([10, 20]);
  });

  it('should save formations choisies', () => {
    service.sauvegarderFormationsChoisies(1, [10, 20]).subscribe();

    const req = httpMock.expectOne('/api/auth/apprenant/1/formations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual([10, 20]);
    req.flush([10, 20]);
  });
});
