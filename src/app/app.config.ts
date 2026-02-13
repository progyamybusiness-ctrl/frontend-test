import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { 
  provideHttpClient, 
  withFetch, 
  withInterceptorsFromDi,  // ✅ 1. Import this
  HTTP_INTERCEPTORS        // ✅ 2. Import this token
} from '@angular/common/http';

import { routes } from './app.routes';

// ✅ 3. Import the Classes, not functions
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    // ✅ 4. Configure HTTP to use Class-based Interceptors
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi() 
    ),

    // ✅ 5. Register the Interceptors Manually
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
};