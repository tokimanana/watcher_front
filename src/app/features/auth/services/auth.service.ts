import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, throwError } from 'rxjs';
import {
  LoginCredentials,
  RegisterData,
} from '../../../core/models/auth.model';
import { User } from '../../../core/models/user.model';
import { BaseApiService } from '../../../core/services/base-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StorageService } from '../../../core/services/storage.service';

interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly ENDPOINT = 'users';

  // Dependencies
  private readonly storageService = inject(StorageService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  // State signals
  private readonly authState = signal<{
    isLoading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
  }>({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  // Public computed signals
  readonly isLoading = computed(() => this.authState().isLoading);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly user = computed(() => this.authState().user);
  readonly error = computed(() => this.authState().error);
  readonly userInitials = computed(() => {
    const user = this.user();
    if (!user?.userName) return '?';

    // Extraire les initiales du userName
    const nameParts = user.userName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    } else {
      return user.userName.charAt(0).toUpperCase();
    }
  });

  constructor() {
    super();
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<User> {
    this.updateAuthState({ isLoading: true, error: null });

    return this.post<AuthResponseData>(
      `${this.ENDPOINT}/authenticate`,
      credentials
    ).pipe(
      map((response) => this.handleAuthResponse(response)),
      catchError((error) => {
        const errorMsg =
          error.message || 'Login failed. Please check your credentials.';
        this.updateAuthState({ isLoading: false, error: errorMsg });
        this.notificationService.error(errorMsg);
        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        this.updateAuthState({ isLoading: false });
      })
    );
  }

  register(data: RegisterData): Observable<User> {
    this.updateAuthState({ isLoading: true, error: null });

    return this.post<User>(this.ENDPOINT, data).pipe(
      map((user) => {
        this.notificationService.success(
          'Registration successful! Please log in.'
        );
        return user;
      }),
      catchError((error) => {
        const errorMsg =
          error.message || 'Registration failed. Please try again.';
        this.updateAuthState({ isLoading: false, error: errorMsg });
        this.notificationService.error(errorMsg);
        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        this.updateAuthState({ isLoading: false });
      })
    );
  }

  updateTechInterests(
    userId: string,
    technologies: string[]
  ): Observable<User> {
    return this.put<User>(`${this.ENDPOINT}/${userId}/tech-interests`, {
      technologies,
    }).pipe(
      map((user) => {
        // Mettre à jour l'utilisateur dans le state
        this.updateAuthState({ user });
        this.notificationService.success(
          'Tech interests updated successfully!'
        );
        return user;
      }),
      catchError((error) => {
        this.notificationService.error('Failed to update tech interests');
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    // Simulation d'appel API - retourne toujours un succès
    const message =
      'Your request has been submitted. Our support team will contact you shortly to assist with account recovery.';
    this.notificationService.info(message);
    return of({ message });
  }

  // TODO: Backend endpoint not ready yet
  // refreshToken(): Observable<AuthResponseData> {
  //   const refreshToken = this.storageService.getRefreshToken();
  //   if (!refreshToken) {
  //     return throwError(() => new Error('No refresh token available'));
  //   }
  //   return this.post<AuthResponseData>(`${this.ENDPOINT}/refresh-token`, { refreshToken })
  //     .pipe(
  //       map((data) => {
  //         this.handleAuthResponse(data);
  //         return data;
  //       }),
  //       catchError((error) => {
  //         this.logout();
  //         return throwError(() => error);
  //       })
  //     );
  // }

  logout(): void {
    // TODO: Backend endpoint /revoke-tokens not ready yet
    // Just clear local storage and redirect
    this.completeLogout();
  }

  hasRole(role: string): boolean {
    return this.user()?.role === role;
  }

  // TODO: Backend endpoint not ready yet
  // verifyToken(): Observable<boolean> {
  //   if (!this.storageService.getAccessToken()) {
  //     return of(false);
  //   }
  //   return this.get<{ valid: boolean }>(`${this.ENDPOINT}/verify-token`)
  //     .pipe(
  //       map((response) => response.valid),
  //       catchError(() => of(false))
  //     );
  // }

  private handleAuthResponse(response: AuthResponseData): User {
    this.storageService.saveAccessToken(response.accessToken);
    this.storageService.saveRefreshToken(response.refreshToken);
    this.storageService.saveUser(response.user);

    this.updateAuthState({
      isAuthenticated: true,
      user: response.user,
      error: null,
    });

    return response.user;
  }

  private completeLogout(): void {
    this.storageService.clearAll();

    this.updateAuthState({
      isAuthenticated: false,
      user: null,
    });

    this.notificationService.info('You have been logged out successfully');
    this.router.navigate(['/auth/login']);
  }

  private loadUserFromStorage(): void {
    const user = this.storageService.getUser();
    const hasToken = !!this.storageService.getAccessToken();

    if (user && hasToken) {
      this.updateAuthState({
        isAuthenticated: true,
        user,
      });

      // TODO: Token verification will be added when backend endpoint is ready
      // this.verifyToken()
      //   .pipe(
      //     switchMap((isValid) => {
      //       if (!isValid) {
      //         return this.refreshToken();
      //       }
      //       return of(null);
      //     }),
      //     catchError(() => {
      //       this.logout();
      //       return of(null);
      //     })
      //   )
      //   .subscribe();
    }
  }

  private updateAuthState(
    stateUpdate: Partial<{
      isLoading: boolean;
      isAuthenticated: boolean;
      user: User | null;
      error: string | null;
    }>
  ): void {
    this.authState.update((state) => ({
      ...state,
      ...stateUpdate,
    }));
  }
}
