import { Action } from '@ngrx/store';
import { Event } from './events.model';

export const LOAD = '[Event] Load';
export const INIT = '[Event] Init';
export const SELECT = '[Event] Select';
export const REMOVE = '[Event] Remove';

export class InitAction implements Action {
  readonly type = INIT;
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: Event) {
  }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: string) {
  }
}

export class RemoveAction implements Action {
  readonly type = REMOVE;

  constructor(public payload: string) {
  }
}

export type Actions
  = LoadAction
  | SelectAction
  | InitAction
  | RemoveAction;
