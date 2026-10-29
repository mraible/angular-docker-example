import { DOCUMENT, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly location = inject(Location);
  private readonly doc = inject(DOCUMENT);
  readonly user = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  // Spring Boot returns the user's OIDC profile, or an empty body when nobody is logged in
  async loadUser(): Promise<User | null> {
    const user = await firstValueFrom(
      this.http.get<User | null>(`${environment.apiUrl}/user`).pipe(catchError(() => of(null))),
    );
    this.user.set(user);
    return user;
  }

  // Spring Security starts the OAuth 2.0 flow at this endpoint
  login(): void {
    this.doc.location.href = `${this.doc.location.origin}${this.location.prepareExternalUrl('oauth2/authorization/auth0')}`;
  }

  // Ends the Spring Boot session, then signs out of Auth0 with the URL it returns
  logout(): void {
    this.http
      .post<{ logoutUrl: string }>(`${environment.apiUrl}/api/logout`, {})
      .subscribe((response) => {
        this.doc.location.href = response.logoutUrl;
      });
  }
}
