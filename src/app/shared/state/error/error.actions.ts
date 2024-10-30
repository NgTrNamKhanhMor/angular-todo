import { createAction, props } from '@ngrx/store';

export const showError = createAction(
  '[Error] Show Error',
  props<{ message: string }>()
);

export const hideError = createAction('[Error] Hide Error');
