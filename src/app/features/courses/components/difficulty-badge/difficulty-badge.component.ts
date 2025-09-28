import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-difficulty-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './difficulty-badge.component.html',
  styleUrl: './difficulty-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifficultyBadgeComponent {
  level = input<string>('Beginner');
  size = input<'small' | 'medium' | 'large'>('medium');

  badgeClasses = computed(() => {
    const level = this.level().toLowerCase();
    const size = this.size();

    return `${level} ${size !== 'medium' ? size : ''}`.trim();
  });
}
