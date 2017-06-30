import { Action } from '@ngrx/store';
import { Geolocation } from './geolocation.model';

export const GET_GEOLOCATION = '[Geolocation] Get';
export const GET_GEOLOCATION_SUCCESS = '[Geolocation] Get success';
export const GET_GEOLOCATION_FAILURE = '[Geolocation] Get failure';

export class GetGeolocationAction implements Action {
  readonly type = GET_GEOLOCATION;
}

export class GetGeolocationSuccessAction implements Action {
  readonly type = GET_GEOLOCATION_SUCCESS;

  constructor(public payload: Geolocation) {
  }
}

export class GetGeolocationFailureAction implements Action {
  readonly type = GET_GEOLOCATION_FAILURE;

  constructor(public payload: PositionError) {
  }
}

export type Actions
  = GetGeolocationAction
  | GetGeolocationSuccessAction
  | GetGeolocationFailureAction;
