import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Course, CourseHelpers } from '../../../../core/models/course.model';
import { DifficultyBadgeComponent } from '../difficulty-badge/difficulty-badge.component';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DifficultyBadgeComponent,
    PlatformBadgeComponent,
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
    window.open(this.course().url, '_blank');
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

  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
