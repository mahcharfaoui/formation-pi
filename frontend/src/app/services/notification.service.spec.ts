import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), NotificationService]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all notifications', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne('/api/notifications');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get non-lues', () => {
    service.getNonLues().subscribe();
    const req = httpMock.expectOne('/api/notifications/non-lues');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should count non-lues', () => {
    service.countNonLues().subscribe(count => {
      expect(count).toBe(3);
    });
    const req = httpMock.expectOne('/api/notifications/count');
    expect(req.request.method).toBe('GET');
    req.flush(3);
  });

  it('should create notification', () => {
    service.creer({ message: 'Test', lue: false, type: 'INFO' }).subscribe();
    const req = httpMock.expectOne('/api/notifications');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should mark as read', () => {
    service.marquerLue(1).subscribe();
    const req = httpMock.expectOne('/api/notifications/1/lu');
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });
});
