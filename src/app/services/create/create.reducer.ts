import * as create from './create.actions';
import * as map from '../map/map.actions';
import * as places from '../places/places.actions';
import { Event } from '../events/events.model';
import { Coords } from '../map/map.model';

export interface State {

  saving: boolean;
  selectingLocation: boolean;

  searchQuery: string;
  searchCoords: Coords;

  event: Event;

}

export const initialState: State = {

  saving: false,
  selectingLocation: true,

  searchQuery: null,
  searchCoords: null,

  event: {
    id: null,
    imageId: null,
    description: null,
    owner: null,
    pest: null,
    location: {
      coords: null,
      bounds: null,
      place_id: null,
      description: null,
    },
  }
};

export function reducer(state = initialState, action: create.Actions | map.Actions | places.Actions): State {

  console.log('create', action.type, (action as any).payload);

  switch (action.type) {

    case map.CLICK:
      if (!state.selectingLocation) {
        return state;
      }
      const coords = action.payload;
      return {
        selectingLocation: state.selectingLocation,
        saving: state.saving,
        searchQuery: null,
        searchCoords: coords,
        event: Object.assign({}, state.event, {
          location: Object.assign({}, state.event.location, {
            coords,
          })
        })
      };

    case places.SEARCH: {
      const query = action.payload;
      console.log('places.SEARCH', query);
      return Object.assign({}, state, {
        searchQuery: typeof query === 'string' ? action.payload : null,
        searchCoords: typeof query !== 'string' ? action.payload : null,
      });
    }

    case create.SELECTING_LOCATION:
      return Object.assign({}, state, {
        selectingLocation: action.payload,
      });

    case create.SAVE_SUCCESS:
    case create.SAVE_FAILURE:
      return Object.assign({}, state, {
        saving: false,
      });

    case create.RESET:
      return Object.assign({}, initialState, {
        selectingLocation: state.selectingLocation
      });

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
export const getCreateSaving = (state: State) => state.saving;
export const getSearchCoords = (state: State) => state.searchCoords;
