import { createSelector } from 'reselect';
import { Event } from './events.model';
import * as event from './events.actions';

export interface State {
  ids: string[];
  entities: { [id: string]: Event };
  selectedEventId: string | null;
  loaded: boolean;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedEventId: null,
  loaded: false,
};

export function reducer(state = initialState, action: event.Actions): State {

  switch (action.type) {

    case event.LOAD_ALL: {
      const events = action.payload;
      return Object.assign({}, state, {
        entities: Object.keys(events)
          .map((key) => Object.assign({}, events[key], {id: key}))
          .reduce((acc, current) => Object.assign(acc, {[current.id]: current}), {}),
        ids: Object.keys(events),
        loaded: true,
      });
    }

    case event.LOAD: {
      const loadedEvent = action.payload;

      if (state.ids.indexOf(loadedEvent.id) > -1) {
        return state;
      }

      return {
        ids: [...state.ids, loadedEvent.id],
        entities: Object.assign({}, state.entities, {[loadedEvent.id]: loadedEvent}),
        selectedEventId: state.selectedEventId,
        loaded: true,
      };
    }

    case event.SELECT:
      return {
        ids: state.ids,
        entities: state.entities,
        selectedEventId: action.payload,
        loaded: state.loaded,
      };

    case event.REMOVE: {
      const removeId: string = action.payload;
      const entities = Object.assign({}, state.entities);
      delete entities[removeId];
      return {
        ids: state.ids.filter((id) => id !== removeId),
        entities,
        selectedEventId: state.selectedEventId === removeId
          ? null
          : state.selectedEventId,
        loaded: state.loaded,
      };
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => Object.keys(state.entities);

export const getSelectedId = (state: State) => state.selectedEventId;

export const getEventsLoaded = (state: State) => state.loaded;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getNextId = createSelector(getEntities, getIds, getSelectedId, (entities, ids, selectedId) => {
  const index = ids.indexOf(selectedId);
  const length = ids.length;
  return index >= 0 && index < length - 1
    ? ids[index + 1]
    : ids[0];
});

export const getPreviousId = createSelector(getEntities, getIds, getSelectedId, (entities, ids, selectedId) => {
  const index = ids.indexOf(selectedId);
  const length = ids.length;
  return index === 0
    ? ids[length - 1]
    : ids[index - 1];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids): Event[] => {
  return ids
    .map((id) => entities[id])
    // TODO shouldn't need this filter?
    .filter((entity) => !!entity);
});
