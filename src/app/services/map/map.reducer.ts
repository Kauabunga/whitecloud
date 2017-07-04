import * as map from './map.actions';
import { Coords, Map } from './map.model';

export interface State {
  map: Map;

  mapInstance?: any;
}

export const initialState: State = {
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

    case map.SET_CENTER: {
      const {coords, bounds, zoom} = action.payload;
      return {
        map: Object.assign({}, map, {
          lat: coords.lat || initialState.map.lat,
          lng: coords.lng || initialState.map.lng,
          bounds,
          zoom: zoom || 10,
        }),
      };
    }

    case map.RESET:
      return initialState;

    case map.CLICK:
    default: {
      return state;
    }
  }
}

export const getMap = (state: State) => state.map;
export const getMapId = (coords: Coords) => `${coords.lng}${coords.lat}`;
