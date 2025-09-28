import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 1;
  private readonly DEFAULT_DURATION = 5000;

  notifications = signal<Notification[]>([]);

  success(message: string, duration = this.DEFAULT_DURATION): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = this.DEFAULT_DURATION): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = this.DEFAULT_DURATION): void {
    this.show(message, 'info', duration);
  }


  warning(message: string, duration = this.DEFAULT_DURATION): void {
    this.show(message, 'warning', duration);
  }

  show(message: string, type: NotificationType = 'info', duration = this.DEFAULT_DURATION): void {
    const id = this.nextId++;

    // Add notification
    this.notifications.update(notifications => [
      ...notifications,
      { id, message, type, duration }
    ]);

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  dismiss(id: number): void {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  clear(): void {
    this.notifications.set([]);
  }
}
