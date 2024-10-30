import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from 'app/shared/types/user';

/**
 * Login Actions
 */
export const LoginActions = createActionGroup({
  source: 'Auth/Login',
  events: {
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),
  },
});

/**
 * Register Actions
 */
export const RegisterActions = createActionGroup({
  source: 'Auth/Register',
  events: {
    Register: props<{ email: string; password: string; name: string }>(),
    'Register Success': props<{ user: User }>(),
    'Register Failure': props<{ error: string }>(),
  },
});

/**
 * General Auth Actions
 */
export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Logout: emptyProps(),
    'Set Current User': props<{ user: User | null }>(),
  },
});
