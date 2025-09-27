import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { Course } from '../../../core/models/course.model';
import { environment } from '../../../../environments/environment.development';
import { MockDataService } from '../../../core/services/mock-data.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private mockDataService = inject(MockDataService);

  constructor() {
    console.log(
      'CourseService constructor - mockDataService:',
      this.mockDataService
    );
    console.log(
      'Mock data courses length:',
      this.mockDataService ? 'Service exists' : 'Service is null/undefined'
    );
  }

  getCourses(params: any = {}): Observable<Course[]> {
    if (environment.useMockData) {
      return this.mockDataService.getCourses(params).pipe(
        map((response) => {
          return response.courses;
        })
      );
    }

    return this.http
      .get<Course[]>(`${environment.apiUrl}/courses`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching courses', error);
          return of([]);
        })
      );
  }

  getCourseById(id: string): Observable<Course | null> {
    if (environment.useMockData) {
      return this.mockDataService.getCourseById(id);
    }

    return this.http.get<Course>(`${environment.apiUrl}/courses/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching course with ID ${id}`, error);
        return of(null);
      })
    );
  }

  searchCourses(searchTerm: string, filters: any = {}): Observable<Course[]> {
    if (environment.useMockData) {
      return this.mockDataService.searchCourses(searchTerm, filters);
    }

    const params = { searchTerm, ...filters };
    return this.http
      .get<Course[]>(`${environment.apiUrl}/courses/search`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error searching courses', error);
          return of([]);
        })
      );
  }
}
