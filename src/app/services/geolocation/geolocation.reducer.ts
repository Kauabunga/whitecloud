import * as geolocation from './geolocation.actions';

export interface State {

}

export const initialState: State = {};

export function reducer(state = initialState, action: geolocation.Actions): State {

  switch (action.type) {

    case geolocation.GET_GEOLOCATION:
    case geolocation.GET_GEOLOCATION_FAILURE:
    case geolocation.GET_GEOLOCATION_SUCCESS:
      return state;

    default: {
      return state;
    }
  }
}
