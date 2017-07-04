import { Action } from '@ngrx/store';
import { Event } from './events.model';

export const LOAD_ALL = '[Event] Load all';

export const LOAD = '[Event] Load';
export const LOAD_SUCCESS = '[Event] Load success';
export const LOAD_FAILURE = '[Event] Load failure';

export const INIT = '[Event] Init';
export const SELECT = '[Event] Select';
export const REMOVE = '[Event] Remove';

export class InitAction implements Action {
  readonly type = INIT;
}

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;

  constructor(public payload: {[id: string]: Event}) {
  }
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
  | LoadAllAction
  | SelectAction
  | InitAction
  | RemoveAction;
