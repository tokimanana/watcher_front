import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';

interface Technology {
  id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'mobile' | 'data' | 'devops' | 'other';
  description: string;
  isPopular?: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  technologies: Technology[];
}

@Component({
  selector: 'app-tech-interests-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  templateUrl: './tech-interests-setup.component.html',
  styleUrl: './tech-interests-setup.component.scss'
})
export class TechInterestsSetupComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // State signals
  selectedTechs = signal(new Set<string>());
  expandedCategories = signal(new Set<string>());

  // Auth service signals
  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;
  readonly user = this.authService.user;

  // Technologies organisées par catégorie pour l'affichage
  techCategories: TechCategory[] = [
    {
      id: 'frontend',
      name: 'Frontend Development',
      icon: 'code',
      technologies: [
        { id: 'angular', name: 'Angular', icon: 'code', category: 'frontend', description: 'Modern web framework by Google', isPopular: true, difficulty: 'intermediate' },
        { id: 'react', name: 'React', icon: 'code', category: 'frontend', description: 'UI library by Facebook', isPopular: true, difficulty: 'beginner' },
        { id: 'vue', name: 'Vue.js', icon: 'code', category: 'frontend', description: 'Progressive JavaScript framework', isPopular: true, difficulty: 'beginner' },
        { id: 'javascript', name: 'JavaScript', icon: 'code', category: 'frontend', description: 'Core language for web development', isPopular: true, difficulty: 'beginner' },
        { id: 'typescript', name: 'TypeScript', icon: 'code', category: 'frontend', description: 'Typed superset of JavaScript', isPopular: true, difficulty: 'intermediate' }
      ]
    },
    {
      id: 'backend',
      name: 'Backend Development',
      icon: 'dns',
      technologies: [
        { id: 'nodejs', name: 'Node.js', icon: 'dns', category: 'backend', description: 'JavaScript runtime for server-side applications', isPopular: true, difficulty: 'intermediate' },
        { id: 'spring', name: 'Spring Boot', icon: 'dns', category: 'backend', description: 'Java-based framework for microservices', isPopular: true, difficulty: 'advanced' },
        { id: 'django', name: 'Django', icon: 'dns', category: 'backend', description: 'Python web framework', isPopular: true, difficulty: 'intermediate' },
        { id: 'dotnet', name: '.NET Core', icon: 'dns', category: 'backend', description: 'Microsoft framework for building web apps', difficulty: 'intermediate' }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile Development',
      icon: 'phone_android',
      technologies: [
        { id: 'flutter', name: 'Flutter', icon: 'phone_android', category: 'mobile', description: 'UI toolkit for building native apps', isPopular: true, difficulty: 'intermediate' },
        { id: 'reactnative', name: 'React Native', icon: 'phone_android', category: 'mobile', description: 'Build native apps using React', isPopular: true, difficulty: 'intermediate' },
        { id: 'swift', name: 'Swift', icon: 'phone_android', category: 'mobile', description: 'Language for iOS development', difficulty: 'advanced' },
        { id: 'kotlin', name: 'Kotlin', icon: 'phone_android', category: 'mobile', description: 'Modern language for Android development', isPopular: true, difficulty: 'intermediate' }
      ]
    },
    {
      id: 'data',
      name: 'Data & AI',
      icon: 'analytics',
      technologies: [
        { id: 'tensorflow', name: 'TensorFlow', icon: 'analytics', category: 'data', description: 'ML library for AI applications', isPopular: true, difficulty: 'advanced' },
        { id: 'python', name: 'Python', icon: 'analytics', category: 'data', description: 'Programming language for data science', isPopular: true, difficulty: 'beginner' },
        { id: 'r', name: 'R Programming', icon: 'analytics', category: 'data', description: 'Language for statistical computing', difficulty: 'intermediate' },
        { id: 'pytorch', name: 'PyTorch', icon: 'analytics', category: 'data', description: 'Deep learning framework', difficulty: 'advanced' }
      ]
    },
    {
      id: 'devops',
      name: 'DevOps & Cloud',
      icon: 'cloud',
      technologies: [
        { id: 'docker', name: 'Docker', icon: 'cloud', category: 'devops', description: 'Containerization platform', isPopular: true, difficulty: 'intermediate' },
        { id: 'kubernetes', name: 'Kubernetes', icon: 'cloud', category: 'devops', description: 'Container orchestration system', isPopular: true, difficulty: 'advanced' },
        { id: 'aws', name: 'AWS', icon: 'cloud', category: 'devops', description: 'Amazon cloud services', isPopular: true, difficulty: 'intermediate' },
        { id: 'azure', name: 'Azure', icon: 'cloud', category: 'devops', description: 'Microsoft cloud platform', difficulty: 'intermediate' }
      ]
    },
    {
      id: 'other',
      name: 'Other Technologies',
      icon: 'code',
      technologies: [
        { id: 'cybersecurity', name: 'Cybersecurity', icon: 'security', category: 'other', description: 'Security fundamentals and best practices', difficulty: 'advanced' },
        { id: 'blockchain', name: 'Blockchain', icon: 'link', category: 'other', description: 'Distributed ledger technology', difficulty: 'advanced' },
        { id: 'gamedev', name: 'Game Development', icon: 'sports_esports', category: 'other', description: 'Game design and programming', difficulty: 'intermediate' }
      ]
    }
  ];

  // Méthodes de gestion des catégories
  toggleCategory(category: string): void {
    this.expandedCategories.update(expanded => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(category)) {
        newExpanded.delete(category);
      } else {
        newExpanded.add(category);
      }
      return newExpanded;
    });
  }

  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories().has(category);
  }

  // Méthodes de gestion des technologies
  toggleTechnology(techId: string): void {
    if (this.isSelectionLimitReached() && !this.isTechnologySelected(techId)) {
      return; // Ne pas permettre plus de sélections si la limite est atteinte
    }

    this.selectedTechs.update(selected => {
      const newSelected = new Set(selected);
      if (newSelected.has(techId)) {
        newSelected.delete(techId);
      } else {
        newSelected.add(techId);
      }
      return newSelected;
    });
  }

  isTechnologySelected(techId: string): boolean {
    return this.selectedTechs().has(techId);
  }

  isSelectionLimitReached(): boolean {
    // On limite généralement à 10 technologies maximum
    return this.selectedTechs().size >= 10;
  }

  // Méthodes d'aide pour l'interface
  getSelectedTechCountForCategory(category: TechCategory): number {
    return category.technologies.filter(tech => this.isTechnologySelected(tech.id)).length;
  }

  hasCategorySelectedTechs(category: TechCategory): boolean {
    return category.technologies.some(tech => this.isTechnologySelected(tech.id));
  }

  errorMessage(): string | null {
    return this.error();
  }

  // Actions principales
  onSubmit(): void {
    if (this.selectedTechs().size < 3) {
      return; // Validation côté client
    }

    const user = this.user();
    if (!user) {
      return;
    }

    const selectedTechArray = Array.from(this.selectedTechs());
    this.authService.updateTechInterests(user.id, selectedTechArray).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Failed to save tech interests:', error);
      }
    });
  }

  skipStep(): void {
    this.router.navigate(['/home']);
  }
}
