import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.currentUser
);

export const selectAuthSubmitting = createSelector(
  selectAuthState,
  (authState) => authState.isSubmitting
);

export const selectAuthError = createSelector(
  selectAuthState,
  (authState) => authState.error 
);


