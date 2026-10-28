import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';

const config = {
  domain: 'dev-06bzs1cu.us.auth0.com',
  clientId: 'GlzZCL2mpQvStRsLVQvR57kyVGCqwKcy',
  authorizationParams: {
    redirect_uri: window.location.origin + '/home',
    audience: 'http://localhost:8080',
  },
  httpInterceptor: {
    allowedList: [`${environment.apiUrl}/*`],
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideRouter(routes, withComponentInputBinding()),
    provideAuth0(config),
    importProvidersFrom(NgbModule),
  ],
};
