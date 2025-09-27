import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
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
    // You can replace these with your actual icon URLs or use a CDN
    const iconMap: Record<string, string> = {
      udemy: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRUM1MjUwIi8+Cjwvc3ZnPgo=',
      coursera: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTZEMiIvPgo8cGF0aCBkPSJNNyA4SDE3VjE2SDdWOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
      youtube: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjQ5OCAxMi4zQzIzLjQ5OCAxMS4zIDIzLjM5OCAxMC4zIDIzLjE5OCA5LjNDMjIuOTk4IDguMSAyMi4zOTggNy4yIDIxLjI5OCA3QzE5LjM5OCA2LjYgMTUuNDk4IDYuNiAxMiA2LjZDOC41MDIgNi42IDQuNjAyIDYuNiAyLjcwMiA3QzEuNjAyIDcuMiAwLjk5OCA4LjEgMC43OTggOS4zQzAuNTk4IDEwLjMgMC40OTggMTEuMyAwLjQ5OCAxMi4zQzAuNDk4IDEzLjMgMC41OTggMTQuMyAwLjc5OCAxNS4zQzAuOTk4IDE2LjUgMS42MDIgMTcuNCAyLjcwMiAxNy43QzQuNjAyIDE4LjEgOC41MDIgMTguMSAxMiAxOC4xQzE1LjQ5OCAxOC4xIDE5LjM5OCAxOC4xIDIxLjI5OCAxNy43QzIyLjM5OCAxNy41IDIyLjk5OCAxNi42IDIzLjE5OCAxNS4zQzIzLjM5OCAxNC4zIDIzLjQ5OCAxMy4zIDIzLjQ5OCAxMi4zWk05LjUwMiA5LjZMMTUuNTk4IDEyLjNMOS41MDIgMTVWOS42WiIgZmlsbD0iI0ZGMDAwMCIvPgo8L3N2Zz4K',
      freecodecamp: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMEEwQTIzIi8+Cjwvc3ZnPgo=',
      edx: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAyMjYyQiIvPgo8cGF0aCBkPSJNNyA4SDE3VjE2SDdWOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='
    };

    return iconMap[platform] || this.getDefaultIcon();
  }

  private getDefaultIcon(): string {
    // Default platform icon
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzZDNzU3RCIvPgo8cGF0aCBkPSJNMTIgN1Y5TDE0IDEySDEwTDEyIDE1VjE3IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('error');
    // Optionally, you could set a fallback icon here
    img.src = this.getDefaultIcon();
  }
}
