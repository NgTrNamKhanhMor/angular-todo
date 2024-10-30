import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as ErrorActions from './error.actions';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ErrorEffects {
  private actions$ = inject(Actions);
  private snackBar = inject(MatSnackBar);

  showError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ErrorActions.showError),
        tap(({ message }) => {
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        })
      ),
    { dispatch: false }
  );
}
