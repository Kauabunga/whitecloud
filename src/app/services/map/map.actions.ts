import { Action } from '@ngrx/store';
import { Bounds, Coords } from './map.model';

export const RESET = '[Map] Reset';
export const CLICK = '[Map] Click';
export const SET_CENTER = '[Map] Set center';

export class ResetAction implements Action {
  readonly type = RESET;
}

export class ClickAction implements Action {
  readonly type = CLICK;

  constructor(public payload: Coords) {
  }
}

export class SetCenterAction implements Action {
  readonly type = SET_CENTER;

  constructor(public payload: { coords: Coords, zoom?: number, bounds?: Bounds }) {
  }
}

export type Actions
  = ClickAction
  | SetCenterAction
  | ResetAction;
