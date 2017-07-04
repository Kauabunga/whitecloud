import * as image from './images.actions';
import { Image } from './images.model';

export interface State {
  images: {
    [id: string]: Image;
  };
}

export const initialState: State = {
  images: {},
};

export function reducer(state = initialState, action: image.Actions): State {

  switch (action.type) {

    case image.LOAD_SUCCESS: {
      const {id, image} = action.payload;
      return {
        images: Object.assign({}, state.images, {
          [id]: image
        })
      };
    }

    default: {
      return state;
    }
  }
}

export const getImages = (state: State) => state.images;
