import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { switchMap, tap, catchError, map, finalize, of } from 'rxjs';

import { Course } from '../../../../core/models/course.model';
import { Review } from '../../../../core/models/review.model';
import { CourseService } from '../../services/course.service';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { StarRatingComponent } from '../../../../shared/components/ui/star-rating/star-rating.component';
import { DifficultyColorPipe } from '../../../../shared/pipes/difficulty-color.pipe';
import { PlatformBadgeComponent } from "../platform-badge/platform-badge.component";

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
    DifficultyColorPipe,
    PlatformBadgeComponent
],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private mockDataService = inject(MockDataService);

  course = signal<Course | null>(null);
  courseReviews = signal<Review[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal(0);

  recommendedCourses = signal<Course[]>([]);

  ratingDistribution = computed(() => this.calculateRatingDistribution());

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const courseId = params.get('id');
          if (!courseId) {
            throw new Error('Course ID is required');
          }

          this.mockDataService.incrementClickCount(courseId).subscribe();

          return this.courseService.getCourseById(courseId).pipe(
            tap((course) => {
              if (!course) {
                throw new Error('Course not found');
              }
              this.course.set(course);
            }),
            catchError((err) => {
              console.error('Error loading course:', err);
              this.error.set(
                'Course not found or unable to load course details.'
              );
              return of(null);
            })
          );
        }),
        switchMap((course) => {
          if (!course) {
            return of({ reviews: [], recommendations: [] });
          }

          return of(null).pipe(
            switchMap(() => {
              const reviews$ = this.mockDataService
                .getReviewsForCourse(course.id)
                .pipe(catchError(() => of([])));

              const recommendations$ = this.mockDataService
                .getRecommendedCourses(
                  'current-user-id', // Replace with actual user ID when auth is implemented
                  4
                )
                .pipe(catchError(() => of([])));

              return of({}).pipe(
                switchMap(() =>
                  reviews$.pipe(
                    map((reviews) => ({
                      reviews,
                      recommendations: [] as Course[],
                    }))
                  )
                ),
                switchMap((data) =>
                  recommendations$.pipe(
                    map((recommendations) => ({
                      reviews: data.reviews,
                      recommendations,
                    }))
                  )
                )
              );
            })
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.courseReviews.set(data.reviews);
          this.recommendedCourses.set(data.recommendations);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Subscription error:', err);
          this.error.set('Failed to load course data. Please try again.');
          this.loading.set(false);
        },
      });
  }

  goToCourse() {
    if (this.course()) {
      window.open(this.course()!.url, '_blank');
    }
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  writeReview() {
    if (this.course()) {
      this.router.navigate(['/reviews/new'], {
        queryParams: { courseId: this.course()!.id },
      });
    }
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
}
