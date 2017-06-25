import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import {Injectable, NgZone} from '@angular/core';
import {Effect, Actions, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';
import {empty} from 'rxjs/observable/empty';
import {of} from 'rxjs/observable/of';
import * as firebase from 'firebase';
import * as eventActions from './events.actions';
import {Event} from './events.model';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {getEventsState, State} from '../../app.reducers';
import {getEntities} from './events.reducer';
import {SetCenterAction} from '../map/map.actions';


const database = firebase.database();

const eventsRef = database.ref('events');


// clearAndRandomiseEvents();

function clearAndRandomiseEvents() {
  var clearUpdates = {};
  clearUpdates['/events'] = {}
  firebase.database().ref().update(clearUpdates)
    .then(() => {
      var updates = {};

      for (var i = 0; i < 20; i++) {
        var newEventKey = eventsRef.push().key;
        updates['/events/' + newEventKey] = <Event> {
          id: null,
          title: newEventKey,
          location: {
            description: null,
            coords: {
              lat: getRandom(-36, -44),
              lng: getRandom(170, 182),
            },
            bounds: null,
            place_id: null,
          },
          imageUrl: 'https://unsplash.it/400/300/?random&asdf=' + Math.random(),
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
        };
      }
      firebase.database().ref().update(updates)
    });


  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}


/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 * The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * Documentation on `toPayload` can be found here:
 * https://github.com/ngrx/effects/blob/master/docs/api.md#topayload
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */
@Injectable()
export class EventsEffects {

  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(eventActions.SELECT)
    .map(toPayload)
    .switchMap((id) =>
      this.store.select(getEventsState)
        .map(getEntities)
        .map(entities => entities[id])
        .first()
    )
    .filter(event => event && !!event.location)
    .map(event => new SetCenterAction(event.location));

  @Effect()
  init$: Observable<Action> = this.actions$
    .ofType(eventActions.INIT)
    .map(toPayload)
    .startWith(null)
    .first()
    .switchMap(() => {
      let replay: ReplaySubject<Action[]> = new ReplaySubject();

      eventsRef.on('value', snapshot => this.handleValue(snapshot, replay));
      eventsRef.on('child_removed', snapshot => this.handleRemove(snapshot, replay));

      return replay;
    })
    .mergeMap((actions: Action[]) => from(actions));

  handleRemove(snapshot, replay) {
    this.zone.run(() => replay.next([new eventActions.RemoveAction(snapshot.key)]));
  }

  handleValue(snapshot, replay) {
    const val = snapshot.val() || {};

    const events = Object.keys(val)
      .map(key => Object.assign(val[key], {id: key}));

    const eventsActions = events.map(event => new eventActions.LoadAction(event));

    this.zone.run(() =>
      replay.next(eventsActions as Action[])
    );

  }

  constructor(private actions$: Actions,
              private zone: NgZone,
              private store: Store<State>) {
  }
}
