// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideAnimations } from '@angular/platform-browser/animations'; // <--- ADD THIS
// import { routes } from './app.routes';
// import { provideHttpClient, withFetch } from '@angular/common/http';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withFetch()),
//     provideAnimations() // <--- MUST BE HERE
//   ]
// };



import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // 👈 Check imports

import { routes } from './app.routes';
import { credentialsInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor'; // 👈 Check this import

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    
    // 👇 THIS SECTION IS CRITICAL
    provideHttpClient(
      withFetch(), 
      withInterceptors([
        credentialsInterceptor, // Must be here
        errorInterceptor        // Must be here
      ]) 
    )
  ]
};