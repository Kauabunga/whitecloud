import { Action } from '@ngrx/store';

export const UPDATE = '[App Version] Update';

export class UpdateAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: string) {
  }
}

export type Actions
  = UpdateAction;
