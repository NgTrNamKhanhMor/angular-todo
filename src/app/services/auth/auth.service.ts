import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://66d963034ad2f6b8ed546b61.mockapi.io/api/users';
  private currentUser: User | null = null; 

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.currentUser = user;
        }
        return user || null;
      }),
      catchError(error => {
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
    this.router.navigate(['/login']);
  }
}
