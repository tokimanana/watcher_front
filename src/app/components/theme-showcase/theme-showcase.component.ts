import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-theme-showcase',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    ThemeToggleComponent
  ],
  template: `
    <div class="showcase-container p-xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-2xl">
        <div>
          <h1 class="text-primary mb-sm">Theme Showcase</h1>
          <p class="text-secondary">Demonstrating the new theme system with best practices</p>
        </div>
        <app-theme-toggle></app-theme-toggle>
      </div>

      <!-- Color Palette -->
      <mat-card class="mb-xl">
        <mat-card-header>
          <mat-card-title>Color Palette</mat-card-title>
          <mat-card-subtitle>Primary colors and variants</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="grid grid-cols-2 gap-md">
            <div class="color-swatch bg-gradient-primary p-md rounded-lg">
              <h4 class="font-semibold mb-xs text-white">Primary</h4>
              <small class="text-white opacity-90">Main brand color</small>
            </div>
            <div class="color-swatch bg-gradient-secondary p-md rounded-lg">
              <h4 class="font-semibold mb-xs text-white">Secondary</h4>
              <small class="text-white opacity-90">Accent color</small>
            </div>
            <div class="color-swatch bg-gradient-success p-md rounded-lg">
              <h4 class="font-semibold mb-xs text-white">Success</h4>
              <small class="text-white opacity-90">Success states</small>
            </div>
            <div class="color-swatch bg-gradient-warning p-md rounded-lg">
              <h4 class="font-semibold mb-xs text-white">Warning</h4>
              <small class="text-white opacity-90">Warning states</small>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Buttons -->
      <mat-card class="mb-xl">
        <mat-card-header>
          <mat-card-title>Buttons</mat-card-title>
          <mat-card-subtitle>Various button styles and states</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="flex flex-wrap gap-md mb-lg">
            <button mat-raised-button color="primary">Primary Button</button>
            <button mat-raised-button color="accent">Secondary Button</button>
            <button mat-raised-button color="warn">Warning Button</button>
            <button mat-raised-button disabled>Disabled Button</button>
          </div>
          <div class="flex flex-wrap gap-md">
            <button mat-outlined-button color="primary">Outlined Primary</button>
            <button mat-outlined-button color="accent">Outlined Secondary</button>
            <button mat-button color="primary">Text Button</button>
            <button mat-icon-button color="primary">
              <mat-icon>favorite</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Badges -->
      <mat-card class="mb-xl">
        <mat-card-header>
          <mat-card-title>Badges</mat-card-title>
          <mat-card-subtitle>Difficulty and platform badges</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="mb-lg">
            <h4 class="mb-sm">Difficulty Badges</h4>
            <div class="flex flex-wrap gap-sm">
              <span class="difficulty-badge beginner">Beginner</span>
              <span class="difficulty-badge intermediate">Intermediate</span>
              <span class="difficulty-badge advanced">Advanced</span>
              <span class="difficulty-badge expert">Expert</span>
            </div>
          </div>
          <div class="mb-lg">
            <h4 class="mb-sm">Platform Badges</h4>
            <div class="flex flex-wrap gap-sm">
              <span class="platform-badge udemy">Udemy</span>
              <span class="platform-badge youtube">YouTube</span>
              <span class="platform-badge freecodecamp">FreeCodeCamp</span>
              <span class="platform-badge coursera">Coursera</span>
              <span class="platform-badge edx">edX</span>
            </div>
          </div>
          <div>
            <h4 class="mb-sm">Status Badges</h4>
            <div class="flex flex-wrap gap-sm">
              <span class="badge badge-primary">Primary</span>
              <span class="badge badge-secondary">Secondary</span>
              <span class="badge badge-success">Success</span>
              <span class="badge badge-warning">Warning</span>
              <span class="badge badge-error">Error</span>
              <span class="badge badge-info">Info</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Components -->
      <mat-card class="mb-xl">
        <mat-card-header>
          <mat-card-title>Components</mat-card-title>
          <mat-card-subtitle>Various UI components</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <!-- Star Rating -->
          <div class="mb-lg">
            <h4 class="mb-sm">Star Rating</h4>
            <div class="star-rating">
              <span class="star filled">★</span>
              <span class="star filled">★</span>
              <span class="star filled">★</span>
              <span class="star filled">★</span>
              <span class="star empty">★</span>
              <span class="rating-text">4.2 (156 reviews)</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-lg">
            <h4 class="mb-sm">Progress Bar</h4>
            <div class="progress mb-sm">
              <div class="progress-bar" style="width: 75%"></div>
            </div>
            <small class="text-muted">75% Complete</small>
          </div>

          <!-- Alerts -->
          <div class="mb-lg">
            <h4 class="mb-sm">Alerts</h4>
            <div class="alert alert-success mb-sm">
              <strong>Success!</strong> Your action was completed successfully.
            </div>
            <div class="alert alert-warning mb-sm">
              <strong>Warning!</strong> Please check your input.
            </div>
            <div class="alert alert-error mb-sm">
              <strong>Error!</strong> Something went wrong.
            </div>
            <div class="alert alert-info">
              <strong>Info!</strong> Here's some helpful information.
            </div>
          </div>

          <!-- Loading Spinner -->
          <div>
            <h4 class="mb-sm">Loading Spinners</h4>
            <div class="flex items-center gap-md">
              <div class="spinner spinner-sm"></div>
              <div class="spinner"></div>
              <div class="spinner spinner-lg"></div>
              <span class="text-muted ml-md">Loading...</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Typography -->
      <mat-card class="mb-xl">
        <mat-card-header>
          <mat-card-title>Typography</mat-card-title>
          <mat-card-subtitle>Text styles and hierarchy</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <h1>Heading 1 - Main Title</h1>
          <h2>Heading 2 - Section Title</h2>
          <h3>Heading 3 - Subsection Title</h3>
          <p>This is a regular paragraph with <strong>bold text</strong> and <em>italic text</em>. 
             It demonstrates the base typography styles and line height.</p>
          <p class="text-secondary">This is secondary text, often used for descriptions or less important information.</p>
          <small>This is small text, typically used for captions or fine print.</small>
        </mat-card-content>
      </mat-card>

      <!-- Utility Classes -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Utility Classes</mat-card-title>
          <mat-card-subtitle>Spacing, colors, and layout utilities</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="grid grid-cols-1 gap-md">
            <div class="p-md bg-surface-variant rounded-lg">
              <h4 class="text-primary font-semibold mb-sm">Spacing Utilities</h4>
              <p class="text-sm">Classes like <code>p-md</code>, <code>mb-lg</code>, <code>mx-xl</code> for consistent spacing.</p>
            </div>
            <div class="p-md bg-surface-variant rounded-lg">
              <h4 class="text-secondary font-semibold mb-sm">Color Utilities</h4>
              <p class="text-sm">Classes like <code>text-primary</code>, <code>bg-success</code>, <code>text-muted</code> for colors.</p>
            </div>
            <div class="p-md bg-surface-variant rounded-lg">
              <h4 class="text-success font-semibold mb-sm">Layout Utilities</h4>
              <p class="text-sm">Classes like <code>flex</code>, <code>grid</code>, <code>justify-center</code> for layouts.</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .showcase-container {
      max-width: 1200px;
      margin: 0 auto;
      min-height: 100vh;
    }

    .color-swatch {
      transition: transform var(--transition-normal);
      
      &:hover {
        transform: translateY(-2px);
      }
    }

    code {
      background: rgba(139, 69, 19, 0.1);
      padding: 2px 4px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.875em;
    }

    @media (max-width: 767px) {
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }
      
      .flex-wrap {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class ThemeShowcaseComponent {}