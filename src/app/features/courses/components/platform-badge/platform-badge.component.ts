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
    const iconMap: Record<string, string> = {
      udemy:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0idWRlbXlHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E0MzVGMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4QTJCRTIiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjExIiBmaWxsPSJ1cmwoI3VkZW15R3JhZCkiLz4KICA8cGF0aCBkPSJNNy41IDguNUM3LjUgNy45NSA3Ljk1IDcuNSA4LjUgNy41QzkuMDUgNy41IDkuNSA3Ljk1IDkuNSA4LjVWMTMuNUM5LjUgMTQuODggMTAuNjIgMTYgMTIgMTZDMTMuMzggMTYgMTQuNSAxNC44OCAxNC41IDEzLjVWOC41QzE0LjUgNy45NSAxNC45NSA3LjUgMTUuNSA3LjVDMTYuMDUgNy41IDE2LjUgNy45NSAxNi41IDguNVYxMy41QzE2LjUgMTYuMDQgMTQuNTQgMTggMTIgMThDOS40NiAxOCA3LjUgMTYuMDQgNy41IDEzLjVWOC41WiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K',
      coursera:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iY291cnNlcmFHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwNTZEMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDQ0QjQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgeD0iMSIgeT0iMSIgcng9IjMiIGZpbGw9InVybCgjY291cnNlcmFHcmFkKSIvPgogIDx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QzwvdGV4dD4KPC9zdmc+',
      youtube:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ieW91dHViZUdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkYwMDAwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0RDMTQzQyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjIyIiBoZWlnaHQ9IjE2IiB4PSIxIiB5PSI0IiByeD0iMyIgZmlsbD0idXJsKCN5b3V0dWJlR3JhZCkiLz4KICA8cGF0aCBkPSJNOSA5TDE2IDEyTDkgMTVWOVoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+',
      freecodecamp:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZnJlZWNvZGVHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwNjQwMCIvPgogICAgICA<c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDUwMDAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjExIiBmaWxsPSJ1cmwoI2ZyZWVjb2RlR3JhZCkiLz4KICA8cGF0aCBkPSJNOCA4QzggNy40NSA4LjQ1IDcgOSA3UzEwIDcuNDUgMTAgOFYxNkM5LjQ1IDE2IDkgMTUuNTUgOSAxNUM4IDE1IDggMTQuNTUgOCAxNFY4WiIgZmlsbD0iI2ZmZmZmZiIvPgogIDxwYXRoIGQ9Ik0xNCA4QzE0IDcuNDUgMTQuNDUgNyAxNSA3UzE2IDcuNDUgMTYgOFYxNkMxNS41NSAxNiAxNSAxNS41NSAxNSAxNUMxNCAxNSAxNCAxNC41NSAxNCAxNFY4WiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K',
      edx: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZWR4R3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMjI2MkIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDEyMDI0Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHg9IjEiIHk9IjEiIHJ4PSIzIiBmaWxsPSJ1cmwoI2VkeFJhZCkiLz4KICA8dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPmVkWDwvdGV4dD4KPC9zdmc+',
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
