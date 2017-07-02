import * as stats from './stats.actions';
import { Stats } from './stats.model';

export interface State {
  stats: Stats;
}

export const initialState: State = {
  stats: null
};

export function reducer(state = initialState, action: stats.Actions): State {

  switch (action.type) {

    default: {
      return state;
    }
  }
}

export const getStats = (state: State) => state.stats;
