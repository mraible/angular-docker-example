import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be authenticated when /user returns a user', async () => {
    const user = service.loadUser();
    httpMock.expectOne('/user').flush({ email: 'reader@example.com', fullName: 'Book Reader' });
    expect(await user).toEqual({ email: 'reader@example.com', fullName: 'Book Reader' });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should not be authenticated when /user returns an empty body', async () => {
    const user = service.loadUser();
    httpMock.expectOne('/user').flush(null);
    expect(await user).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
