import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../../../core/models/user.model';
import {
  JwtPayload,
  LoginCredentials,
  RegisterData,
} from '../../../core/models/auth.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { AuthResponse } from '../../../core/models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly mockDataService = inject(MockDataService);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_token_refresh';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUserSubject$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean | null>(null);
  public isAuthenticatedSubject$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        if (this.isTokenExpired()) {
          console.log('Token expired, attempting to refresh...');
          this.refreshToken().subscribe({
            error: (err) => {
              console.error('Failed to refresh token:', err);
              this.logout();
            },
          });
        }
      } catch (err) {
        console.error('Failed parsing stored user data', err);
        this.logout();
      }
    }
  }

  // Login with email and password
  login(credentials: LoginCredentials): Observable<User> {
    // Get mock users from the MockDataService
    return this.mockDataService.getUsers().pipe(
      map((users) => {
        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (credentials.password !== 'password') {
          throw new Error('Invalid email or password');
        }

        return user;
      }),
      delay(800),
      tap((user) => {
        const authResponse: AuthResponse = {
          accessToken: this.generateMockJwt(user),
          refreshToken: 'mock-refresh-token-' + Math.random(),
          user,
        };
        this.handleAuthResponse(authResponse);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  //login(credentials): Observable<AuthResponse> {
  //   return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  // }

  register(data: RegisterData): Observable<User> {
    return this.mockDataService.getUsers().pipe(
      map((users) => {
        if (users.some((u) => u.email === data.email)) {
          throw new Error('Email already exists');
        }

        const newUser: User = {
          id: Math.random().toString(36).substring(2, 15),
          email: data.email,
          name: data.name,
          techInterests: data.techInterests || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return newUser;
      }),
      delay(800),
      tap((user) => {
        const authResponse: AuthResponse = {
          accessToken: this.generateMockJwt(user),
          refreshToken: 'mock-refresh-token-' + Math.random(),
          user,
        };
        this.handleAuthResponse(authResponse);
      }),
      catchError((err) => throwError(() => err))
    );

    // return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
    //   tap(response => this.handleAuthResponse(response)),
    //   map(response => response.user),
    //   catchError(error => {
    //     gestion d'erreur
    //   })
    // );
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = atob(parts[1]);
      return JSON.parse(payload);
    } catch (err) {
      console.error('Error decoding token', err);
      return null;
    }
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return of('new-mock-jwt-token' + Math.random()).pipe(
      delay(300),
      tap((token) => {
        localStorage.setItem(this.TOKEN_KEY, token);

        const user = this.currentUserSubject.value;
        if (user) {
          const newToken = this.generateMockJwt(user);
          localStorage.setItem(this.TOKEN_KEY, newToken);
        }
      })
    );
  }

  private generateMockJwt(user: User): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 3600;

    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      iat: now,
      exp: now + expiresIn,
    };

    //mock JWT payload
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const encodedSignature = btoa('mock-signature-' + Math.random());

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
  return this.mockDataService.forgotPassword(email).pipe(
    map(() => ({
      message: 'If an account with that email exists, a password reset link has been sent.'
    })),
    catchError(error => {
      console.error('Error in forgotPassword:', error);
      return of({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    })
  );
}
}
