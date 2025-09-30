export interface UdemyCourseRaw {
  courseId: string;
  courseTitle: string;
  url: string;
  isPaid: boolean;
  price: number;
  numSubscribers: number;
  numReviews: number;
  numLectures: number;
  level: string; // "All Levels", "Beginner", "Intermediate", "Advanced", "Expert"
  contentDuration: number; // en heures
  publishedTimestamp: string; // ISO date
}

export interface Course {
  // Direct mapping (renamed for consistency)
  id: string;                    // courseId
  title: string;                 // courseTitle
  url: string;
  isPaid: boolean;
  price: number;
  numSubscribers: number;
  numReviews: number;
  numLectures: number;
  level: string
  contentDuration: number;
  publishedTimestamp: string;

  imageUrl: string;
  technologies: string[];
  platform: 'udemy';
}

export class CourseAdapter {
  static toFrontend(raw: UdemyCourseRaw): Course {
    return {
      // Direct rename
      id: raw.courseId,
      title: raw.courseTitle,
      url: raw.url,
      isPaid: raw.isPaid,
      price: raw.price,
      numSubscribers: raw.numSubscribers,
      numReviews: raw.numReviews,
      numLectures: raw.numLectures,
      level: raw.level,
      contentDuration: raw.contentDuration,
      publishedTimestamp: raw.publishedTimestamp,

      imageUrl: this.generateImageUrl(raw.courseTitle, raw.courseId),
      technologies: this.extractTechnologies(raw.courseTitle),
      platform: 'udemy',
    };
  }

  private static generateImageUrl(title: string, courseId: string): string {
    const techs = this.extractTechnologies(title);
    const mainTech = techs[0]?.toLowerCase() || 'default';

    // Simple hash pour varier les images
    const hash = parseInt(courseId, 10) || 0;
    const imageIndex = (hash % 5) + 1; // 5 images par techno

    return `/assets/images/courses/${mainTech}-${imageIndex}.jpg`;
  }

  private static extractTechnologies(title: string): string[] {
    const techKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node',
      'Python', 'Django', 'Java', 'C#', 'PHP', 'Ruby', 'Go',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git'
    ];

    const found: string[] = [];
    const lowerTitle = title.toLowerCase();

    for (const tech of techKeywords) {
      if (lowerTitle.includes(tech.toLowerCase())) {
        found.push(tech);
      }
    }

    return found.length > 0 ? found : ['Programming'];
  }
}

export interface CourseFilters {
  search?: string;
  level?: string | string[];
  isPaid?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: CourseSortOption;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export type CourseSortOption =
  | 'courseTitle'
  | 'price'
  | 'numReviews'
  | 'numSubscribers'
  | 'contentDuration'
  | 'publishedTimestamp';

export interface CourseListResponse {
  courses: UdemyCourseRaw[];
}

export class CourseHelpers {
  static formatDuration(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    return `${hours.toFixed(1)}h`;
  }

  static formatPrice(price: number, isPaid: boolean): string {
    return !isPaid || price === 0 ? 'Free' : `$${price}`;
  }

  static getLevelBadgeClass(level: string): string {
    const normalized = level.toLowerCase();
    if (normalized.includes('beginner')) return 'beginner';
    if (normalized.includes('intermediate')) return 'intermediate';
    if (normalized.includes('advanced') || normalized.includes('expert')) return 'advanced';
    return 'all-levels';
  }
}
