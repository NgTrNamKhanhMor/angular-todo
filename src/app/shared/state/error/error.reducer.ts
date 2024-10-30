import { createReducer, on } from '@ngrx/store';
import * as ErrorActions from './error.actions';

export interface ErrorState {
  message: string | null;
}

export const initialState: ErrorState = {
  message: null,
};

export const errorReducer = createReducer(
  initialState,
  on(ErrorActions.showError, (state, { message }) => ({ ...state, message })),
  on(ErrorActions.hideError, (state) => ({ ...state, message: null }))
);
