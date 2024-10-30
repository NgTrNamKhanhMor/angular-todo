import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from 'app/shared/types/user';
import { environment } from '@environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage(); 
  }

  private loadUserFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
      }
    }
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          this.currentUser = user;
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(user)); 
          }
        }
        return user || null;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser'); 
    }
    this.router.navigate(['/login']);
  }
}
