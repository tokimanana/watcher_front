import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <button 
      mat-icon-button 
      [matTooltip]="tooltipText"
      (click)="toggleTheme()"
      class="theme-toggle"
      [attr.aria-label]="ariaLabel">
      <mat-icon>{{ currentTheme === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    .theme-toggle {
      transition: all var(--transition-normal);
      
      &:hover {
        background-color: rgba(139, 69, 19, 0.1);
        transform: scale(1.1);
      }
      
      mat-icon {
        color: var(--color-primary);
        transition: color var(--transition-fast);
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'light';
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get tooltipText(): string {
    return this.currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  }

  get ariaLabel(): string {
    return this.currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
  }
}