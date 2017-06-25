import {createSelector} from 'reselect';
import * as create from './create.actions'
import * as map from '../map/map.actions'
import {Event} from '../events/events.model';


export interface State {

  saving: boolean;

  event: Event;

};

export const initialState: State = {
  saving: false,
  event: {
    id: null,
    imageUrl: null,
    description: null,
    lat: null,
    lng: null,
  }
};

export function reducer(state = initialState, action: create.Actions | map.Actions): State {

  switch (action.type) {

    case map.CLICK:
      const coords = action.payload;
      return {
        saving: state.saving,
        event: Object.assign({}, state.event, {
          lat: coords.lat,
          lng: coords.lng,
        })
      };

    case create.SAVE_SUCCESS:
    case create.RESET:
      return initialState;

    case create.SAVE:
      return {
        saving: true,
        event: state.event
      };

    default: {
      return state;
    }
  }
}

export const getCreateEvent = (state: State) => state.event;
