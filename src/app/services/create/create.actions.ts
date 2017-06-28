import { Action } from '@ngrx/store';
import { Event, EventLocation } from '../events/events.model';

export const SAVE = '[Create] Save';
export const SAVE_SUCCESS = '[Create] Save Success';
export const SAVE_FAILURE = '[Create] Save Failure';
export const INIT = '[Create] Init';
export const RESET = '[Create] Reset';
export const UPDATE = '[Create] Update';
export const UPDATE_LOCATION = '[Create] Update location';
export const SELECTING_LOCATION = '[Create] Selecting location';

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

export class UpdateAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: Event) {
  }
}
export class UpdateLocationAction implements Action {
  readonly type = UPDATE_LOCATION;

  constructor(public payload: EventLocation) {
  }
}

export class SelectingLocationAction implements Action {
  readonly type = SELECTING_LOCATION;

  constructor(public payload: boolean) {
  }
}

export class SaveAction implements Action {
  readonly type = SAVE;
}

export class SaveSuccessAction implements Action {
  readonly type = SAVE_SUCCESS;
}

export class SaveFailureAction implements Action {
  readonly type = SAVE_FAILURE;
}

export class ResetAction implements Action {
  readonly type = RESET;
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = InitAction
  | SelectingLocationAction
  | SaveAction
  | SaveSuccessAction
  | SaveFailureAction
  | UpdateAction
  | UpdateLocationAction
  | ResetAction;
