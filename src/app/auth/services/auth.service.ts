import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from 'app/shared/types/user';
import { environment } from '@environments/environments.prod';
import { AppState } from 'app/shared/state/app.state';
import { Store } from '@ngrx/store';
import { AuthActions, LoginActions } from 'app/shared/state/auth/auth.actions';
import { selectCurrentUser } from 'app/shared/state/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private store = inject(Store<AppState>);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        const user: User = JSON.parse(userJson);
        this.store.dispatch(AuthActions.setCurrentUser({ user })); 
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          this.store.dispatch(LoginActions.loginSuccess({ user }));
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        } else {
          throw new Error('Invalid credentials'); 
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        this.store.dispatch(
          LoginActions.loginFailure({ error: error.message }) 
        );
        throw error; 
      })
    );
  }

  getCurrentUser(){
    return this.store.select(selectCurrentUser)
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }
}
