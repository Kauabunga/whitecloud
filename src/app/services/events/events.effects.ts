import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import * as firebase from 'firebase';
import * as eventActions from './events.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { getEventsState, State } from '../../app.reducers';
import { getEntities } from './events.reducer';
import { SetCenterAction } from '../map/map.actions';

const database = firebase.database();
const eventsRef = database.ref('events');

@Injectable()
export class EventsEffects {

  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(eventActions.SELECT)
    .map(toPayload)
    .switchMap((id) =>
      this.store.select(getEventsState)
        .map(getEntities)
        .map((entities) => entities[id])
        .first()
    )
    .filter((event) => event && !!event.location)
    .map((event) => new SetCenterAction(event.location));

  // TODO add FETCH EVENT action - used by detail router

  @Effect()
  init$: Observable<Action> = this.actions$
    .ofType(eventActions.INIT)
    .map(toPayload)
    .startWith(null)
    .take(1)
    .do(console.log.bind(console, 'init events'))
    .switchMap(() => {
      const replay: ReplaySubject<Action[]> = new ReplaySubject();
      // TODO listen to child events once loaded
      eventsRef.on(
        'value',
        (snapshot) => this.handleValue(snapshot, replay),
        (err) => replay.error(err));
      eventsRef.on(
        'child_removed',
        (snapshot) => this.handleRemove(snapshot, replay),
        (err) => replay.error(err));
      return replay;
    })
    .do(console.log.bind(console, 'LOAD Events'))
    .mergeMap((actions: Action[]) => from(actions));

  constructor(private actions$: Actions,
              private zone: NgZone,
              private store: Store<State>) {
  }

  public handleRemove(snapshot, replay) {
    this.zone.run(() => replay.next([new eventActions.RemoveAction(snapshot.key)]));
  }

  public handleValue(snapshot, replay) {
    const val = snapshot.val() || {};

    const events = Object.keys(val)
      .map((key) => Object.assign(val[key], {id: key}));

    const eventsActions = events.map((event) => new eventActions.LoadAction(event));

    this.zone.run(() =>
      replay.next(eventsActions as Action[])
    );

  }

}
