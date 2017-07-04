import { Action } from '@ngrx/store';
import { Stats } from './stats.model';

export const LOAD = '[Stats] Load';
export const LOAD_SUCCESS = '[Stats] Load Success';
export const LOAD_FAILURE = '[Stats] Load Failure';

export class LoadAction implements Action {
  readonly type = LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: Stats) {
  }
}

export class LoadFailureAction implements Action {
  readonly type = LOAD_FAILURE;

  constructor(public payload: Error) {
  }
}

export type Actions
  = LoadAction
  | LoadSuccessAction
  | LoadFailureAction;
