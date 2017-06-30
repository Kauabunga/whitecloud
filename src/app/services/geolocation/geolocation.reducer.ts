import * as geolocation from './geolocation.actions';

export interface State {

}

export const initialState: State = {};

export function reducer(state = initialState, action: geolocation.Actions): State {

  switch (action.type) {

    case geolocation.UPDATE:
      return state;

    default: {
      return state;
    }
  }
}
