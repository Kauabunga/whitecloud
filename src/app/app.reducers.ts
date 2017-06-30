import { storeFreeze } from 'ngrx-store-freeze';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ActionReducer, combineReducers } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../environments/environment';
import { compose } from '@ngrx/core/compose';
import * as fromEvents from './services/events/events.reducer';
import * as fromMap from './services/map/map.reducer';
import * as fromCreate from './services/create/create.reducer';
import * as fromAppVersion from './services/app-version/app-version.reducer';
import * as fromGeolocation from './services/geolocation/geolocation.reducer';
import * as fromPlaces from './services/places/places.reducer';

export interface State {
  version: fromAppVersion.State;
  events: fromEvents.State;
  router: fromRouter.RouterState;
  create: fromCreate.State;
  map: fromMap.State;
  geolocation: fromGeolocation.State;
  places: fromPlaces.State;
}

const reducers = {
  version: fromAppVersion.reducer,
  events: fromEvents.reducer,
  router: fromRouter.routerReducer,
  create: fromCreate.reducer,
  map: fromMap.reducer,
  geolocation: fromGeolocation.reducer,
  places: fromPlaces.reducer,
};

const developmentReducer: ActionReducer<State> = compose(
  storeFreeze,
  localStorageSync({
    keys: ['events', 'map', 'version'],
    rehydrate: true
  }),
  combineReducers,
)(reducers);
const productionReducer: ActionReducer<State> = compose(
  localStorageSync({
    keys: ['events', 'map', 'version'],
    rehydrate: true
  }),
  combineReducers,
)(reducers);

export function reducer(state: any, action: any) {
  if ('production' === ENV) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

export const getEventsState = (state: State, ...args) => state.events;
export const getVersionState = (state: State, ...args) => state.version;
export const getCreateState = (state: State, ...args) => state.create;
export const getMapState = (state: State, ...args) => state.map;
export const getRouterState = (state: State, ...args) => state.router.path;
export const getGeolocationState = (state: State, ...args) => state.geolocation;
export const getPlacesState = (state: State, ...args) => state.places;
