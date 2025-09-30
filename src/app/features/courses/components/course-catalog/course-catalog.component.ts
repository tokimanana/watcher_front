import { Component, signal, OnInit, computed, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseFilters } from '../../../../core/models/course.model';
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
    DifficultyBadgeComponent
  ],
  templateUrl: './course-catalog.component.html',
  styleUrl: './course-catalog.component.scss'
})
export class CourseCatalogComponent implements OnInit, OnDestroy {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  // Local UI state
  searchQuery = signal('');
  sortBy = signal('numSubscribers'); // Backend sort field
  selectedPlatform = signal('all');
  selectedDifficulty = signal('all');
  selectedPrice = signal('any');
  filtersExpanded = signal(false);

  // Dropdown states
  sortDropdownOpen = signal(false);
  platformDropdownOpen = signal(false);
  difficultyDropdownOpen = signal(false);
  priceDropdownOpen = signal(false);

  // Service signals
  readonly courses = this.courseService.courses;
  readonly loading = this.courseService.loading;
  readonly totalCourses = this.courseService.totalCourses;
  readonly pagination = this.courseService.pagination;
  readonly filteredCourses = this.courses;

  // Filter options
  sortOptions: FilterOption[] = [
    { value: 'numSubscribers', label: 'Most Popular' },
    { value: 'numReviews', label: 'Most Reviewed' },
    { value: 'publishedTimestamp', label: 'Recently Added' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'contentDuration', label: 'Duration' }
  ];

  platforms: FilterOption[] = [
    { value: 'all', label: 'All Platforms' },
    { value: 'udemy', label: 'Udemy' }
  ];

  difficulties: FilterOption[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'All Levels', label: 'All Levels' }
  ];

  priceRanges: FilterOption[] = [
    { value: 'any', label: 'Any Price' },
    { value: 'free', label: 'Free Only' },
    { value: 'paid', label: 'Paid Only' }
  ];

  private clickListener?: (event: Event) => void;
  private searchDebounceTimer?: number;

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
      sortOrder: 'desc',
      limit: 24
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

  onSearchChange() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = window.setTimeout(() => {
      this.loadCourses();
    }, 500);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.loadCourses();
  }

  toggleSortDropdown() {
    this.sortDropdownOpen.update(open => !open);
    if (this.sortDropdownOpen()) {
      this.closeOtherDropdowns('sort');
    }
  }

  togglePlatformDropdown() {
    this.platformDropdownOpen.update(open => !open);
    if (this.platformDropdownOpen()) {
      this.closeOtherDropdowns('platform');
    }
  }

  toggleDifficultyDropdown() {
    this.difficultyDropdownOpen.update(open => !open);
    if (this.difficultyDropdownOpen()) {
      this.closeOtherDropdowns('difficulty');
    }
  }

  togglePriceDropdown() {
    this.priceDropdownOpen.update(open => !open);
    if (this.priceDropdownOpen()) {
      this.closeOtherDropdowns('price');
    }
  }

  private closeOtherDropdowns(except: string) {
    if (except !== 'sort') this.sortDropdownOpen.set(false);
    if (except !== 'platform') this.platformDropdownOpen.set(false);
    if (except !== 'difficulty') this.difficultyDropdownOpen.set(false);
    if (except !== 'price') this.priceDropdownOpen.set(false);
  }

  closeAllDropdowns() {
    this.sortDropdownOpen.set(false);
    this.platformDropdownOpen.set(false);
    this.difficultyDropdownOpen.set(false);
    this.priceDropdownOpen.set(false);
  }

  selectSortOption(option: string) {
    this.sortBy.set(option);
    this.sortDropdownOpen.set(false);
    this.loadCourses();
  }

  selectPlatform(platform: string) {
    this.selectedPlatform.set(platform);
    this.platformDropdownOpen.set(false);
    // Platform filter not needed for now (only Udemy)
  }

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty.set(difficulty);
    this.difficultyDropdownOpen.set(false);
    this.loadCourses();
  }

  selectPrice(price: string) {
    this.selectedPrice.set(price);
    this.priceDropdownOpen.set(false);
    this.loadCourses();
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  toggleFilters() {
    this.filtersExpanded.update(expanded => !expanded);
  }

  clearAllFilters() {
    this.searchQuery.set('');
    this.selectedPlatform.set('all');
    this.selectedDifficulty.set('all');
    this.selectedPrice.set('any');
    this.sortBy.set('numSubscribers');
    this.loadCourses();
  }

  getSelectedOptionLabel(options: FilterOption[], selectedValue: string): string {
    const option = options.find(opt => opt.value === selectedValue);
    return option ? option.label : '';
  }

  hasActiveFilters(): boolean {
    return (
      this.searchQuery().trim() !== '' ||
      this.selectedPlatform() !== 'all' ||
      this.selectedDifficulty() !== 'all' ||
      this.selectedPrice() !== 'any'
    );
  }
}
