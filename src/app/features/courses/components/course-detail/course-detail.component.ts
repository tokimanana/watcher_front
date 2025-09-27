import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { switchMap, tap, catchError, of } from 'rxjs';

import { Course } from '../../../../core/models/course.model';
import { Review } from '../../../../core/models/review.model';

import { CourseService } from '../../services/course.service';
import { MockDataService } from '../../../../core/services/mock-data.service';

import { StarRatingComponent } from '../../../../shared/components/ui/star-rating/star-rating.component';
import { DifficultyColorPipe } from '../../../../shared/pipes/difficulty-color.pipe';
import { PlatformIconPipe } from '../../../../shared/pipes/platform-icon.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';

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
    PlatformIconPipe,
    TruncatePipe
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private mockDataService = inject(MockDataService);

  course: Course | null = null;
  courseReviews: Review[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id');
        if (!courseId) {
          throw new Error('Course ID is required');
        }

        // Update click count whenever course is viewed
        this.mockDataService.incrementClickCount(courseId).subscribe();

        return this.courseService.getCourseById(courseId).pipe(
          tap(course => {
            if (!course) {
              throw new Error('Course not found');
            }
          }),
          catchError(err => {
            console.error('Error loading course:', err);
            this.error = 'Course not found or unable to load course details.';
            return of(null);
          })
        );
      }),
      switchMap(course => {
        if (!course) {
          return of([]);
        }
        this.course = course;
        return this.mockDataService.getReviewsForCourse(course.id).pipe(
          catchError(err => {
            console.error('Error loading reviews:', err);
            return of([]);
          })
        );
      })
    ).subscribe({
      next: (reviews) => {
        this.courseReviews = reviews;
        this.loading = false;
      },
      error: (err) => {
        console.error('Subscription error:', err);
        this.error = 'Failed to load course data. Please try again.';
        this.loading = false;
      }
    });
  }

  goToCourse() {
    if (this.course) {
      window.open(this.course.url, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  writeReview() {
    if (this.course) {
      this.router.navigate(['/reviews/new'], {
        queryParams: { courseId: this.course.id }
      });
    }
  }

  getRatingDistribution(): { rating: number; count: number; percentage: number }[] {
    if (!this.courseReviews.length) return [];

    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = this.courseReviews.filter(r => Math.round(r.rating) === rating).length;
      return {
        rating,
        count,
        percentage: Math.round((count / this.courseReviews.length) * 100)
      };
    });

    return distribution;
  }
}
