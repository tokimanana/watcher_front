import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, finalize, map, of } from 'rxjs';
import {
  BaseApiService,
  MetaHandler,
} from '../../../core/services/base-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Course,
  CourseFilters,
  UdemyCourseRaw,
  CourseAdapter,
} from '../../../core/models/course.model';
import {
  PaginationMeta,
  isPaginationMeta,
} from '../../../core/models/api-response.model';

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
  private filtersSignal = signal<CourseFilters>({
    sortBy: 'numSubscribers',
    sortOrder: 'desc',
    page: 1,
  });

  constructor() {
    super();
    this.metaHandler = this;
  }

  readonly courses = this.coursesSignal.asReadonly();
  readonly selectedCourse = this.selectedCourseSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();
  readonly activeFilters = this.filtersSignal.asReadonly();

  readonly hasFilters = computed(() => {
    const filters = this.filtersSignal();
    return Object.keys(filters).some(
      (key) => filters[key as keyof CourseFilters] !== undefined
    );
  });

  readonly totalCourses = computed(
    () => this.paginationSignal()?.total ?? this.coursesSignal().length
  );

  readonly currentPage = computed(() => this.paginationSignal()?.page ?? 1);

  readonly totalPages = computed(
    () => this.paginationSignal()?.totalPages ?? 1
  );

  handleMeta(meta: Record<string, any> | undefined): void {
    if (isPaginationMeta(meta)) {
      this.paginationSignal.set(meta);
    } else {
      this.paginationSignal.set(null);
    }
  }

  fetchCourses(filters?: CourseFilters): Observable<Course[]> {
    this.loadingSignal.set(true);
    this.filtersSignal.set(filters || {});

    // Backend returns data as an array directly, not wrapped in { courses: [...] }
    return this.get<UdemyCourseRaw[]>(
      'course',
      this.buildFilterParams(filters)
    ).pipe(
      map((rawCourses) => {
        // Transform raw Udemy data to frontend format
        const adaptedCourses = rawCourses.map((raw) =>
          CourseAdapter.toFrontend(raw)
        );
        this.coursesSignal.set(adaptedCourses);
        return adaptedCourses;
      }),
      catchError((error) => {
        this.notificationService.error(
          'Failed to load courses. Please try again.'
        );
        this.coursesSignal.set([]);
        return of([]);
      }),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  getCourseById(courseId: string): Observable<Course> {
    this.loadingSignal.set(true);

    return this.get<UdemyCourseRaw>(`course/${courseId}`).pipe(
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

  searchCourses(
    searchTerm: string,
    additionalFilters?: CourseFilters
  ): Observable<Course[]> {
    const filters: CourseFilters = {
      ...additionalFilters,
      search: searchTerm,
    };
    return this.fetchCourses(filters);
  }

  trackCourseClick(courseId: string): Observable<void> {
    // TODO: Backend endpoint not ready yet - returning empty observable for now
    console.log('Track course click called for:', courseId);
    return of(void 0);

    // Uncomment when backend implements the endpoint:
    // return this.post<void>(`course/${courseId}/click`, {}).pipe(
    //   catchError((error) => {
    //     console.warn('Failed to track course click', error);
    //     return of(void 0);
    //   })
    // );
  }

  updateFilters(filters: Partial<CourseFilters>): void {
    this.filtersSignal.update((current) => ({ ...current, ...filters }));
    this.fetchCourses(this.filtersSignal()).subscribe();
  }

  clearFilters(): void {
    this.filtersSignal.set({
      sortBy: 'numSubscribers',
      sortOrder: 'desc',
      page: 1,
    });
  }

  goToPage(page: number): void {
    const currentFilters = this.filtersSignal();
    this.fetchCourses({ ...currentFilters, page }).subscribe();
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

    return params;
  }
}
