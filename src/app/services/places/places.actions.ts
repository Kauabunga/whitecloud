import { Action } from '@ngrx/store';
import { Coords } from '../map/map.model';

export const SEARCH = '[Places] Search';
export const SEARCH_SUCCESS = '[Places] Search Success';
export const SEARCH_FAILURE = '[Places] Search Failure';

export const LOOKUP = '[Places] Lookup place';
export const LOOKUP_SUCCESS = '[Places] Lookup place Success';
export const LOOKUP_FAILURE = '[Places] Lookup place Failure';

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: string | Coords) {
  }
}

export class SearchSuccessAction implements Action {
  readonly type = SEARCH_SUCCESS;

  constructor(public payload: { query: string, results: string[] }) {
  }
}

export class SearchFailureAction implements Action {
  readonly type = SEARCH_FAILURE;

  constructor(public payload: { error: string }) {
  }
}

export class LookupAction implements Action {
  readonly type = LOOKUP;

  constructor(public payload: string) {
  }
}

export class LookupSuccessAction implements Action {
  readonly type = LOOKUP_SUCCESS;

  constructor(public payload: { query: string, results: string[] }) {
  }
}

export class LookupFailureAction implements Action {
  readonly type = LOOKUP_FAILURE;

  constructor(public payload: { error: string }) {
  }
}

export type Actions
  = SearchAction
  | SearchSuccessAction
  | SearchFailureAction
  | LookupAction
  | LookupSuccessAction
  | LookupFailureAction;
