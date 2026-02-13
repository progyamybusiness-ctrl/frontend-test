import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserIdentity {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string; // ✅ Critical: Store JWT here
  subscription?: { plan: string; status: string };
  gamification?: { streak: number; total_xp: number };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEY = 'science_rush_user';

  private userSubject = new BehaviorSubject<UserIdentity | null>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();
  public isPro$ = this.user$.pipe(map(u => u?.subscription?.plan === 'pro'));

  constructor(private http: HttpClient, private router: Router) {}

  // --- 1. LOGIN ---
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        console.log('🔥 SERVER RESPONSE:', response); 

        let user = response.data?.user || response.user || response.data;
        let token = response.token || response.data?.token || response.accessToken;

        if (Array.isArray(user)) user = user[0];

        if (user) {
          if (token && !user.token) user.token = token;
          this.handleAuthSuccess(user);
        }
      })
    );
  }

  // --- 2. SIGNUP (Restored) ---
  signup(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        console.log('✨ SIGNUP RESPONSE:', response);
        let user = response.data?.user || response.user;
        let token = response.token || response.data?.token;

        if (user) {
          if (token && !user.token) user.token = token;
          this.handleAuthSuccess(user);
        }
      })
    );
  }

  // --- 3. REFRESH ---
  refreshUserFromBackend(): Observable<UserIdentity | null> {
    return this.http.get<any>(`${environment.apiUrl}/profile/user-profile`).pipe(
      map(response => {
        if (response.status === 'success' || response.data) {
          const backendUser = response.data;
          const currentToken = this.userSubject.value?.token;
          
          const identity: UserIdentity = {
            ...backendUser, 
            token: currentToken 
          };
          
          this.updateUserState(identity);
          return identity;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  // --- 4. HELPERS ---
  updateUserState(updatedUser: UserIdentity) {
    if (!updatedUser.token && this.userSubject.value?.token) {
      updatedUser.token = this.userSubject.value.token;
    }
    this.handleAuthSuccess(updatedUser);
  }

  public isAuthenticated(): boolean { return !!this.userSubject.value; }
  public getUser(): UserIdentity | null { return this.userSubject.value; }
  public get currentUserValue(): UserIdentity | null { return this.userSubject.value; }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private handleAuthSuccess(user: UserIdentity) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getUserFromStorage(): UserIdentity | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }
}