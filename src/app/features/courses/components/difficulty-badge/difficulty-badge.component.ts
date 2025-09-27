import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
}
