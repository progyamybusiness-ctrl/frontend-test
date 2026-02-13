import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Get the user from the CORRECT storage key
    const userStr = localStorage.getItem('science_rush_user');
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (userStr && isApiUrl) {
      try {
        const user = JSON.parse(userStr);
        // 2. Check if your backend expects a specific token field (e.g. user.token or just the cookie)
        // If you are using Cookies (HttpOnly), you don't actually need this.
        // If you are using Bearer Tokens, ensure 'user.token' exists in your interface.
        if (user.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }
      } catch (e) {
        console.error('Invalid user data in storage');
      }
    }

    return next.handle(request);
  }
}