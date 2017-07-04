import * as map from './map.actions';
import { Coords, Map } from './map.model';

export interface State {
  search: { [id: string]: { description: string } };
  places: { [id: string]: { description: string } };
  map: Map;

  mapInstance?: any;
}

export const initialState: State = {
  search: {},
  places: {},
  map: {
    lat: -41,
    lng: 172,
    zoom: 6,
    bounds: {
      south: -47.408938145433844,
      west: 164.90283203125,
      north: -34.12020924030118,
      east: -177.60693359375
    }
  }
};

export function reducer(state = initialState, action: map.Actions): State {

  switch (action.type) {

    case map.SEARCH_SUCCESS: {
      let {query, results} = action.payload;
      return {
        search: Object.assign({}, state.search, {
          [query]: results
        }),
        places: state.places,
        map: state.map
      };
    }

    case map.LOOKUP_SUCCESS: {
      let {query, results} = action.payload;
      return {
        places: Object.assign({}, state.places, {
          [query]: results
        }),
        search: state.search,
        map: state.map
      };
    }

    case map.SET_CENTER: {
      let {coords, bounds, zoom} = action.payload;
      return {
        map: Object.assign({}, map, {
          lat: coords.lat || initialState.map.lat,
          lng: coords.lng || initialState.map.lng,
          bounds,
          zoom: zoom || 10,
        }),
        search: state.search,
        places: state.places,
      };
    }

    case map.RESET:
      return initialState;

    case map.CLICK:
    case map.SEARCH:
    default: {
      return state;
    }
  }
}

export const getSearches = (state: State) => state.search;
export const getPlaces = (state: State) => state.places;
export const getMap = (state: State) => state.map;

export const getMapId = (coords: Coords) => `${coords.lng}${coords.lat}`;
