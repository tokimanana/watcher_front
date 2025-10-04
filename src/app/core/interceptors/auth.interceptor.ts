import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  // Skip token for public endpoints
  const isPublicEndpoint =
    req.url.includes('/authenticate') ||
    (req.url.includes('/users') && req.method === 'POST'); // Registration

  if (isPublicEndpoint) {
    return next(req);
  }

  // Add token to request if available
  const token = storageService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 errors - token expired or invalid
      if (error.status === 401) {
        // TODO: When backend implements /refresh-token, add refresh logic here
        // For now, just clear storage and redirect to login
        storageService.clearAll();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url },
        });
      }

      return throwError(() => error);
    })
  );
};
