import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformIconPipe } from '../../../../shared/pipes/platform-icon.pipe';

@Component({
  selector: 'app-platform-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './platform-badge.component.html',
  styleUrl: './platform-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformBadgeComponent {
  platform = input.required<string>();

  get platformClass(): string {
    return this.platform().toLowerCase().replace(/\s+/g, '');
  }
}
