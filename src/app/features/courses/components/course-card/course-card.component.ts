import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Course } from '../../../../core/models/course.model';
import { StarRatingComponent } from '../../../../shared/components/ui/star-rating/star-rating.component';
import { DifficultyBadgeComponent } from '../difficulty-badge/difficulty-badge.component';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';
import { PlatformIconPipe } from '../../../../shared/pipes/platform-icon.pipe';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    StarRatingComponent,
    DifficultyBadgeComponent,
    PlatformBadgeComponent,
    PlatformIconPipe
  ],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent {
  course = input.required<Course>();

  constructor(private router: Router) {}

  navigateToCourse(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/courses', this.course().id]);
  }

  navigateToExternalCourse(event: Event): void {
    event.stopPropagation();
    // Track click before navigating to external site
    console.log('External course click tracked:', this.course().title);
    window.open(this.course().url, '_blank');
  }
}
