// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { NavbarComponent } from '@shared/components/navbar/navbar.component';
// import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs';
// import { UpgradeModalComponent } from '@shared/components/upgrade-modal/upgrade-modal.component';
// import { UiService } from '@core/services/ui.service';


// @Component({
//   selector: 'app-root',
//   standalone: true, // <--- MUST BE TRUE
//   imports: [

//     CommonModule, 
//     NavbarComponent,
//     RouterOutlet,
//     RouterModule,
//     UpgradeModalComponent
//   ], 
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'science-rush';
//   showNavbar = true;
  
//   constructor(private router: Router, private ui: UiService) {
    

//     // Subscribe to router events to detect URL changes
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd) // Only trigger when navigation finishes
//     ).subscribe((event: any) => {
//       // 🙈 Hide navbar if URL includes '/auth' (covers login & signup)
//       // You can add other paths here like: !event.url.includes('/admin')

//       this.showNavbar = !event.url.includes('/auth/login');
//     });
//   }
// }





import { Component, OnInit } from '@angular/core'; // <--- Import OnInit
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { filter } from 'rxjs';
import { UpgradeModalComponent } from '@shared/components/upgrade-modal/upgrade-modal.component';
import { UiService } from '@core/services/ui.service';
import { AuthService } from '@core/services/auth.service'; // <--- Import AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent,
    RouterOutlet,
    RouterModule,
    UpgradeModalComponent
  ], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit { // <--- Implement OnInit
  title = 'science-rush';
  showNavbar = true;
  
  constructor(
    private router: Router, 
    private ui: UiService,
    private auth: AuthService // <--- Inject AuthService
  ) {
    // Subscribe to router events to detect URL changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) 
    ).subscribe((event: any) => {
      this.showNavbar = !event.url.includes('/auth/login');
    });
  }

  ngOnInit() {
    // ✅ THE FIX: Sync Frontend with Backend on App Load
    // If we think we are logged in (via LocalStorage), verify it with the server.
    if (this.auth.isAuthenticated()) {
      this.auth.refreshUserFromBackend().subscribe();
    }
  }
}