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
  constructor(public payload: Error) {
  }
}

export class ResetAction implements Action {
  readonly type = RESET;
}

export type Actions
  = InitAction
  | SelectingLocationAction
  | SaveAction
  | SaveSuccessAction
  | SaveFailureAction
  | UpdateAction
  | UpdateLocationAction
  | ResetAction;
