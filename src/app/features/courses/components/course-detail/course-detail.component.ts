import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { switchMap, tap, catchError, of } from 'rxjs';

import { Course, CourseHelpers } from '../../../../core/models/course.model';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';
import { DifficultyBadgeComponent } from '../difficulty-badge/difficulty-badge.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    PlatformBadgeComponent,
    DifficultyBadgeComponent,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  // State
  course = signal<Course | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Computed
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const courseId = params.get('id');
          if (!courseId) {
            throw new Error('Course ID is required');
          }

          // Track click si authentifié
          if (this.isAuthenticated()) {
            this.courseService.trackCourseClick(courseId).subscribe({
              error: (err) => console.warn('Click tracking failed:', err),
            });
          }

          return this.courseService.getCourseById(courseId).pipe(
            tap((course) => {
              if (!course) {
                throw new Error('Course not found');
              }
              this.course.set(course);
              this.loading.set(false);
            }),
            catchError((err) => {
              console.error('Error loading course:', err);
              this.error.set('Course not found or unable to load details.');
              this.loading.set(false);
              return of(null);
            })
          );
        })
      )
      .subscribe();
  }

  goToCourse() {
    const course = this.course();
    if (course) {
      window.open(course.url, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  // Helpers
  formatDuration(hours: number): string {
    return CourseHelpers.formatDuration(hours);
  }

  formatPrice(price: number, isPaid: boolean): string {
    return CourseHelpers.formatPrice(price, isPaid);
  }

  getLevelBadgeClass(level: string): string {
    return CourseHelpers.getLevelBadgeClass(level);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
