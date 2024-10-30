import { createReducer, on } from '@ngrx/store';
import { AuthActions, LoginActions, RegisterActions } from './auth.actions';
import { User } from 'app/shared/types/user';

export interface AuthState {
  currentUser: User | null;
  isSubmitting: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  isSubmitting: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,

  // Login Actions
  on(LoginActions.login, (state) => ({
    ...state,
    isSubmitting: true,
    error: null,
  })),
  on(LoginActions.loginSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    isSubmitting: false,
    error: null,
  })),
  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    isSubmitting: false,
    error,
  })),

  // Register Actions
  on(RegisterActions.register, (state) => ({
    ...state,
    isSubmitting: true,
    error: null,
  })),
  on(RegisterActions.registerSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    isSubmitting: false,
    error: null,
  })),
  on(RegisterActions.registerFailure, (state, { error }) => ({
    ...state,
    isSubmitting: false,
    error,
  })),

  // General Auth Actions
  on(AuthActions.logout, (state) => ({
    ...state,
    currentUser: null,
    isSubmitting: false,
    error: null,
  })),
  on(AuthActions.setCurrentUser, (state, { user }) => ({
    ...state,
    currentUser: user,
  }))
);
