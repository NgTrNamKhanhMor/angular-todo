import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { errorReducer } from './error/error.reducer';
import { authReducer } from './auth/auth.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
  error: errorReducer,
};
