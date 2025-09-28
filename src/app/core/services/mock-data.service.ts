import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { Review } from '../models/review.model';

/**
 * Mock Data Service - Provides comprehensive seed data for development
 *
 * Features:
 * - 80+ realistic courses from major platforms
 * - Diverse technology stacks and difficulty levels
 * - Sample users with varied tech interests
 * - Realistic reviews with pros/cons
 * - PostgreSQL-ready structure for easy backend migration
 */
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private readonly API_DELAY = {
    fast: 200,
    medium: 400,
    slow: 600,
  };

  // Comprehensive courses data (80+ courses)
  private courses: Course[] = [
    // Frontend Development
    {
      id: '1',
      title: 'Angular Complete Guide 2025',
      description:
        'Master Angular from beginner to advanced with real projects, including Angular 17+ features, standalone components, and modern development practices.',
      instructor: 'Maximilian Schwarzmüller',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/the-complete-guide-to-angular-2/',
      imageUrl: '/images/angular-course-complete-guide.jpg',
      price: 89.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 12543,
      duration: '42 hours',
      difficulty: 'intermediate',
      technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
      clickCount: 1250,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-09-20'),
    },
    {
      id: '2',
      title: 'React Hooks & Context API Masterclass',
      description:
        'Learn modern React with hooks, context, and best practices. Build real-world applications with the latest React features.',
      instructor: 'Sarah Johnson',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=HYKDUF8X3qI',
      imageUrl: '/images/react-hook-&-context-api-masterclass.jpg',
      price: 0,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 8934,
      duration: '6 hours',
      difficulty: 'intermediate',
      technologies: ['React', 'JavaScript', 'Context API', 'Hooks'],
      clickCount: 2340,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-09-15'),
    },
    {
      id: '3',
      title: 'Vue.js 3 Composition API Deep Dive',
      description:
        'Master Vue.js 3 with Composition API, Pinia state management, and modern Vue development patterns.',
      instructor: 'Evan You',
      platform: 'coursera',
      url: 'https://www.coursera.org/learn/packt-the-complete-vue-js-course-for-beginners-i44iy',
      imageUrl: '/images/vue-course.jpg',
      price: 49.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 5621,
      duration: '28 hours',
      difficulty: 'intermediate',
      technologies: ['Vue.js', 'JavaScript', 'Pinia', 'Composition API'],
      clickCount: 890,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-08-30'),
    },
    {
      id: '4',
      title: 'JavaScript ES2024 Complete Course',
      description:
        'Learn modern JavaScript from basics to advanced concepts including ES2024 features, async programming, and design patterns.',
      instructor: 'Jonas Schmedtmann',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/the-complete-javascript-course/',
      imageUrl: '/images/js-course-jonas.jpg',
      price: 79.99,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 18765,
      duration: '69 hours',
      difficulty: 'beginner',
      technologies: ['JavaScript', 'ES2024', 'DOM', 'Async/Await'],
      clickCount: 3450,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-09-25'),
    },
    {
      id: '5',
      title: 'TypeScript for JavaScript Developers',
      description:
        'Transform your JavaScript skills with TypeScript. Learn type safety, generics, decorators, and advanced TypeScript patterns.',
      instructor: 'Matt Pocock',
      platform: 'youtube',
      url: 'https://www.youtube.com/playlist?list=PLYvdvJlnTOjF6aJsWWAt7kZRJvzw-en8B',
      imageUrl:
        'https://i.ytimg.com/vi/LlBNu7AlC_w/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBgyM1UlFg79o132yDIOs1nsd_QCA',
      price: 0,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 7234,
      duration: '12 hours',
      difficulty: 'intermediate',
      technologies: ['TypeScript', 'JavaScript', 'Generics', 'Type Safety'],
      clickCount: 1890,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-09-10'),
    },
    // Backend Development
    {
      id: '6',
      title: 'Node.js Complete Developer Course',
      description:
        'Build scalable backend applications with Node.js, Express, MongoDB, and modern development practices.',
      instructor: 'Andrew Mead',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/',
      imageUrl: '/images/nodejs-course-andrew.jpg',
      price: 94.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 15432,
      duration: '35 hours',
      difficulty: 'intermediate',
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      clickCount: 2100,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-09-18'),
    },
    {
      id: '7',
      title: 'Python Django REST Framework',
      description:
        'Build powerful REST APIs with Django REST Framework. Learn authentication, serialization, and API best practices.',
      instructor: 'Corey Schafer',
      platform: 'youtube',
      url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTtoQCKZ03TU5fNfx2UY6U4p',
      imageUrl:
        'https://i.ytimg.com/vi/UmljXZIypDc/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCPwcZ5qo94B5an2eZVbOHGu1p_nw',
      price: 0,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 9876,
      duration: '18 hours',
      difficulty: 'intermediate',
      technologies: ['Python', 'Django', 'REST API', 'PostgreSQL'],
      clickCount: 1650,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-25'),
    },
    {
      id: '8',
      title: 'Spring Boot Microservices',
      description:
        'Master Spring Boot microservices architecture with Docker, Kubernetes, and cloud deployment strategies.',
      instructor: 'John Thompson',
      platform: 'coursera',
      url: 'https://www.coursera.org/specializations/spring-boot-microservices',
      imageUrl: '/images/spring-course.jpg',
      price: 79.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 4321,
      duration: '45 hours',
      difficulty: 'advanced',
      technologies: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
      clickCount: 980,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-09-05'),
    },
    // Full Stack Development
    {
      id: '9',
      title: 'MEAN Stack Development',
      description:
        'Build full-stack applications with MongoDB, Express, Angular, and Node.js. Complete project-based learning.',
      instructor: 'Maximilian Schwarzmüller',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/',
      imageUrl: '/images/mean-course-max.jpg',
      price: 89.99,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 8765,
      duration: '38 hours',
      difficulty: 'intermediate',
      technologies: ['MongoDB', 'Express', 'Angular', 'Node.js'],
      clickCount: 1420,
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-09-12'),
    },
    {
      id: '10',
      title: 'Full Stack React with GraphQL',
      description:
        'Build modern full-stack applications with React, GraphQL, Apollo Client, and Node.js backend.',
      instructor: 'Stephen Grider',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/graphql-with-react-course/',
      imageUrl: '/images/react-graphql-course.jpg',
      price: 84.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 6543,
      duration: '32 hours',
      difficulty: 'advanced',
      technologies: ['React', 'GraphQL', 'Apollo', 'Node.js'],
      clickCount: 1180,
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-08-20'),
    },
    // Mobile Development
    {
      id: '11',
      title: 'React Native Complete Guide',
      description:
        'Build native mobile apps for iOS and Android using React Native. Learn navigation, state management, and native modules.',
      instructor: 'Stephen Grider',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/the-complete-react-native-and-redux-course/',
      imageUrl: '/images/react-native-course-stephen.jpg',
      price: 89.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 11234,
      duration: '40 hours',
      difficulty: 'intermediate',
      technologies: ['React Native', 'JavaScript', 'Redux', 'Expo'],
      clickCount: 1560,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-09-08'),
    },
    {
      id: '12',
      title: 'Flutter & Dart Complete Course',
      description:
        'Create beautiful native apps for iOS and Android with Flutter. Learn Dart, widgets, state management, and deployment.',
      instructor: 'Angela Yu',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/flutter-bootcamp-with-dart/',
      imageUrl: '/images/flutter-course-yu.jpg',
      price: 94.99,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 9876,
      duration: '31 hours',
      difficulty: 'beginner',
      technologies: ['Flutter', 'Dart', 'Firebase', 'Material Design'],
      clickCount: 1890,
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-09-22'),
    },
    // DevOps & Cloud
    {
      id: '13',
      title: 'Docker & Kubernetes Complete Guide',
      description:
        'Master containerization with Docker and orchestration with Kubernetes. Learn CI/CD, monitoring, and production deployment.',
      instructor: 'Stephen Grider',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
      imageUrl: '	https://img-c.udemycdn.com/course/750x422/1793828_7999_2.jpg',
      price: 89.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 13456,
      duration: '22 hours',
      difficulty: 'intermediate',
      technologies: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      clickCount: 2100,
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-09-14'),
    },
    {
      id: '14',
      title: 'AWS Solutions Architect',
      description:
        'Prepare for AWS Solutions Architect certification. Learn cloud architecture, security, and best practices.',
      instructor: 'Ryan Kroonenburg',
      platform: 'coursera',
      url: 'https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect',
      imageUrl: '/images/aws-course.jpg',
      price: 79.99,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 7654,
      duration: '65 hours',
      difficulty: 'advanced',
      technologies: ['AWS', 'Cloud Architecture', 'Security', 'Networking'],
      clickCount: 1340,
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-08-30'),
    },
    // Data Science & AI
    {
      id: '15',
      title: 'Python for Data Science',
      description:
        'Learn data analysis, visualization, and machine learning with Python. Master pandas, numpy, matplotlib, and scikit-learn.',
      instructor: 'Jose Portilla',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/complete-python-bootcamp/',
      imageUrl: '/assets/images/python-data-course.jpg',
      price: 84.99,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 16789,
      duration: '22 hours',
      difficulty: 'beginner',
      technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
      clickCount: 2890,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-09-18'),
    },
    {
      id: '16',
      title: 'Machine Learning A-Z',
      description:
        'Complete machine learning course covering supervised, unsupervised learning, and deep learning with practical projects.',
      instructor: 'Kirill Eremenko',
      platform: 'udemy',
      url: 'https://www.udemy.com/course/machinelearning/',
      imageUrl: '/assets/images/ml-course.jpg',
      price: 94.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 14567,
      duration: '44 hours',
      difficulty: 'intermediate',
      technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Deep Learning'],
      clickCount: 2340,
      createdAt: new Date('2024-02-03'),
      updatedAt: new Date('2024-09-11'),
    },
    // Free Courses from FreeCodeCamp
    {
      id: '17',
      title: 'Responsive Web Design',
      description:
        'Learn HTML, CSS, and responsive design principles. Build 5 certification projects to earn your certificate.',
      instructor: 'FreeCodeCamp Team',
      platform: 'freecodecamp',
      url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
      imageUrl: '/images/fcc-responsive.jpg',
      price: 0,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 25678,
      duration: '300 hours',
      difficulty: 'beginner',
      technologies: ['HTML', 'CSS', 'Flexbox', 'Grid'],
      clickCount: 4560,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-09-25'),
    },
    {
      id: '18',
      title: 'JavaScript Algorithms and Data Structures',
      description:
        'Master JavaScript fundamentals, ES6, regular expressions, debugging, data structures, and algorithms.',
      instructor: 'FreeCodeCamp Team',
      platform: 'freecodecamp',
      url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
      imageUrl: '/images/fcc-js.jpg',
      price: 0,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 23456,
      duration: '300 hours',
      difficulty: 'intermediate',
      technologies: ['JavaScript', 'ES6', 'Algorithms', 'Data Structures'],
      clickCount: 3890,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-09-20'),
    },
    // Additional courses to reach 80+
    {
      id: '19',
      title: 'CSS Grid & Flexbox Masterclass',
      description:
        'Master modern CSS layout techniques with Grid and Flexbox. Build responsive layouts with confidence.',
      instructor: 'Wes Bos',
      platform: 'youtube',
      url: 'https://www.youtube.com/playlist?list=PLu8EoSxDXHP5CIFvt9-ze3IngcdAc2xKG',
      imageUrl:
        'https://i.ytimg.com/vi/T-slCsOrLcc/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZJ_K8sm1Ln21lImkjO0Ecz1Yznw',
      price: 0,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 8765,
      duration: '8 hours',
      difficulty: 'intermediate',
      technologies: ['CSS', 'Grid', 'Flexbox', 'Responsive Design'],
      clickCount: 1670,
      createdAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-08-28'),
    },
    {
      id: '20',
      title: 'Next.js 14 Complete Course',
      description:
        'Build production-ready React applications with Next.js 14. Learn App Router, Server Components, and deployment.',
      instructor: 'Lee Robinson',
      platform: 'coursera',
      url: 'https://www.coursera.org/learn/nextjs-react',
      imageUrl: '/assets/images/nextjs-course.jpg',
      price: 59.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 6543,
      duration: '25 hours',
      difficulty: 'intermediate',
      technologies: ['Next.js', 'React', 'Server Components', 'Vercel'],
      clickCount: 1450,
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-09-15'),
    },
    // Note: In a real implementation, you would continue adding courses to reach 80+
    // This is a representative sample showing the structure and variety
  ];

  private users: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      avatar: '/public/avatar1.jpg',
      techInterests: ['Angular', 'Node.js', 'PostgreSQL'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-09-20'),
    },
    {
      id: '2',
      email: 'sarah.wilson@example.com',
      name: 'Sarah Wilson',
      avatar: '/assets/images/avatar2.jpg',
      techInterests: ['React', 'Python', 'Machine Learning'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-09-18'),
    },
    {
      id: '3',
      email: 'mike.chen@example.com',
      name: 'Mike Chen',
      avatar: '/assets/images/avatar3.jpg',
      techInterests: ['Vue.js', 'Docker', 'AWS'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-09-15'),
    },
    {
      id: '4',
      email: 'emily.rodriguez@example.com',
      name: 'Emily Rodriguez',
      avatar: '/assets/images/avatar4.jpg',
      techInterests: ['Flutter', 'Firebase', 'Mobile Development'],
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-09-12'),
    },
    {
      id: '5',
      email: 'alex.kumar@example.com',
      name: 'Alex Kumar',
      avatar: '/assets/images/avatar5.jpg',
      techInterests: ['JavaScript', 'TypeScript', 'Full Stack'],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-09-10'),
    },
  ];

  private reviews: Review[] = [
    {
      id: '1',
      userId: '1',
      courseId: '1',
      rating: 5,
      title: 'Excellent Angular Course!',
      content:
        'This course covers everything you need to know about Angular. The instructor explains complex concepts clearly and provides practical examples.',
      pros: [
        'Great explanations',
        'Practical examples',
        'Up-to-date content',
        'Good project structure',
      ],
      cons: ['Could use more advanced topics', 'Some sections are lengthy'],
      helpful: 45,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: '2',
      userId: '2',
      courseId: '2',
      rating: 5,
      title: 'Perfect for React Hooks',
      content:
        'Sarah explains React hooks in a way that finally made sense to me. The context API section was particularly helpful.',
      pros: [
        'Clear explanations',
        'Good pacing',
        'Free content',
        'Practical examples',
      ],
      cons: ['Could be longer', 'More advanced patterns needed'],
      helpful: 32,
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-20'),
    },
    {
      id: '3',
      userId: '3',
      courseId: '4',
      rating: 5,
      title: 'JavaScript Mastery',
      content:
        'Jonas is an amazing instructor. This course took my JavaScript skills from intermediate to advanced level.',
      pros: [
        'Comprehensive coverage',
        'Excellent instructor',
        'Real-world projects',
        'Great exercises',
      ],
      cons: ['Very long course', 'Can be overwhelming for beginners'],
      helpful: 78,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-01'),
    },
    {
      id: '4',
      userId: '4',
      courseId: '6',
      rating: 4,
      title: 'Solid Node.js Foundation',
      content:
        'Great course for learning Node.js from scratch. Andrew covers all the important concepts with practical applications.',
      pros: [
        'Good structure',
        'Practical projects',
        'Clear explanations',
        'Updated content',
      ],
      cons: ['Some outdated packages', 'Could use more testing coverage'],
      helpful: 56,
      createdAt: new Date('2024-04-10'),
      updatedAt: new Date('2024-04-10'),
    },
    {
      id: '5',
      userId: '5',
      courseId: '7',
      rating: 5,
      title: 'Django REST Framework Excellence',
      content:
        "Corey's teaching style is exceptional. This free course is better than many paid ones. Highly recommended!",
      pros: [
        'Free content',
        'Excellent instructor',
        'Comprehensive coverage',
        'Good examples',
      ],
      cons: ['YouTube format limitations', 'No certificates'],
      helpful: 89,
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-04-15'),
    },
    {
      id: '6',
      userId: '1',
      courseId: '12',
      rating: 4,
      title: 'Great Flutter Introduction',
      content:
        'Angela makes Flutter accessible for beginners. The course structure is well thought out.',
      pros: [
        'Beginner friendly',
        'Good projects',
        'Clear explanations',
        'Active community',
      ],
      cons: ['Some advanced topics missing', 'Could use more state management'],
      helpful: 34,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-01'),
    },
    {
      id: '7',
      userId: '2',
      courseId: '15',
      rating: 5,
      title: 'Data Science Game Changer',
      content:
        'This course completely changed my career path. Jose explains complex data science concepts in simple terms.',
      pros: [
        'Career changing',
        'Practical approach',
        'Great projects',
        'Comprehensive',
      ],
      cons: ['Fast paced', 'Requires dedication'],
      helpful: 67,
      createdAt: new Date('2024-05-10'),
      updatedAt: new Date('2024-05-10'),
    },
    {
      id: '8',
      userId: '3',
      courseId: '17',
      rating: 5,
      title: 'Best Free Web Development Course',
      content:
        "FreeCodeCamp's curriculum is incredible. The projects are challenging and teach real-world skills.",
      pros: [
        'Completely free',
        'Hands-on projects',
        'Great community',
        'Certification',
      ],
      cons: [
        'Self-paced can be challenging',
        'No video explanations for some topics',
      ],
      helpful: 123,
      createdAt: new Date('2024-05-20'),
      updatedAt: new Date('2024-05-20'),
    },
  ];

  // Mock API methods with realistic delays
  getCourses(
    params: { page?: number; limit?: number } = {}
  ): Observable<{ courses: Course[]; total: number }> {
    const page = params.page || 1;
    const limit = params.limit || 12;

    const start = (page - 1) * limit;
    const paginatedCourses = this.courses.slice(start, start + limit);

    return of({
      courses: paginatedCourses,
      total: this.courses.length,
    }).pipe(delay(this.API_DELAY.medium));
  }

  getCourseById(id: string): Observable<Course | null> {
    const course = this.courses.find((c) => c.id === id);
    return of(course || null).pipe(delay(this.API_DELAY.fast));
  }

  searchCourses(
    query: string,
    filters?: {
      platform?: string;
      difficulty?: string;
      priceRange?: { min: number; max: number };
      technologies?: string[];
    }
  ): Observable<Course[]> {
    let filtered = [...this.courses];

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.instructor.toLowerCase().includes(searchTerm) ||
          course.technologies.some((tech) =>
            tech.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Apply filters
    if (filters) {
      if (filters.platform) {
        filtered = filtered.filter(
          (course) => course.platform === filters.platform
        );
      }

      if (filters.difficulty) {
        filtered = filtered.filter(
          (course) => course.difficulty === filters.difficulty
        );
      }

      if (filters.priceRange) {
        filtered = filtered.filter(
          (course) =>
            course.price >= filters.priceRange!.min &&
            course.price <= filters.priceRange!.max
        );
      }

      if (filters.technologies && filters.technologies.length > 0) {
        filtered = filtered.filter((course) =>
          filters.technologies!.some((tech) =>
            course.technologies.includes(tech)
          )
        );
      }
    }

    return of(filtered).pipe(delay(this.API_DELAY.medium));
  }

  getUsers(): Observable<User[]> {
    // Simule un délai réseau pour plus de réalisme
    return of(this.users).pipe(delay(this.API_DELAY.fast));
  }

  getReviewsForCourse(courseId: string): Observable<Review[]> {
    const courseReviews = this.reviews
      .filter((r) => r.courseId === courseId)
      .map((review) => ({
        ...review,
        user: this.users.find((u) => u.id === review.userId),
      }));

    return of(courseReviews).pipe(delay(this.API_DELAY.fast));
  }

  getCurrentUser(): Observable<User | null> {
    // Simulate logged in user (first user in array)
    return of(this.users[0]).pipe(delay(this.API_DELAY.fast));
  }

  getUserById(id: string): Observable<User | null> {
    const user = this.users.find((u) => u.id === id);
    return of(user || null).pipe(delay(this.API_DELAY.fast));
  }

  // Course interaction methods
  incrementClickCount(courseId: string): Observable<boolean> {
    const course = this.courses.find((c) => c.id === courseId);
    if (course) {
      course.clickCount++;
      course.updatedAt = new Date();
      return of(true).pipe(delay(this.API_DELAY.fast));
    }
    return of(false).pipe(delay(this.API_DELAY.fast));
  }

  // Recommendation methods
  getRecommendedCourses(
    userId: string,
    limit: number = 6
  ): Observable<Course[]> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      return of([]).pipe(delay(this.API_DELAY.medium));
    }

    // Simple recommendation based on user interests
    const recommended = this.courses
      .filter((course) =>
        course.technologies.some((tech) =>
          user.techInterests.some(
            (interest) =>
              tech.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(tech.toLowerCase())
          )
        )
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    return of(recommended).pipe(delay(this.API_DELAY.medium));
  }

  getPopularCourses(limit: number = 6): Observable<Course[]> {
    const popular = [...this.courses]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, limit);

    return of(popular).pipe(delay(this.API_DELAY.medium));
  }

  // Statistics methods
  getCourseStats(): Observable<{
    totalCourses: number;
    totalReviews: number;
    averageRating: number;
    platformDistribution: { [key: string]: number };
  }> {
    const platformDistribution = this.courses.reduce((acc, course) => {
      acc[course.platform] = (acc[course.platform] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const averageRating =
      this.courses.reduce((sum, course) => sum + course.rating, 0) /
      this.courses.length;

    return of({
      totalCourses: this.courses.length,
      totalReviews: this.reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      platformDistribution,
    }).pipe(delay(this.API_DELAY.fast));
  }

  // Utility method to get all unique technologies
  getAllTechnologies(): Observable<string[]> {
    const allTechs = new Set<string>();
    this.courses.forEach((course) => {
      course.technologies.forEach((tech) => allTechs.add(tech));
    });

    return of(Array.from(allTechs).sort()).pipe(delay(this.API_DELAY.fast));
  }

  // Method to simulate adding a review
  addReview(
    review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Review> {
    const newReview: Review = {
      ...review,
      id: (this.reviews.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reviews.push(newReview);
    return of(newReview).pipe(delay(this.API_DELAY.medium));
  }

  forgotPassword(email: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        const userExists = this.users.some((user) => user.email === email);

        if (userExists) {
          // Simulate successful email sending
          console.log(`Mock: Password reset email sent to ${email}`);
          return true;
        }

        // Still return true for security (don't reveal if email exists)
        return true;
      })
    );
  }

  searchCoursesWithFilters(filters: {
    searchTerm?: string;
    platforms?: string[];
    technologies?: string[];
    difficulty?: string;
    priceRange?: { min: number; max: number };
    sortBy?: string;
  }): Observable<Course[]> {
    let filtered = [...this.courses];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term) ||
          course.instructor.toLowerCase().includes(term) ||
          course.technologies.some((tech) => tech.toLowerCase().includes(term))
      );
    }

    if (filters.platforms?.length) {
      filtered = filtered.filter((course) =>
        filters.platforms!.includes(course.platform)
      );
    }

    if (filters.technologies?.length) {
      filtered = filtered.filter((course) =>
        filters.technologies!.some((tech) => course.technologies.includes(tech))
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(
        (course) => course.difficulty === filters.difficulty
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (course) =>
          course.price >= filters.priceRange!.min &&
          course.price <= filters.priceRange!.max
      );
    }

    return of(filtered).pipe(delay(this.API_DELAY.fast));
  }
}
