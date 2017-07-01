import * as image from './images.actions';
import { Image } from './images.model';

export interface State {
}

export const initialState: State = {};

export function reducer(state = initialState, action: image.Actions): State {

  switch (action.type) {

    default: {
      return state;
    }
  }
}
