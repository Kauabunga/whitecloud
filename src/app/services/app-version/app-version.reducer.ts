import * as appVersion from './app-version.actions';

export interface State {
  version: string;
}

export const initialState: State = {
  version: require('../../../../package.json').version
};

export function reducer(state = initialState, action: appVersion.Actions): State {

  switch (action.type) {

    case appVersion.UPDATE:
      return {
        version: action.payload || state.version
      };

    default: {
      return state;
    }
  }
}

export const getVersion = (state: State) => state.version;
