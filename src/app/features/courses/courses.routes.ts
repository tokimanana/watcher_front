import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/course-catalog/course-catalog.component')
        .then(c => c.CourseCatalogComponent),
    title: 'Courses Catalog',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/course-detail/course-detail.component')
        .then(c => c.CourseDetailComponent),
    title: 'Course Details',
    canActivate: [authGuard]
  }
];
