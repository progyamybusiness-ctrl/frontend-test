// import { bootstrapApplication } from '@angular/platform-browser';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Smooth animations

// import { AppComponent } from './app/app.component';
// import { AppRoutingModule } from './app/app-routing.module';

// bootstrapApplication(AppComponent, {
//   providers: [
//     // This loads your Routes and HTTP support
//     importProvidersFrom(AppRoutingModule, HttpClientModule, BrowserAnimationsModule)
//   ]
// }).catch(err => console.error(err));




import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // <--- Import your config

bootstrapApplication(AppComponent, appConfig) // <--- Pass the config here
  .catch((err) => console.error(err));