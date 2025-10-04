import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-platform-badge',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './platform-badge.component.html',
  styleUrl: './platform-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformBadgeComponent {
  platform = input.required<string>();
  size = input<'small' | 'medium' | 'large'>('medium');

  platformClass = computed(() => {
    const basePlatform = this.platform().toLowerCase().replace(/\s+/g, '');
    const sizeClass = this.size() !== 'medium' ? this.size() : '';
    return `${basePlatform} ${sizeClass}`.trim();
  });

  platformIcon = computed(() => {
    const platformName = this.platform().toLowerCase().replace(/\s+/g, '');
    return this.getPlatformIconUrl(platformName);
  });

  private getPlatformIconUrl(platform: string): string {
    // For now, only Udemy. Ready for future platforms.
    const iconMap: Record<string, string> = {
      udemy: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0idWRlbXlHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E0MzVGMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4QTJCRTIiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjExIiBmaWxsPSJ1cmwoI3VkZW15R3JhZCkiLz4KICA8cGF0aCBkPSJNNy41IDguNUM3LjUgNy45NSA3Ljk1IDcuNSA4LjUgNy41QzkuMDUgNy41IDkuNSA3Ljk1IDkuNSA4LjVWMTMuNUM5LjUgMTQuODggMTAuNjIgMTYgMTIgMTZDMTMuMzggMTYgMTQuNSAxNC44OCAxNC41IDEzLjVWOC41QzE0LjUgNy45NSAxNC45NSA3LjUgMTUuNSA3LjVDMTYuMDUgNy41IDE2LjUgNy45NSAxNi41IDguNVYxMy41QzE2LjUgMTYuMDQgMTQuNTQgMTggMTIgMThDOS40NiAxOCA3LjUgMTYuMDQgNy41IDEzLjVWOC41WiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K',

      // Future platforms (commented out for now)
      // coursera: '...',
      // youtube: '...',
      // freecodecamp: '...',
    };

    return iconMap[platform] || this.getDefaultIcon();
  }

  private getDefaultIcon(): string {
    // Fallback icon for unknown platforms
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzZDNzU3RCIvPgo8cGF0aCBkPSJNMTIgN1Y5TDE0IDEySDEwTDEyIDE1VjE3IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getDefaultIcon();
  }
}
