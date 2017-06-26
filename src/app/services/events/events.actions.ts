import { Action } from '@ngrx/store';
import { Event } from './events.model';

export const LOAD = '[Event] Load';
export const INIT = '[Event] Init';
export const SELECT = '[Event] Select';
export const REMOVE = '[Event] Remove';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
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

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = LoadAction
  | SelectAction
  | InitAction
  | RemoveAction;
