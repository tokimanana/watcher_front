import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ThemeService } from './services/theme.service';
import { ThemeShowcaseComponent } from './components/theme-showcase/theme-showcase.component';
import { Course } from './core/models/course.model';
import { MockDataService } from './core/services/mock-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, ThemeShowcaseComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly mockDataService = inject(MockDataService);

  title = 'watcher_front';
  courses: Course[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // Theme service will automatically initialize

    // Test the MockDataService
    this.isLoading = true;
    this.mockDataService.getCourses(1, 5).subscribe({
      next: (response) => {
        this.courses = response.courses;
        this.isLoading = false;
        console.log('Total courses:', response.total);
        console.log('First 5 courses:', this.courses);
      },
      error: (error) => {
        this.errorMessage = 'Error loading courses: ' + error.message;
        this.isLoading = false;
        console.error('Error loading courses', error);
      },
    });
  }
}
