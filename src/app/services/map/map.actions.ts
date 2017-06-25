import {Action} from '@ngrx/store';
import {Coords} from './map.model';


export const CLICK = '[Map] Click';
export const SEARCH = '[Map] Search';
export const SEARCH_SUCCESS = '[Map] Search Success';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class ClickAction implements Action {
  readonly type = CLICK;

  constructor(public payload: Coords) {
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



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = ClickAction
  | SearchAction
  | SearchSuccessAction;
