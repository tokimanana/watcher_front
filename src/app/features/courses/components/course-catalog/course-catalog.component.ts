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
import {
  Course,
  CourseFilters,
  CourseHelpers,
} from '../../../../core/models/course.model';
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
  readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  searchQuery = signal('');
  sortBy = signal<string>('numSubscribers');
  selectedLevel = signal('all');
  selectedPrice = signal('any');
  filtersExpanded = signal(false);

  sortDropdownOpen = signal(false);
  levelDropdownOpen = signal(false);
  priceDropdownOpen = signal(false);

  // Service state
  courses = this.courseService.courses;
  loading = this.courseService.loading;
  pagination = this.courseService.pagination;

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
    { value: 'All Levels', label: 'All Levels' },
  ];

  priceRanges: FilterOption[] = [
    { value: 'any', label: 'Any Price' },
    { value: 'free', label: 'Free Only' },
    { value: 'paid', label: 'Paid Only' },
    { value: 'under50', label: 'Under $50' },
    { value: 'under100', label: 'Under $100' },
  ];

  totalCourses = computed(
    () => this.pagination()?.total ?? this.courses().length
  );

  hasActiveFilters = computed(
    () =>
      this.searchQuery() !== '' ||
      this.selectedLevel() !== 'all' ||
      this.selectedPrice() !== 'any'
  );

  private clickListener?: (event: Event) => void;

  constructor() {}

  ngOnInit() {
    this.loadCourses();
    this.setupGlobalClickListener();
  }

  ngOnDestroy() {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
  }

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
    const filters = this.buildFilters();
    this.courseService.getAllCourses(filters).subscribe();
  }

  private buildFilters(): CourseFilters {
    const filters: CourseFilters = {
      sortBy: this.sortBy() as any,
      sortOrder: this.sortBy() === 'price' ? 'asc' : 'desc',
    };

    if (this.searchQuery()) {
      filters.search = this.searchQuery();
    }

    if (this.selectedLevel() !== 'all') {
      filters.level = this.selectedLevel();
    }

    const priceFilter = this.selectedPrice();
    if (priceFilter === 'free') {
      filters.isPaid = false;
    } else if (priceFilter === 'paid') {
      filters.isPaid = true;
    } else if (priceFilter === 'under50') {
      filters.maxPrice = 50;
    } else if (priceFilter === 'under100') {
      filters.maxPrice = 100;
    }

    return filters;
  }

  // Search methods
  onSearchChange() {
    this.loadCourses();
  }

  clearSearch() {
    this.searchQuery.set('');
    this.loadCourses();
  }

  // Dropdown methods
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

  // Selection handlers
  selectSortOption(option: string) {
    this.sortBy.set(option);
    this.sortDropdownOpen.set(false);
    this.loadCourses();
  }

  selectLevel(level: string) {
    this.selectedLevel.set(level);
    this.levelDropdownOpen.set(false);
    this.loadCourses();
  }

  selectPrice(price: string) {
    this.selectedPrice.set(price);
    this.priceDropdownOpen.set(false);
    this.loadCourses();
  }

  // Filter toggle
  toggleFilters() {
    this.filtersExpanded.update((expanded) => !expanded);
  }

  // Navigation
  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  // Clear filters
  clearAllFilters() {
    this.searchQuery.set('');
    this.selectedLevel.set('all');
    this.selectedPrice.set('any');
    this.sortBy.set('numSubscribers');
    this.loadCourses();
  }

  getSelectedOptionLabel(
    options: FilterOption[],
    selectedValue: string
  ): string {
    const option = options.find((opt) => opt.value === selectedValue);
    return option ? option.label : '';
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
