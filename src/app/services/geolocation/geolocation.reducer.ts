import * as geolocation from './geolocation.actions';
import { Geolocation } from './geolocation.model';
import { createSelector } from 'reselect';

export interface State {
  geolocation: Geolocation;

  sharingLocation: boolean;
  notified: boolean;
}

export const initialState: State = {
  geolocation: null,

  sharingLocation: false,
  notified: false,
};

export function reducer(state = initialState, action: geolocation.Actions): State {

  switch (action.type) {

    case geolocation.GET_GEOLOCATION:
      return {
        geolocation: state.geolocation,
        sharingLocation: state.sharingLocation,
        notified: true,
      };

    case geolocation.GET_GEOLOCATION_SUCCESS:
      return {
        geolocation: action.payload,
        sharingLocation: state.sharingLocation,
        notified: state.notified,
      };

    case geolocation.GET_GEOLOCATION_FAILURE:
      return state;

    default: {
      return state;
    }
  }
}

export const getGeolocation = (state: State) => state.geolocation;
export const getCoords = createSelector(getGeolocation, (geolocation) => geolocation && geolocation.coords);
export const getTimestamp = createSelector(getGeolocation, (geolocation) => geolocation && geolocation.timestamp);
