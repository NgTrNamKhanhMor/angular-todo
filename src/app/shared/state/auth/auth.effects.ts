import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { LoginActions, RegisterActions } from './auth.actions';
import { Store } from '@ngrx/store';
import { AuthService } from 'app/auth/services/auth.service';
import * as ErrorActions from '../error/error.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private store = inject(Store);
  private router = inject(Router);

  /**
   * Effect to handle login requests
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      switchMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((user) => LoginActions.loginSuccess({ user })),
          catchError((error) => {
            this.store.dispatch(
              ErrorActions.showError({ message: error.message })
            );
            return of(LoginActions.loginFailure({ error: error.message }));
          })
        )
      )
    )
  );
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loginSuccess),
        map(() => {
          this.router.navigate(['/todo-list']);
        })
      ),
    { dispatch: false } // No action is dispatched, just performing a side effect
  );
  /**
   * Effect to handle register requests
   */
  //   register$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(RegisterActions.register),
  //       mergeMap((action) =>
  //         this.authService
  //           .register(action.email, action.password, action.name)
  //           .pipe(
  //             map((user) => RegisterActions.registerSuccess({ user })),
  //             catchError((error) =>
  //               of(RegisterActions.registerFailure({ error: error.message }))
  //             )
  //           )
  //       )
  //     )
  //   );

  /**
   * Effect to handle login and register failures
   * and dispatch global error action
   */
  //   handleError$ = createEffect(
  //     () =>
  //       this.actions$.pipe(
  //         ofType(LoginActions.loginFailure, RegisterActions.registerFailure),
  //         tap((action) => {
  //           this.store.dispatch(
  //             AuthActions.setCurrentUser({ user: null }) // optional: reset current user on failure
  //           );
  //           // Dispatch the global error action here
  //           this.store.dispatch(AuthActions.showError({ error: action.error }));
  //         })
  //       ),
  //     { dispatch: false }
  //   );
}
