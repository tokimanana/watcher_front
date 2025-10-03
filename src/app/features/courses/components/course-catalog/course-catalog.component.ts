import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CourseHelpers } from '../../../../core/models/course.model';
import { CourseService } from '../../services/course.service';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';
import { DifficultyBadgeComponent } from '../difficulty-badge/difficulty-badge.component';

interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PlatformBadgeComponent,
    DifficultyBadgeComponent,
  ],
  templateUrl: './course-catalog.component.html',
  styleUrl: './course-catalog.component.scss',
})
export class CourseCatalogComponent implements OnInit, OnDestroy {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // Local UI state
  localSearchQuery = signal('');
  filtersExpanded = signal(false);
  currentPageIndex = signal(0);
  itemsPerPage = signal(12);

  // Dropdown states
  sortDropdownOpen = signal(false);
  levelDropdownOpen = signal(false);
  priceDropdownOpen = signal(false);

  // Service state
  courses = this.courseService.courses;
  loading = this.courseService.loading;
  pagination = this.courseService.pagination;
  activeFilters = this.courseService.activeFilters;

  // Filter options
  sortOptions: FilterOption[] = [
    { value: 'numSubscribers', label: 'Most Popular' },
    { value: 'numReviews', label: 'Most Reviewed' },
    { value: 'publishedTimestamp', label: 'Recently Added' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'contentDuration', label: 'Duration: Short to Long' },
  ];

  levels: FilterOption[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'All Levels', label: 'All Levels (Udemy)' },
  ];

  priceRanges: FilterOption[] = [
    { value: 'any', label: 'Any Price' },
    { value: 'free', label: 'Free Only' },
    { value: 'paid', label: 'Paid Only' },
    { value: 'under50', label: 'Under $50' },
    { value: 'under100', label: 'Under $100' },
  ];

  // Computed
  totalCourses = computed(
    () => this.pagination()?.total ?? this.courses().length
  );

  paginatedCourses = computed(() => {
    const allCourses = this.courses();
    const page = this.currentPageIndex();
    const perPage = this.itemsPerPage();
    const start = page * perPage;
    const end = start + perPage;
    return allCourses.slice(start, end);
  });

  totalPagesComputed = computed(() =>
    Math.ceil(this.courses().length / this.itemsPerPage())
  );

  hasActiveFilters = computed(() => {
    const filters = this.activeFilters();
    return !!(
      filters.search ||
      filters.level ||
      filters.isPaid !== undefined ||
      filters.minPrice ||
      filters.maxPrice
    );
  });

  private clickListener?: (event: Event) => void;

  ngOnInit() {
    this.setupGlobalClickListener();
    this.loadInitialCourses();
  }

  ngOnDestroy() {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialCourses(): void {
    this.courseService
      .fetchCourses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (courses) => {
          console.log('Courses loaded successfully:', courses.length);
        },
        error: (error) => {
          console.error('Error loading courses:', error);
        },
      });
  }

  setupGlobalClickListener() {
    this.clickListener = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-select')) {
        this.closeAllDropdowns();
      }
    };
    document.addEventListener('click', this.clickListener);
  }

  // Search
  onSearchChange() {
    this.courseService.updateFilters({ search: this.localSearchQuery() });
    this.currentPageIndex.set(0);
  }

  clearSearch() {
    this.localSearchQuery.set('');
    this.courseService.updateFilters({ search: undefined });
    this.currentPageIndex.set(0);
  }

  // Dropdowns
  toggleSortDropdown() {
    this.sortDropdownOpen.update((open) => !open);
    if (this.sortDropdownOpen()) {
      this.levelDropdownOpen.set(false);
      this.priceDropdownOpen.set(false);
    }
  }

  toggleLevelDropdown() {
    this.levelDropdownOpen.update((open) => !open);
    if (this.levelDropdownOpen()) {
      this.sortDropdownOpen.set(false);
      this.priceDropdownOpen.set(false);
    }
  }

  togglePriceDropdown() {
    this.priceDropdownOpen.update((open) => !open);
    if (this.priceDropdownOpen()) {
      this.sortDropdownOpen.set(false);
      this.levelDropdownOpen.set(false);
    }
  }

  closeAllDropdowns() {
    this.sortDropdownOpen.set(false);
    this.levelDropdownOpen.set(false);
    this.priceDropdownOpen.set(false);
  }

  // Selections
  selectSortOption(option: string) {
    this.courseService.updateFilters({
      sortBy: option as any,
      sortOrder: option === 'price' ? 'asc' : 'desc',
    });
    this.sortDropdownOpen.set(false);
    this.currentPageIndex.set(0);
  }

  selectLevel(level: string) {
    this.courseService.updateFilters({
      level: level === 'all' ? undefined : level,
    });
    this.levelDropdownOpen.set(false);
    this.currentPageIndex.set(0);
  }

  selectPrice(price: string) {
    const updates: any = {
      minPrice: undefined,
      maxPrice: undefined,
      isPaid: undefined,
    };

    if (price === 'free') {
      updates.isPaid = false;
    } else if (price === 'paid') {
      updates.isPaid = true;
    } else if (price === 'under50') {
      updates.maxPrice = 50;
    } else if (price === 'under100') {
      updates.maxPrice = 100;
    }

    this.courseService.updateFilters(updates);
    this.priceDropdownOpen.set(false);
    this.currentPageIndex.set(0);
  }

  toggleFilters() {
    this.filtersExpanded.update((expanded) => !expanded);
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  clearAllFilters() {
    this.localSearchQuery.set('');
    this.currentPageIndex.set(0);
    this.courseService.clearFilters();
    // Explicitly reload courses after clearing filters
    this.courseService
      .fetchCourses()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  // Pagination
  goToPage(page: number) {
    this.currentPageIndex.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage() {
    if (this.currentPageIndex() < this.totalPagesComputed() - 1) {
      this.goToPage(this.currentPageIndex() + 1);
    }
  }

  previousPage() {
    if (this.currentPageIndex() > 0) {
      this.goToPage(this.currentPageIndex() - 1);
    }
  }

  // Helpers
  getSelectedOptionLabel(
    options: FilterOption[],
    selectedValue: string
  ): string {
    const option = options.find((opt) => opt.value === selectedValue);
    return option ? option.label : '';
  }

  getCurrentSortValue(): string {
    return this.activeFilters().sortBy || 'numSubscribers';
  }

  getCurrentLevelValue(): string {
    const level = this.activeFilters().level;
    if (!level) return 'all';
    return Array.isArray(level) ? level[0] : level;
  }

  getCurrentPriceValue(): string {
    const filters = this.activeFilters();
    if (filters.isPaid === false) return 'free';
    if (filters.isPaid === true) return 'paid';
    if (filters.maxPrice === 50) return 'under50';
    if (filters.maxPrice === 100) return 'under100';
    return 'any';
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
}
