import {Action} from '@ngrx/store';
import {Coords} from './map.model';


export const CLICK = '[Map] Click';


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




/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = ClickAction;
