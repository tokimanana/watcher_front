import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  OnDestroy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { switchMap, catchError, of } from 'rxjs';

import { Course, CourseHelpers } from '../../../../core/models/course.model';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../../auth/services/auth.service';
import { StarRatingComponent } from '../../../../shared/components/ui/star-rating/star-rating.component';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    StarRatingComponent,
    PlatformBadgeComponent,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);

  // Service signals
  readonly course = this.courseService.selectedCourse;
  readonly loading = this.courseService.loading;
  readonly isAuthenticated = this.authService.isAuthenticated;

  // Local state
  error = signal<string | null>(null);
  activeTab = signal(0);

  // Mock data for reviews (will be replaced with real review service later)
  courseReviews = signal<any[]>([]);
  recommendedCourses = signal<Course[]>([]);

  ratingDistribution = computed(() => this.calculateRatingDistribution());

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const courseId = params.get('id');
          if (!courseId) {
            this.error.set('Course ID is required');
            return of(null);
          }

          // Load course details
          return this.courseService.getCourseById(courseId).pipe(
            catchError((err) => {
              console.error('Error loading course:', err);
              this.error.set('Course not found or unable to load details.');
              return of(null);
            })
          );
        })
      )
      .subscribe({
        next: (course) => {
          if (course) {
            // TODO: Load reviews when review service is ready
            // TODO: Load recommendations based on tech interests
            this.loadMockReviews();
          }
        },
        error: (err) => {
          console.error('Subscription error:', err);
          this.error.set('Failed to load course data. Please try again.');
        },
      });
  }

  ngOnDestroy() {
    this.courseService.clearSelectedCourse();
  }

  goToCourse() {
    const course = this.course();
    if (!course) return;

    if (this.isAuthenticated()) {
      this.courseService.trackCourseClick(course.id).subscribe({
        next: () => {
          window.open(course.url, '_blank');
        },
        error: (err) => {
          console.warn('Click tracking failed, opening anyway:', err);
          window.open(course.url, '_blank');
        },
      });
    } else {
      window.open(course.url, '_blank');
    }
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  writeReview() {
    const course = this.course();
    if (!course) return;

    this.router.navigate(['/reviews/new'], {
      queryParams: { courseId: course.id },
    });
  }

  private calculateRatingDistribution(): {
    rating: number;
    count: number;
    percentage: number;
  }[] {
    const reviews = this.courseReviews();
    if (!reviews.length) return [];

    return [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter(
        (r) => Math.round(r.rating) === rating
      ).length;
      return {
        rating,
        count,
        percentage: Math.round((count / reviews.length) * 100),
      };
    });
  }

  /**
   * Temporary mock reviews (replace with ReviewService later)
   */
  private loadMockReviews() {
    // TODO: Replace with actual review service call
    this.courseReviews.set([]);
  }

  formatDuration(hours: number): string {
    return CourseHelpers.formatDuration(hours);
  }

  formatPrice(price: number, isPaid: boolean): string {
    return CourseHelpers.formatPrice(price, isPaid);
  }

  getLevelBadgeClass(level: string): string {
    return CourseHelpers.getLevelBadgeClass(level);
  }
}
