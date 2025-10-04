import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './features/auth/services/auth.service';
import { ThemeToggleComponent } from './components/theme-toogle/theme-toogle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    ThemeToggleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  // Make auth state available to the template
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;

  logout(): void {
    // this.authService.logout().subscribe();
    this.authService.logout();
  }
}
