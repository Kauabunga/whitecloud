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

    case event.LOAD:
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

    case event.SELECT:
      return {
        ids: state.ids,
        entities: state.entities,
        selectedEventId: action.payload,
        loaded: state.loaded,
      };

    case event.REMOVE:
      const removeId: string = action.payload;
      return {
        ids: state.ids.filter((id) => id !== removeId),
        entities: Object.assign({}, state.entities, {[removeId]: null}),
        selectedEventId: state.selectedEventId === removeId
          ? null
          : state.selectedEventId,
        loaded: state.loaded,
      };

    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

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
