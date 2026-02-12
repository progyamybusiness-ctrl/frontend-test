import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // ✅ Debug Log: Check console to see if this prints!
      console.log('Interceptor caught error:', error.status); 

      // If session is dead (401) or forbidden (403), force logout
      if (error.status === 401 || error.status === 403) {
        // Prevent infinite loop on login page
        if (!req.url.includes('/auth/login')) {
          console.warn('Session expired. Redirecting to login...');
          authService.logout();
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};