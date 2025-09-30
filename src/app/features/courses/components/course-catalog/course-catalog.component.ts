// course-catalog.component.ts
import {
  Component,
  OnInit,
  inject,
  signal,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import {
  Course,
  CourseFilters,
  CourseSortOption,
} from '../../../../core/models/course.model';

interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-course-catalog',
  templateUrl: './course-catalog.component.html',
  styleUrl: './course-catalog.component.scss',
  imports: [FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCatalogComponent implements OnInit, OnDestroy {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private searchDebounceTimer?: number;

  // Local UI state
  searchQuery = signal('');
  sortBy = signal<CourseSortOption>('numSubscribers');
  selectedDifficulty = signal('all');
  selectedPrice = signal('any');
  filtersExpanded = signal(false);

  // Dropdown states
  sortDropdownOpen = signal(false);
  difficultyDropdownOpen = signal(false);
  priceDropdownOpen = signal(false);

  // Course data
  courses = signal<Course[]>([]);
  loading = signal(false);
  pagination = signal({
    currentPage: 1,
    totalPages: 1,
    pageSize: 24,
    totalItems: 0,
  });

  sortOptions: FilterOption[] = [
    { value: 'numSubscribers', label: 'Most Popular' },
    { value: 'numReviews', label: 'Most Reviewed' },
    { value: 'publishedTimestamp', label: 'Recently Added' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'contentDuration', label: 'Duration' },
  ];

  difficulties: FilterOption[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  priceRanges: FilterOption[] = [
    { value: 'any', label: 'Any Price' },
    { value: 'free', label: 'Free Only' },
    { value: 'paid', label: 'Paid Only' },
  ];

  ngOnInit() {
    this.loadCourses();
    this.setupGlobalClickListener();
  }

  ngOnDestroy() {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

  private clickListener?: (event: Event) => void;

  private setupGlobalClickListener() {
    this.clickListener = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-select')) {
        this.closeAllDropdowns();
      }
    };
    document.addEventListener('click', this.clickListener);
  }

  private loadCourses() {
    this.loading.set(true);
    const filters = this.buildFilters();

    this.courseService.getAllCourses(filters).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          // Direct array response
          this.courses.set(response);
        } else if (
          response &&
          typeof response === 'object' &&
          'courses' in response
        ) {
          // Response with courses property and possibly pagination
          const data = response as { courses: Course[]; pagination?: any };
          this.courses.set(data.courses || []);

          if (data.pagination) {
            this.pagination.set({
              currentPage: data.pagination.currentPage || 1,
              totalPages: data.pagination.totalPages || 1,
              pageSize: data.pagination.pageSize || 24,
              totalItems: data.pagination.totalItems || 0,
            });
          }
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading.set(false);
      },
    });
  }

  loadPage(page: number) {
    this.pagination.update((current) => ({
      ...current,
      currentPage: page,
    }));
    this.loadCourses();
  }

  getPaginationArray(): number[] {
    const total = this.pagination().totalPages;
    const current = this.pagination().currentPage;

    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    if (current <= 3) return [1, 2, 3, 4, 5];
    if (current >= total - 2)
      return [total - 4, total - 3, total - 2, total - 1, total];

    return [current - 2, current - 1, current, current + 1, current + 2];
  }

  private buildFilters(): CourseFilters {
    const filters: CourseFilters = {
      sortBy: this.sortBy(),
      sortOrder: 'desc',
      page: this.pagination().currentPage,
      limit: this.pagination().pageSize,
    };

    const search = this.searchQuery().trim();
    if (search) {
      filters.search = search;
    }

    if (this.selectedDifficulty() !== 'all') {
      filters.level = this.selectedDifficulty();
    }

    const priceFilter = this.selectedPrice();
    if (priceFilter === 'free') {
      filters.isPaid = false;
    } else if (priceFilter === 'paid') {
      filters.isPaid = true;
    }

    return filters;
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = window.setTimeout(() => {
      this.pagination.update((current) => ({
        ...current,
        currentPage: 1,
      }));
      this.loadCourses();
    }, 500);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.loadCourses();
  }

  toggleSortDropdown() {
    this.sortDropdownOpen.update((open) => !open);
    if (this.sortDropdownOpen()) {
      this.closeOtherDropdowns('sort');
    }
  }

  toggleDifficultyDropdown() {
    this.difficultyDropdownOpen.update((open) => !open);
    if (this.difficultyDropdownOpen()) {
      this.closeOtherDropdowns('difficulty');
    }
  }

  togglePriceDropdown() {
    this.priceDropdownOpen.update((open) => !open);
    if (this.priceDropdownOpen()) {
      this.closeOtherDropdowns('price');
    }
  }

  private closeOtherDropdowns(except: string) {
    if (except !== 'sort') this.sortDropdownOpen.set(false);
    if (except !== 'difficulty') this.difficultyDropdownOpen.set(false);
    if (except !== 'price') this.priceDropdownOpen.set(false);
  }

  closeAllDropdowns() {
    this.sortDropdownOpen.set(false);
    this.difficultyDropdownOpen.set(false);
    this.priceDropdownOpen.set(false);
  }

  selectSortOption(option: string) {
    this.sortBy.set(option as CourseSortOption);
    this.sortDropdownOpen.set(false);
    this.pagination.update((current) => ({
      ...current,
      currentPage: 1,
    }));
    this.loadCourses();
  }

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty.set(difficulty);
    this.difficultyDropdownOpen.set(false);
    this.pagination.update((current) => ({
      ...current,
      currentPage: 1,
    }));
    this.loadCourses();
  }

  selectPrice(price: string) {
    this.selectedPrice.set(price);
    this.priceDropdownOpen.set(false);
    this.pagination.update((current) => ({
      ...current,
      currentPage: 1,
    }));
    this.loadCourses();
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  toggleFilters() {
    this.filtersExpanded.update((expanded) => !expanded);
  }

  clearAllFilters() {
    this.searchQuery.set('');
    this.selectedDifficulty.set('all');
    this.selectedPrice.set('any');
    this.sortBy.set('numSubscribers');
    this.pagination.update((current) => ({
      ...current,
      currentPage: 1,
    }));
    this.loadCourses();
  }

  getSelectedOptionLabel(
    options: FilterOption[],
    selectedValue: string
  ): string {
    const option = options.find((opt) => opt.value === selectedValue);
    return option ? option.label : '';
  }

  hasActiveFilters(): boolean {
    return (
      this.searchQuery().trim() !== '' ||
      this.selectedDifficulty() !== 'all' ||
      this.selectedPrice() !== 'any'
    );
  }
}
