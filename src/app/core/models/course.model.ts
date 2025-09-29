// 1. RAW DATA (Backend exact format)
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

// 2. FRONTEND MODEL (Pour les composants)
export interface Course {
  // Mapped fields
  id: string;                    // courseId
  title: string;                 // courseTitle
  url: string;
  isPaid: boolean;
  price: number;

  // Computed/enriched fields
  imageUrl: string;              // Généré côté frontend
  instructor: string;            // Extrait ou "Udemy Instructor"
  technologies: string[];        // Extrait du titre
  difficulty: CourseDifficulty;  // Mappé depuis level
  rating: number;                // Estimé depuis reviews/subscribers
  reviewCount: number;           // numReviews
  duration: string;              // "4.5 hours" formaté

  // Original fields preserved
  numSubscribers: number;
  numLectures: number;
  level: string;                 // Original level string
  contentDuration: number;       // Original duration number

  // Metadata
  platform: 'udemy';             // Toujours udemy
  currency: string;              // USD par défaut
  clickCount: number;            // Tracking (local ou backend)
  createdAt: Date;               // publishedTimestamp converti
  updatedAt: Date;               // publishedTimestamp converti
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

// 3. ADAPTER - Transforme Raw → Frontend
export class CourseAdapter {
  static toFrontend(raw: UdemyCourseRaw): Course {
    return {
      // Direct mapping
      id: raw.courseId,
      title: raw.courseTitle,
      url: raw.url,
      isPaid: raw.isPaid,
      price: raw.price,
      reviewCount: raw.numReviews,
      numSubscribers: raw.numSubscribers,
      numLectures: raw.numLectures,
      level: raw.level,
      contentDuration: raw.contentDuration,

      // Computed fields
      imageUrl: this.generateImageUrl(raw.courseTitle, raw.courseId),
      instructor: this.extractInstructor(raw.courseTitle),
      technologies: this.extractTechnologies(raw.courseTitle),
      difficulty: this.mapDifficulty(raw.level),
      rating: this.estimateRating(raw.numReviews, raw.numSubscribers),
      duration: this.formatDuration(raw.contentDuration),

      // Defaults
      platform: 'udemy',
      currency: 'USD',
      clickCount: 0,
      createdAt: new Date(raw.publishedTimestamp),
      updatedAt: new Date(raw.publishedTimestamp),
    };
  }

  private static generateImageUrl(title: string, courseId: string): string {
    const techs = this.extractTechnologies(title);
    const mainTech = techs[0]?.toLowerCase() || 'programming';

    const imageMap: Record<string, string[]> = {
      javascript: [
        '/assets/images/courses/javascript-1.jpg',
        '/assets/images/courses/javascript-2.jpg',
        '/assets/images/courses/javascript-3.jpg',
      ],
      react: [
        '/assets/images/courses/react-1.jpg',
        '/assets/images/courses/react-2.jpg',
      ],
      angular: [
        '/assets/images/courses/angular-1.jpg',
        '/assets/images/courses/angular-2.jpg',
      ],
      python: [
        '/assets/images/courses/python-1.jpg',
        '/assets/images/courses/python-2.jpg',
      ],
      // ... autres technos
    };

    const images = imageMap[mainTech] || ['/assets/images/courses/default.jpg'];
    const hash = parseInt(courseId, 10) || 0;
    const index = hash % images.length;

    return images[index];
  }

  private static extractTechnologies(title: string): string[] {
    const techKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node',
      'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', 'ASP.NET',
      'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift',
      'Kotlin', 'Flutter', 'React Native', 'iOS', 'Android',
      'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind',
      'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git',
      'Machine Learning', 'AI', 'Data Science', 'DevOps'
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

  private static extractInstructor(title: string): string {
    const byPattern = /(?:by|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = title.match(byPattern);

    if (match && match[1]) {
      return match[1];
    }

    return 'Udemy Instructor';
  }

  private static mapDifficulty(level: string): CourseDifficulty {
    const normalized = level.toLowerCase();

    if (normalized.includes('beginner')) return 'beginner';
    if (normalized.includes('intermediate')) return 'intermediate';
    if (normalized.includes('advanced') || normalized.includes('expert')) return 'advanced';

    return 'all-levels';
  }

  /**
   * Estime un rating basé sur le ratio reviews/subscribers
   */
  private static estimateRating(numReviews: number, numSubscribers: number): number {
    if (numSubscribers === 0) return 0;

    const ratio = numReviews / numSubscribers;
    // Formule heuristique: plus de reviews = engagement = qualité
    const base = 3.5; // Rating minimum
    const bonus = Math.min(1.5, ratio * 20); // Max +1.5 points

    return Math.round((base + bonus) * 10) / 10; // Arrondi à 1 décimale
  }

  /**
   * Formate la durée en format lisible
   */
  private static formatDuration(hours: number): string {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min`;
    }
    if (hours === 1) {
      return '1 hour';
    }
    const rounded = Math.round(hours * 10) / 10;
    return `${rounded} hours`;
  }
}

// ==========================================
// 4. FILTERS & SORTING
// ==========================================
export interface CourseFilters {
  search?: string;
  level?: string | string[];
  isPaid?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  minSubscribers?: number;
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

// ==========================================
// 5. API RESPONSES
// ==========================================
export interface CourseListResponse {
  courses: UdemyCourseRaw[]; // Backend retourne raw
}

// ==========================================
// 6. CONSTANTS
// ==========================================
export const COURSE_LEVELS = [
  'All Levels',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
] as const;

export type CourseLevel = typeof COURSE_LEVELS[number];
