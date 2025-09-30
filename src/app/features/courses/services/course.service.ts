import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, finalize, map, of } from 'rxjs';
import { BaseApiService, MetaHandler } from '../../../core/services/base-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Course,
  CourseFilters,
  CourseListResponse,
  UdemyCourseRaw,
  CourseAdapter
} from '../../../core/models/course.model';
import { PaginationMeta, isPaginationMeta } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService extends BaseApiService implements MetaHandler {
  private readonly notificationService = inject(NotificationService);

  // State signals
  private coursesSignal = signal<Course[]>([]);
  private selectedCourseSignal = signal<Course | null>(null);
  private loadingSignal = signal<boolean>(false);
  private paginationSignal = signal<PaginationMeta | null>(null);
  private filtersSignal = signal<CourseFilters>({});

  constructor() {
    super();
    this.metaHandler = this;
  }

  // Public readonly signals
  readonly courses = this.coursesSignal.asReadonly();
  readonly selectedCourse = this.selectedCourseSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();
  readonly activeFilters = this.filtersSignal.asReadonly();

  // Computed properties
  readonly hasFilters = computed(() => {
    const filters = this.filtersSignal();
    return Object.keys(filters).some(key =>
      filters[key as keyof CourseFilters] !== undefined
    );
  });

  readonly totalCourses = computed(() =>
    this.paginationSignal()?.total ?? this.coursesSignal().length
  );

  readonly currentPage = computed(() =>
    this.paginationSignal()?.page ?? 1
  );

  readonly totalPages = computed(() =>
    this.paginationSignal()?.totalPages ?? 1
  );

  handleMeta(meta: Record<string, any> | undefined): void {
    if (isPaginationMeta(meta)) {
      this.paginationSignal.set(meta);
    } else {
      this.paginationSignal.set(null);
    }
  }

  getAllCourses(filters?: CourseFilters): Observable<Course[]> {
    this.loadingSignal.set(true);
    this.filtersSignal.set(filters || {});

    return this.get<CourseListResponse>('courses', this.buildFilterParams(filters)).pipe(
      map((response) => {
        // Transform raw Udemy data to frontend format
        const adaptedCourses = response.courses.map(raw => CourseAdapter.toFrontend(raw));
        this.coursesSignal.set(adaptedCourses);
        return adaptedCourses;
      }),
      catchError((error) => {
        this.notificationService.error('Failed to load courses. Please try again.');
        this.coursesSignal.set([]);
        return of([]);
      }),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  getCourseById(courseId: string): Observable<Course> {
    this.loadingSignal.set(true);

    return this.get<UdemyCourseRaw>(`courses/${courseId}`).pipe(
      map((raw) => CourseAdapter.toFrontend(raw)),
      tap((course) => {
        this.selectedCourseSignal.set(course);
      }),
      catchError((error) => {
        this.notificationService.error('Course not found');
        this.selectedCourseSignal.set(null);
        throw error;
      }),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  searchCourses(searchTerm: string, additionalFilters?: CourseFilters): Observable<Course[]> {
    const filters: CourseFilters = {
      ...additionalFilters,
      search: searchTerm,
    };
    return this.getAllCourses(filters);
  }

  trackCourseClick(courseId: string): Observable<void> {
    return this.post<void>(`courses/${courseId}/click`, {}).pipe(
      catchError((error) => {
        console.warn('Failed to track course click', error);
        return of(void 0);
      })
    );
  }

  updateFilters(filters: CourseFilters): void {
    this.getAllCourses(filters).subscribe();
  }

  clearFilters(): void {
    this.filtersSignal.set({});
    this.getAllCourses().subscribe();
  }

  goToPage(page: number): void {
    const currentFilters = this.filtersSignal();
    this.getAllCourses({ ...currentFilters, page }).subscribe();
  }

  clearSelectedCourse(): void {
    this.selectedCourseSignal.set(null);
  }

  private buildFilterParams(filters?: CourseFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.search) params['search'] = filters.search;
    if (filters.isPaid !== undefined) params['isPaid'] = filters.isPaid;
    if (filters.sortBy) params['sortBy'] = filters.sortBy;
    if (filters.sortOrder) params['sortOrder'] = filters.sortOrder;
    if (filters.page) params['page'] = filters.page;
    if (filters.limit) params['limit'] = filters.limit;

    if (filters.level) {
      params['level'] = Array.isArray(filters.level)
        ? filters.level.join(',')
        : filters.level;
    }

    if (filters.minPrice !== undefined) params['minPrice'] = filters.minPrice;
    if (filters.maxPrice !== undefined) params['maxPrice'] = filters.maxPrice;
    // if (filters.minDuration !== undefined) params['minDuration'] = filters.minDuration;
    // if (filters.maxDuration !== undefined) params['maxDuration'] = filters.maxDuration;
    // if (filters.minSubscribers !== undefined) params['minSubscribers'] = filters.minSubscribers;

    return params;
  }
}
