import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

/**
 * Guard pour les routes accessibles uniquement aux utilisateurs NON authentifiés
 * Redirige vers /courses si déjà connecté
 *
 * Usage: Routes comme /auth/login, /auth/register
 */
export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Utilisateur déjà connecté, rediriger vers courses
  return router.createUrlTree(['/courses']);
};
