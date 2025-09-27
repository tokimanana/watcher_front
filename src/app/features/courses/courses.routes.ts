import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/course-catalog/course-catalog.component').then(c => c.CourseCatalogComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/course-detail/course-detail.component').then(c => c.CourseDetailComponent)
  }
];
