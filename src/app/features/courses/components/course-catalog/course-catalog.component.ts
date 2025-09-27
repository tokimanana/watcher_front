import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, computed } from '@angular/core';

import { CourseGridComponent } from '../course-grid/course-grid.component';
import { CourseService } from '../../services/course.service';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, CourseGridComponent],
  template: `
    <div class="course-catalog-container">
      <h1>Course Catalog</h1>
      <app-course-grid
        [courses]="courses()"
        [isLoading]="isLoading()"
      ></app-course-grid>
    </div>
  `,
  styles: [`
    .course-catalog-container {
      padding: 1.5rem;

      h1 {
        margin-bottom: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCatalogComponent {
  private courseService = inject(CourseService);

  courses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    console.log('CourseCatalogComponent constructor called');
    this.loadCourses();
  }

  private loadCourses(): void {
    console.log('Loading courses...');
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        console.log('Received courses:', courses);
        console.log('Courses length:', courses?.length);
        this.courses.set(courses);
        console.log('After setting signal - courses():', this.courses());
        console.log('After setting signal - courses().length:', this.courses().length);
        this.isLoading.set(false);
        console.log('After setting isLoading - isLoading():', this.isLoading());
      },
      error: (error) => {
        console.error('Error loading courses', error);
        this.isLoading.set(false);
      }
    });
  }
}
