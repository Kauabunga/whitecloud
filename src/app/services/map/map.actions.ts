import {Action} from '@ngrx/store';
import {Bounds, Coords} from './map.model';


export const RESET = '[Map] Reset';
export const CLICK = '[Map] Click';
export const SET_CENTER = '[Map] Set center';
export const SEARCH = '[Map] Search';
export const SEARCH_SUCCESS = '[Map] Search Success';
export const SEARCH_FAILURE = '[Map] Search Failure';

export const LOOKUP = '[Map] Lookup place';
export const LOOKUP_SUCCESS = '[Map] Lookup place Success';
export const LOOKUP_FAILURE = '[Map] Lookup place Failure';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class ResetAction implements Action {
  readonly type = RESET;

  constructor() {
  }
}

export class ClickAction implements Action {
  readonly type = CLICK;

  constructor(public payload: Coords) {
  }
}

export class SetCenterAction implements Action {
  readonly type = SET_CENTER;

  constructor(public payload: {coords: Coords, bounds: Bounds}) {
  }
}

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: string | Coords) {
  }
}

export class SearchSuccessAction implements Action {
  readonly type = SEARCH_SUCCESS;

  constructor(public payload: {query: string, results: string[]}) {
  }
}

export class SearchFailureAction implements Action {
  readonly type = SEARCH_FAILURE;

  constructor(public payload: {error: string}) {
  }
}

export class LookupAction implements Action {
  readonly type = LOOKUP;

  constructor(public payload: string) {
  }
}

export class LookupSuccessAction implements Action {
  readonly type = LOOKUP_SUCCESS;

  constructor(public payload: {query: string, results: string[]}) {
  }
}

export class LookupFailureAction implements Action {
  readonly type = LOOKUP_FAILURE;

  constructor(public payload: {error: string}) {
  }
}



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = ClickAction
  | SetCenterAction
  | ResetAction
  | SearchAction
  | SearchSuccessAction
  | SearchFailureAction
  | LookupAction
  | LookupSuccessAction
  | LookupFailureAction
