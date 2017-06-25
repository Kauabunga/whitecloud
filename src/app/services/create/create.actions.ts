import {Action} from '@ngrx/store';


export const SAVE = '[Create] Save';
export const SAVE_SUCCESS = '[Create] Save Success';
export const SAVE_FAILURE = '[Create] Save Failure';
export const INIT = '[Create] Init';
export const RESET = '[Create] Reset';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class InitAction implements Action {
  readonly type = INIT;

  constructor() {
  }
}

export class SaveAction implements Action {
  readonly type = SAVE;

  constructor() {
  }
}

export class SaveSuccessAction implements Action {
  readonly type = SAVE_SUCCESS;

  constructor() {
  }
}

export class SaveFailureAction implements Action {
  readonly type = SAVE_FAILURE;

  constructor() {
  }
}

export class ResetAction implements Action {
  readonly type = RESET;

  constructor() {
  }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = InitAction
  | SaveAction
  | SaveSuccessAction
  | SaveFailureAction
  | ResetAction;
