import {createSelector} from 'reselect';
import * as create from './create.actions'
import * as map from '../map/map.actions'
import {Event} from '../events/events.model';
import {Coords} from '../map/map.model';


export interface State {

  saving: boolean;

  searchQuery: string;
  searchCoords: Coords;

  event: Event;

}
;

export const initialState: State = {
  saving: false,

  searchQuery: null,
  searchCoords: null,

  event: {
    id: null,
    title: null,
    imageUrl: null,
    description: null,
    location: null,
  }
};

export function reducer(state = initialState, action: create.Actions | map.Actions): State {

  switch (action.type) {

    case map.CLICK:
      const coords = action.payload;
      return {
        saving: state.saving,
        searchQuery: state.searchQuery,
        searchCoords: coords,
        event: Object.assign({}, state.event, {
          location: Object.assign({}, state.event.location, {
            coords: coords,
          })
        })
      };

    case create.SAVE_SUCCESS:
    case create.RESET:
      return initialState;

    case create.SAVE:
      return {
        saving: true,
        searchQuery: state.searchQuery,
        searchCoords: state.searchCoords,
        event: state.event
      };

    case create.UPDATE:
      const event = action.payload;
      return {
        saving: state.saving,
        searchQuery: state.searchQuery,
        searchCoords: state.searchCoords,
        event: Object.assign({}, state.event, event)
      };

    default: {
      return state;
    }
  }
}

export const getCreateEvent = (state: State) => state.event;

