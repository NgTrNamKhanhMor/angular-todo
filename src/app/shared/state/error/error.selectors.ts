import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ErrorState } from './error.reducer';

export const selectErrorState = createFeatureSelector<ErrorState>('error');
export const selectErrorMessage = createSelector(
  selectErrorState,
  (state) => state.message
);
