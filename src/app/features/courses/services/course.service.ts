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
    return Object.keys(filters).some((key) => {
      const value = filters[key as keyof CourseFilters];
      // Ignore default sorting values
      if (key === 'sortBy' && value === 'numSubscribers') return false;
      if (key === 'sortOrder' && value === 'desc') return false;
      if (key === 'page' && value === 1) return false;
      return value !== undefined;
    });
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

    // Update filters if provided
    if (filters) {
      this.filtersSignal.set(filters);
    }

    const currentFilters = this.filtersSignal();
    const params = this.buildFilterParams(currentFilters);

    console.log('🔍 Fetching courses with params:', params);

    // Backend returns data as an array directly, not wrapped in { courses: [...] }
    return this.get<UdemyCourseRaw[]>('course', params).pipe(
      map((rawCourses) => {
        console.log('✅ Received courses:', rawCourses.length);

        // Transform raw Udemy data to frontend format
        const adaptedCourses = rawCourses.map((raw) =>
          CourseAdapter.toFrontend(raw)
        );

        // Apply frontend filtering if needed
        const filteredCourses = this.applyFrontendFilters(
          adaptedCourses,
          currentFilters
        );

        this.coursesSignal.set(filteredCourses);
        return filteredCourses;
      }),
      catchError((error) => {
        console.error('❌ Error fetching courses:', error);
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
    console.log('📊 Track course click:', courseId);
    return of(void 0);

    // Uncomment when backend implements the endpoint:
    // return this.post<void>(`course/${courseId}/click`, {}).pipe(
    //   catchError((error) => {
    //     console.warn('Failed to track course click', error);
    //     return of(void 0);
    //   })
    // );
  }

  updateFilters(filters: Partial<CourseFilters>): Observable<Course[]> {
    const currentFilters = this.filtersSignal();
    const newFilters = { ...currentFilters, ...filters };

    console.log('🔄 Updating filters:', filters);
    console.log('📝 New filters state:', newFilters);

    return this.fetchCourses(newFilters);
  }

  clearFilters(): void {
    console.log('🧹 Clearing filters');
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

  /**
   * Apply additional frontend filters that backend might not support
   */
  private applyFrontendFilters(
    courses: Course[],
    filters: CourseFilters
  ): Course[] {
    let filtered = [...courses];

    // Frontend search if backend doesn't handle it
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchLower)
      );
    }

    // Frontend level filter if backend doesn't handle it
    if (filters.level) {
      const levelFilter = Array.isArray(filters.level)
        ? filters.level
        : [filters.level];
      filtered = filtered.filter((course) =>
        levelFilter.some(
          (level) => course.level.toLowerCase() === level.toLowerCase()
        )
      );
    }

    // Frontend price filters if backend doesn't handle them
    if (filters.isPaid !== undefined) {
      filtered = filtered.filter((course) => course.isPaid === filters.isPaid);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((course) => course.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((course) => course.price <= filters.maxPrice!);
    }

    // Frontend sorting
    if (filters.sortBy) {
      const sortKey = filters.sortBy;
      const sortOrder = filters.sortOrder || 'desc';

      filtered.sort((a, b) => {
        let aVal = a[sortKey as keyof Course];
        let bVal = b[sortKey as keyof Course];

        // Handle string comparisons
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }

  private buildFilterParams(filters?: CourseFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    // Only send params that the backend can handle
    // Comment out params that should be handled frontend-only

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
