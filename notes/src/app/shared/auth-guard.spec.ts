import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from './auth-service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  function setup(authenticated: boolean) {
    const auth = { isAuthenticated: () => authenticated, login: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }] });
    return auth;
  }

  it('should allow authenticated users', () => {
    const auth = setup(true);
    expect(executeGuard(route, state)).toBe(true);
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('should send anonymous users to login', () => {
    const auth = setup(false);
    expect(executeGuard(route, state)).toBe(false);
    expect(auth.login).toHaveBeenCalled();
  });
});
