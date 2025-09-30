import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";
import { noAuthGuard } from "../../core/guards/no-auth.guard";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'tech-interests',
    loadComponent: () => import('./components/tech-interests-setup/tech-interests-setup.component').then(c => c.TechInterestsSetupComponent),
    canActivate: [authGuard]
  }
];
