import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  technologies: Technology[];
}

interface Technology {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popular: boolean;
}

@Component({
  selector: 'app-tech-interests-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './tech-interests-setup.component.html',
  styleUrl: './tech-interests-setup.component.scss',
})
export class TechInterestsSetupComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Auth service signals
  readonly isLoading = this.authService.isLoading;
  readonly user = this.authService.user;
  readonly error = this.authService.error;

  // Component signals
  readonly selectedTechnologies = signal<string[]>([]);
  readonly currentStep = signal(1);
  readonly totalSteps = 3;

  setupForm: FormGroup;

  // Données des technologies organisées par catégories
  readonly techCategories: TechCategory[] = [
    {
      id: 'frontend',
      name: 'Frontend Development',
      icon: 'web',
      color: '#3498db',
      technologies: [
        {
          id: 'react',
          name: 'React',
          description: 'Popular JavaScript library for building UIs',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'vue',
          name: 'Vue.js',
          description: 'Progressive JavaScript framework',
          difficulty: 'beginner',
          popular: true,
        },
        {
          id: 'angular',
          name: 'Angular',
          description: 'Full-featured TypeScript framework',
          difficulty: 'advanced',
          popular: true,
        },
        {
          id: 'javascript',
          name: 'JavaScript',
          description: 'Core web programming language',
          difficulty: 'beginner',
          popular: true,
        },
        {
          id: 'typescript',
          name: 'TypeScript',
          description: 'Typed superset of JavaScript',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'html-css',
          name: 'HTML/CSS',
          description: 'Web markup and styling fundamentals',
          difficulty: 'beginner',
          popular: true,
        },
        {
          id: 'sass',
          name: 'Sass/SCSS',
          description: 'CSS preprocessor with advanced features',
          difficulty: 'beginner',
          popular: false,
        },
        {
          id: 'tailwind',
          name: 'Tailwind CSS',
          description: 'Utility-first CSS framework',
          difficulty: 'beginner',
          popular: true,
        },
      ],
    },
    {
      id: 'backend',
      name: 'Backend Development',
      icon: 'dns',
      color: '#e74c3c',
      technologies: [
        {
          id: 'nodejs',
          name: 'Node.js',
          description: 'JavaScript runtime for server-side development',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'python',
          name: 'Python',
          description: 'Versatile programming language',
          difficulty: 'beginner',
          popular: true,
        },
        {
          id: 'java',
          name: 'Java',
          description: 'Enterprise-grade programming language',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'csharp',
          name: 'C#',
          description: "Microsoft's object-oriented language",
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'php',
          name: 'PHP',
          description: 'Server-side scripting language',
          difficulty: 'beginner',
          popular: true,
        },
        {
          id: 'go',
          name: 'Go',
          description: "Google's fast and efficient language",
          difficulty: 'intermediate',
          popular: false,
        },
        {
          id: 'rust',
          name: 'Rust',
          description: 'Systems programming language',
          difficulty: 'advanced',
          popular: false,
        },
        {
          id: 'spring',
          name: 'Spring Boot',
          description: 'Java application framework',
          difficulty: 'intermediate',
          popular: true,
        },
      ],
    },
    {
      id: 'database',
      name: 'Databases',
      icon: 'storage',
      color: '#f39c12',
      technologies: [
        {
          id: 'mysql',
          name: 'MySQL',
          description: 'Popular relational database',
          difficulty: 'beginner',
          popular: true,
        },
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          description: 'Advanced open-source database',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'mongodb',
          name: 'MongoDB',
          description: 'NoSQL document database',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'redis',
          name: 'Redis',
          description: 'In-memory data structure store',
          difficulty: 'intermediate',
          popular: false,
        },
        {
          id: 'sqlite',
          name: 'SQLite',
          description: 'Lightweight embedded database',
          difficulty: 'beginner',
          popular: false,
        },
        {
          id: 'firebase',
          name: 'Firebase',
          description: "Google's mobile/web app platform",
          difficulty: 'beginner',
          popular: true,
        },
      ],
    },
    {
      id: 'devops',
      name: 'DevOps & Cloud',
      icon: 'cloud',
      color: '#9b59b6',
      technologies: [
        {
          id: 'docker',
          name: 'Docker',
          description: 'Containerization platform',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'kubernetes',
          name: 'Kubernetes',
          description: 'Container orchestration system',
          difficulty: 'advanced',
          popular: true,
        },
        {
          id: 'aws',
          name: 'AWS',
          description: 'Amazon Web Services cloud platform',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'azure',
          name: 'Azure',
          description: 'Microsoft cloud platform',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'gcp',
          name: 'Google Cloud',
          description: "Google's cloud platform",
          difficulty: 'intermediate',
          popular: false,
        },
        {
          id: 'jenkins',
          name: 'Jenkins',
          description: 'Automation server for CI/CD',
          difficulty: 'intermediate',
          popular: false,
        },
        {
          id: 'terraform',
          name: 'Terraform',
          description: 'Infrastructure as code tool',
          difficulty: 'advanced',
          popular: false,
        },
      ],
    },
    {
      id: 'mobile',
      name: 'Mobile Development',
      icon: 'phone_android',
      color: '#1abc9c',
      technologies: [
        {
          id: 'react-native',
          name: 'React Native',
          description: 'Cross-platform mobile development',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'flutter',
          name: 'Flutter',
          description: "Google's UI toolkit for mobile",
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'swift',
          name: 'Swift',
          description: "Apple's programming language for iOS",
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'kotlin',
          name: 'Kotlin',
          description: 'Modern language for Android development',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'ionic',
          name: 'Ionic',
          description: 'Hybrid mobile app framework',
          difficulty: 'beginner',
          popular: false,
        },
      ],
    },
    {
      id: 'data-ai',
      name: 'Data Science & AI',
      icon: 'psychology',
      color: '#e67e22',
      technologies: [
        {
          id: 'machine-learning',
          name: 'Machine Learning',
          description: 'AI algorithms and models',
          difficulty: 'advanced',
          popular: true,
        },
        {
          id: 'data-analysis',
          name: 'Data Analysis',
          description: 'Statistical analysis and insights',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'python-data',
          name: 'Python for Data',
          description: 'Python libraries for data science',
          difficulty: 'intermediate',
          popular: true,
        },
        {
          id: 'tensorflow',
          name: 'TensorFlow',
          description: 'Machine learning framework',
          difficulty: 'advanced',
          popular: false,
        },
        {
          id: 'pytorch',
          name: 'PyTorch',
          description: 'Deep learning framework',
          difficulty: 'advanced',
          popular: false,
        },
        {
          id: 'pandas',
          name: 'Pandas',
          description: 'Data manipulation library',
          difficulty: 'intermediate',
          popular: false,
        },
      ],
    },
  ];

  constructor() {
    this.setupForm = this.fb.group({
      selectedTechs: this.fb.array([], [Validators.minLength(3)]),
    });
  }

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    if (!this.user()) {
      this.router.navigate(['/auth/login']);
      return;
    }
  }

  get selectedTechsFormArray(): FormArray {
    return this.setupForm.get('selectedTechs') as FormArray;
  }

  toggleTechnology(techId: string): void {
    const currentSelected = this.selectedTechnologies();
    const formArray = this.selectedTechsFormArray;

    if (currentSelected.includes(techId)) {
      // Retirer la technologie
      const newSelected = currentSelected.filter((id) => id !== techId);
      this.selectedTechnologies.set(newSelected);

      // Mettre à jour le FormArray
      const index = formArray.controls.findIndex(
        (control) => control.value === techId
      );
      if (index > -1) {
        formArray.removeAt(index);
      }
    } else {
      // Ajouter la technologie (max 10)
      if (currentSelected.length < 10) {
        const newSelected = [...currentSelected, techId];
        this.selectedTechnologies.set(newSelected);

        // Mettre à jour le FormArray
        formArray.push(this.fb.control(techId));
      }
    }
  }

  isTechnologySelected(techId: string): boolean {
    return this.selectedTechnologies().includes(techId);
  }

  getTechnologyById(techId: string): Technology | undefined {
    for (const category of this.techCategories) {
      const tech = category.technologies.find((t) => t.id === techId);
      if (tech) return tech;
    }
    return undefined;
  }

  getCategoryById(categoryId: string): TechCategory | undefined {
    return this.techCategories.find((cat) => cat.id === categoryId);
  }

  getSelectedTechnologiesCount(): number {
    return this.selectedTechnologies().length;
  }

  canProceed(): boolean {
    return this.selectedTechnologies().length >= 3 && !this.isLoading();
  }

  nextStep(): void {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update((step) => step + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  skipSetup(): void {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (!this.canProceed() || !this.user()) {
      return;
    }

    const selectedTechs = this.selectedTechnologies();
    const userId = this.user()!.id;

    this.authService.updateTechInterests(userId, selectedTechs).subscribe({
      next: (updatedUser) => {
        // Navigation vers le dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // L'erreur est gérée par le service
        console.error('Failed to update tech interests:', error);
      },
    });
  }

  // Getters pour le template
  errorMessage(): string | null {
    return this.error();
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return '#2ecc71';
      case 'intermediate':
        return '#f39c12';
      case 'advanced':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  }

  getDifficultyText(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Unknown';
    }
  }

  getSelectedTechCountForCategory(category: TechCategory): number {
    return category.technologies.filter(tech => this.isTechnologySelected(tech.id)).length;
  }

  hasCategorySelectedTechs(category: TechCategory): boolean {
    return category.technologies.some(tech => this.isTechnologySelected(tech.id));
  }
}
