import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [AsyncPipe, NgbCollapse, RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly doc = inject(DOCUMENT);
  protected readonly title = signal('Notes');
  protected readonly isCollapsed = signal(true);

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }
}
