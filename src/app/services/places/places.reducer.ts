import * as place from './places.actions';
import { Place } from './places.model';

export interface State {
  search: { [id: string]: Place[] };
  places: { [id: string]: Place };
}

export const initialState: State = {
  search: {},
  places: {},
};

export function reducer(state = initialState, action: place.Actions): State {

  switch (action.type) {

    case place.SEARCH_SUCCESS: {
      const {query, results} = action.payload;
      return {
        search: Object.assign({}, state.search, {
          [query]: results
        }),
        places: state.places,
      };
    }

    case place.LOOKUP_SUCCESS: {
      const {query, results} = action.payload;
      return {
        places: Object.assign({}, state.places, {
          [query]: results
        }),
        search: state.search,
      };
    }

    default: {
      return state;
    }
  }
}

export const getSearches = (state: State) => state.search;
export const getPlaces = (state: State) => state.places;
