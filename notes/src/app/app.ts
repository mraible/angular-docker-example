import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth-service';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbCollapse, RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly title = signal('Notes');
  protected readonly isCollapsed = signal(true);
}
