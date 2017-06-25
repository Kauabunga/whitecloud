import { createSelector } from 'reselect';
import * as map from './map.actions'


export interface State {
  places: {[id: string]: {description: string}};
};

export const initialState: State = {
  places: {}
};

export function reducer(state = initialState, action: map.Actions): State {

  switch (action.type) {


    case map.SEARCH_SUCCESS:
      const {query, results} = action.payload;
      return {
        places: Object.assign({}, state.places, {
          [query]: results
        })
      };

    case map.CLICK:
    case map.SEARCH:
    default: {
      return state;
    }
  }
}

export const getPlaces = (state: State) => state.places;
