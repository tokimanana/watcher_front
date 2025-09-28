import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
  },
  {
    path: 'tech-interests',
    loadComponent: () => import('./components/tech-interests-setup/tech-interests-setup.component').then(c => c.TechInterestsSetupComponent),
    canActivate: [authGuard]
  }
];
