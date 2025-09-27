import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

import { Course } from '../../../../core/models/course.model';
import { CourseCardComponent } from '../course-card/course-card.component';

@Component({
  selector: 'app-course-grid',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-grid.component.html',
  styleUrls: ['./course-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseGridComponent {
  courses = input<Course[]>([]);
  isLoading = input<boolean>(false);

  // This would be good for a future loading state
  skeletonArray = signal<number[]>(Array(6).fill(0).map((_, index) => index));
}
