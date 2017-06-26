import { createSelector } from 'reselect';
import * as create from './create.actions';
import * as map from '../map/map.actions';
import { Event } from '../events/events.model';
import { Coords } from '../map/map.model';

export interface State {

  saving: boolean;
  selectingLocation: boolean;

  searchQuery: string;
  searchCoords: Coords;

  event: Event;

}
;

export const initialState: State = {

  saving: false,
  selectingLocation: true,

  searchQuery: null,
  searchCoords: null,

  event: {
    id: null,
    title: null,
    imageUrl: null,
    description: null,
    location: {
      coords: null,
      bounds: null,
      place_id: null,
      description: null,
    },
  }
};

export function reducer(state = initialState, action: create.Actions | map.Actions): State {

  switch (action.type) {

    case map.CLICK:

      if (!state.selectingLocation) {
        return state;
      }

      const coords = action.payload;
      return {
        selectingLocation: state.selectingLocation,
        saving: state.saving,
        searchQuery: state.searchQuery,
        searchCoords: coords,
        event: Object.assign({}, state.event, {
          location: Object.assign({}, state.event.location, {
            coords,
          })
        })
      };

    case create.SAVE_SUCCESS:
    case create.RESET:
      return initialState;

    case create.SAVE:
      return {
        selectingLocation: state.selectingLocation,
        saving: true,
        searchQuery: state.searchQuery,
        searchCoords: state.searchCoords,
        event: state.event
      };

    case create.UPDATE:
      const event = action.payload;
      return {
        selectingLocation: state.selectingLocation,
        saving: state.saving,
        searchQuery: state.searchQuery,
        searchCoords: state.searchCoords,
        event: Object.assign({}, state.event, event, {
          location: Object.assign({}, state.event.location, event.location)
        })
      };

    case create.UPDATE_LOCATION:

      const location = action.payload;
      console.log('UPDATE_LOCATION', location);
      return {
        selectingLocation: state.selectingLocation,
        saving: state.saving,
        searchQuery: state.searchQuery,
        searchCoords: state.searchCoords,
        event: Object.assign({}, state.event, {
          location: Object.assign({}, state.event.location, location)
        })
      };

    default: {
      return state;
    }
  }
}

export const getCreateEvent = (state: State) => state.event;

export const getSearchCoords = (state: State) => state.searchCoords;
