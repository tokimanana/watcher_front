import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ThemeToggleComponent } from '../theme-toogle/theme-toogle.component';

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
  templateUrl: './theme-showcase.component.html',
  styleUrl: './theme-showcase.component.scss'
})
export class ThemeShowcaseComponent {}
