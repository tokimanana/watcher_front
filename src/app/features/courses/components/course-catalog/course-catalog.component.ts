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
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
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
  private readonly searchSubject$ = new Subject<string>();
  private clickListener?: (event: Event) => void;

  // UI State
  readonly localSearchQuery = signal('');
  readonly filtersExpanded = signal(false);
  readonly currentPageIndex = signal(0);
  readonly itemsPerPage = signal(12);

  // Dropdown States
  readonly sortDropdownOpen = signal(false);
  readonly levelDropdownOpen = signal(false);
  readonly priceDropdownOpen = signal(false);

  // Service State (readonly references)
  readonly courses = this.courseService.courses;
  readonly loading = this.courseService.loading;
  readonly activeFilters = this.courseService.activeFilters;

  // Filter Options
  readonly sortOptions: FilterOption[] = [
    { value: 'numSubscribers', label: 'Most Popular' },
    { value: 'numReviews', label: 'Most Reviewed' },
    { value: 'publishedTimestamp', label: 'Recently Added' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'contentDuration', label: 'Duration: Short to Long' },
  ];

  readonly levels: FilterOption[] = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'All Levels', label: 'All Levels' },
  ];

  readonly priceRanges: FilterOption[] = [
    { value: 'any', label: 'Any Price' },
    { value: 'free', label: 'Free Only' },
    { value: 'paid', label: 'Paid Only' },
    { value: 'under50', label: 'Under $50' },
    { value: 'under100', label: 'Under $100' },
  ];

  // Computed Values
  readonly totalCourses = computed(() => this.courses().length);

  readonly paginatedCourses = computed(() => {
    const allCourses = this.courses();
    const page = this.currentPageIndex();
    const perPage = this.itemsPerPage();
    const start = page * perPage;
    return allCourses.slice(start, start + perPage);
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.courses().length / this.itemsPerPage())
  );

  readonly visiblePages = computed(() => {
    const current = this.currentPageIndex();
    const total = this.totalPages();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 0; i < total; i++) pages.push(i);
      return pages;
    }

    pages.push(0);
    if (current > 2) pages.push('...');

    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push('...');
    if (total > 1) pages.push(total - 1);

    return pages;
  });

  readonly hasActiveFilters = computed(() => {
    const f = this.activeFilters();
    return !!(
      f.search ||
      f.level ||
      f.isPaid !== undefined ||
      f.minPrice ||
      f.maxPrice
    );
  });

  ngOnInit(): void {
    this.setupClickListener();
    this.setupSearchDebounce();
    this.loadCourses();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialization
  private setupClickListener(): void {
    this.clickListener = (e: Event) => {
      if (!(e.target as HTMLElement).closest('.custom-select')) {
        this.closeAllDropdowns();
      }
    };
    document.addEventListener('click', this.clickListener);
  }

  private setupSearchDebounce(): void {
    this.searchSubject$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.updateFilter({ search: term || undefined });
        this.currentPageIndex.set(0);
      });
  }

  private loadCourses(): void {
    this.courseService
      .fetchCourses()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  // Helper to update filters
  private updateFilter(filter: any): void {
    this.courseService
      .updateFilters(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  // Search
  onSearchChange(): void {
    this.searchSubject$.next(this.localSearchQuery().trim());
  }

  clearSearch(): void {
    this.localSearchQuery.set('');
    this.searchSubject$.next('');
  }

  // Dropdown Controls
  toggleSortDropdown(): void {
    this.sortDropdownOpen.update((v) => !v);
    if (this.sortDropdownOpen()) {
      this.levelDropdownOpen.set(false);
      this.priceDropdownOpen.set(false);
    }
  }

  toggleLevelDropdown(): void {
    this.levelDropdownOpen.update((v) => !v);
    if (this.levelDropdownOpen()) {
      this.sortDropdownOpen.set(false);
      this.priceDropdownOpen.set(false);
    }
  }

  togglePriceDropdown(): void {
    this.priceDropdownOpen.update((v) => !v);
    if (this.priceDropdownOpen()) {
      this.sortDropdownOpen.set(false);
      this.levelDropdownOpen.set(false);
    }
  }

  closeAllDropdowns(): void {
    this.sortDropdownOpen.set(false);
    this.levelDropdownOpen.set(false);
    this.priceDropdownOpen.set(false);
  }

  toggleFilters(): void {
    this.filtersExpanded.update((v) => !v);
  }

  // Filter Selections
  selectSortOption(option: string): void {
    this.updateFilter({
      sortBy: option,
      sortOrder: option === 'price' ? 'asc' : 'desc',
    });
    this.sortDropdownOpen.set(false);
    this.currentPageIndex.set(0);
  }

  selectLevel(level: string): void {
    const current = this.getCurrentLevelValue();
    this.updateFilter({ level: current === level ? undefined : level });
    this.levelDropdownOpen.set(false);
    this.currentPageIndex.set(0);
  }

  selectPrice(price: string): void {
    const updates: any = {
      minPrice: undefined,
      maxPrice: undefined,
      isPaid: undefined,
    };

    switch (price) {
      case 'free':
        updates.isPaid = false;
        break;
      case 'paid':
        updates.isPaid = true;
        break;
      case 'under50':
        updates.maxPrice = 50;
        break;
      case 'under100':
        updates.maxPrice = 100;
        break;
    }

    this.updateFilter(updates);
    this.priceDropdownOpen.set(false);
    this.currentPageIndex.set(0);
  }

  clearAllFilters(): void {
    this.localSearchQuery.set('');
    this.currentPageIndex.set(0);
    this.courseService.clearFilters();
    this.loadCourses();
  }

  // Navigation
  navigateToCourse(courseId: string): void {
    this.courseService.trackCourseClick(courseId).subscribe();
    this.router.navigate(['/courses', courseId]);
  }

  // Pagination
  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPageIndex.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPageIndex() < this.totalPages() - 1) {
      this.goToPage(this.currentPageIndex() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPageIndex() > 0) {
      this.goToPage(this.currentPageIndex() - 1);
    }
  }

  isPageNumber(page: number | string): page is number {
    return typeof page === 'number';
  }

  // Helpers
  getSelectedOptionLabel(options: FilterOption[], value: string): string {
    return options.find((opt) => opt.value === value)?.label || '';
  }

  getCurrentSortValue(): string {
    return this.activeFilters().sortBy || 'numSubscribers';
  }

  getCurrentLevelValue(): string | undefined {
    const level = this.activeFilters().level;
    return level ? (Array.isArray(level) ? level[0] : level) : undefined;
  }

  getCurrentPriceValue(): string {
    const f = this.activeFilters();
    if (f.isPaid === false) return 'free';
    if (f.isPaid === true) return 'paid';
    if (f.maxPrice === 50) return 'under50';
    if (f.maxPrice === 100) return 'under100';
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
