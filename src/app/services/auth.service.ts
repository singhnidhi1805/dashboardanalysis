import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://interview.bigyellowfish.io/api/User/authenticate';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl, { Username: username, Password: password })
      .pipe(
        tap(user => {
          this.currentUser = user;
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('token', user.token);
          }
        })
      );
  }

  logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
