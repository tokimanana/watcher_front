import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then(m => m.routes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'courses',
    loadChildren: () => import('./features/courses/courses.routes').then(m => m.routes)
  },
  // {
  //   path: 'reviews',
  //   loadChildren: () => import('./features/reviews/reviews.routes').then(m => m.routes),
  //   canActivate: [authGuard]
  // },
  // {
  //   path: 'users',
  //   loadChildren: () => import('./features/users/users.routes').then(m => m.routes),
  //   canActivate: [authGuard]
  // },
  {
    path: '**',
    redirectTo: 'home'
  }
];
