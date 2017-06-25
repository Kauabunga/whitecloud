import { createSelector } from 'reselect';
import * as map from './map.actions'


export interface State {

};

export const initialState: State = {

};

export function reducer(state = initialState, action: map.Actions): State {

  switch (action.type) {

    case map.CLICK:
      return state;

    default: {
      return state;
    }
  }
}
