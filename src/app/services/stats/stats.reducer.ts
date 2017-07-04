import * as stats from './stats.actions';
import { Stats } from './stats.model';

export interface State {
  stats: Stats;
}

export const initialState: State = {
  stats: {
    updatedAt: null,
    total: 0,
    pests: null,
  },
};

export function reducer(state = initialState, action: stats.Actions): State {

  switch (action.type) {

    case stats.LOAD_SUCCESS: {
      return {
        stats: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getStats = (state: State) => state.stats;
