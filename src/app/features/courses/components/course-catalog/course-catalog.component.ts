import { Component, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../../core/models/course.model';
import { Router } from '@angular/router';
import { PlatformBadgeComponent } from '../platform-badge/platform-badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { DifficultyBadgeComponent } from '../difficulty-badge/difficulty-badge.component';


interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-catalog',
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
  searchQuery = signal('');
  sortBy = signal('mostPopular');
  selectedPlatform = signal('all');
  selectedDifficulty = signal('all');
  selectedPrice = signal('any');
  filtersExpanded = signal(false);

  sortDropdownOpen = signal(false);
  platformDropdownOpen = signal(false);
  difficultyDropdownOpen = signal(false);
  priceDropdownOpen = signal(false);

  courses = signal<Course[]>([]);
  loading = signal(false);

  sortOptions: FilterOption[] = [
    { value: 'mostPopular', label: 'Most Popular' },
    { value: 'highestRated', label: 'Highest Rated' },
    { value: 'recentlyUpdated', label: 'Recently Updated' },
    { value: 'priceLowToHigh', label: 'Price: Low to High' },
    { value: 'priceHighToLow', label: 'Price: High to Low' }
  ];

  platforms: FilterOption[] = [
    { value: 'all', label: 'All Platforms' },
    { value: 'udemy', label: 'Udemy' },
    { value: 'coursera', label: 'Coursera' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'freecodecamp', label: 'freeCodeCamp' }
  ];

  difficulties: FilterOption[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  priceRanges: FilterOption[] = [
    { value: 'any', label: 'Any Price' },
    { value: 'free', label: 'Free Only' },
    { value: 'paid', label: 'Paid Only' },
    { value: 'under50', label: 'Under $50' },
    { value: 'under100', label: 'Under $100' }
  ];

  // Computed values
  totalCourses = computed(() => this.courses().length);
  hasOpenDropdown = computed(() =>
    this.sortDropdownOpen() ||
    this.platformDropdownOpen() ||
    this.difficultyDropdownOpen() ||
    this.priceDropdownOpen()
  );

  filteredCourses = computed(() => {
    let filtered = [...this.courses()];
    const query = this.searchQuery().toLowerCase();

    // Apply search filter
    if (query) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Apply platform filter
    if (this.selectedPlatform() !== 'all') {
      filtered = filtered.filter(course =>
        course.platform.toLowerCase() === this.selectedPlatform()
      );
    }

    // Apply difficulty filter
    if (this.selectedDifficulty() !== 'all') {
      filtered = filtered.filter(course =>
        course.difficulty.toLowerCase() === this.selectedDifficulty()
      );
    }

    // Apply price filter
    const priceFilter = this.selectedPrice();
    if (priceFilter !== 'any') {
      filtered = filtered.filter(course => {
        switch (priceFilter) {
          case 'free': return course.price === 0;
          case 'paid': return course.price > 0;
          case 'under50': return course.price < 50;
          case 'under100': return course.price < 100;
          default: return true;
        }
      });
    }

    // Apply sorting
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'highestRated':
          return b.rating - a.rating;
        case 'recentlyUpdated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'priceLowToHigh':
          return a.price - b.price;
        case 'priceHighToLow':
          return b.price - a.price;
        case 'mostPopular':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });

    return filtered;
  });

  private clickListener?: (event: Event) => void;

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

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
    this.loading.set(true);
    this.mockDataService.getCourses().subscribe({
      next: (response) => {
        this.courses.set(response.courses);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading.set(false);
      }
    });
  }

  // Search methods
  onSearchChange() {
    // Filtering is handled by computed property
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  // Dropdown methods
  toggleSortDropdown() {
    this.sortDropdownOpen.update(open => !open);
    if (this.sortDropdownOpen()) {
      this.platformDropdownOpen.set(false);
      this.difficultyDropdownOpen.set(false);
      this.priceDropdownOpen.set(false);
    }
  }

  togglePlatformDropdown() {
    this.platformDropdownOpen.update(open => !open);
    if (this.platformDropdownOpen()) {
      this.sortDropdownOpen.set(false);
      this.difficultyDropdownOpen.set(false);
      this.priceDropdownOpen.set(false);
    }
  }

  toggleDifficultyDropdown() {
    this.difficultyDropdownOpen.update(open => !open);
    if (this.difficultyDropdownOpen()) {
      this.sortDropdownOpen.set(false);
      this.platformDropdownOpen.set(false);
      this.priceDropdownOpen.set(false);
    }
  }

  togglePriceDropdown() {
    this.priceDropdownOpen.update(open => !open);
    if (this.priceDropdownOpen()) {
      this.sortDropdownOpen.set(false);
      this.platformDropdownOpen.set(false);
      this.difficultyDropdownOpen.set(false);
    }
  }

  closeAllDropdowns() {
    this.sortDropdownOpen.set(false);
    this.platformDropdownOpen.set(false);
    this.difficultyDropdownOpen.set(false);
    this.priceDropdownOpen.set(false);
  }

  // Selection handlers
  selectSortOption(option: string) {
    this.sortBy.set(option);
    this.sortDropdownOpen.set(false);
  }

  selectPlatform(platform: string) {
    this.selectedPlatform.set(platform);
    this.platformDropdownOpen.set(false);
  }

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty.set(difficulty);
    this.difficultyDropdownOpen.set(false);
  }

  selectPrice(price: string) {
    this.selectedPrice.set(price);
    this.priceDropdownOpen.set(false);
  }

  // Filter toggle methods
  toggleFilters() {
    this.filtersExpanded.update(expanded => !expanded);
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  // Clear filter methods
  clearAllFilters() {
    this.searchQuery.set('');
    this.selectedPlatform.set('all');
    this.selectedDifficulty.set('all');
    this.selectedPrice.set('any');
    this.sortBy.set('mostPopular');
  }

  getSelectedOptionLabel(options: FilterOption[], selectedValue: string): string {
    const option = options.find(opt => opt.value === selectedValue);
    return option ? option.label : '';
  }
}
