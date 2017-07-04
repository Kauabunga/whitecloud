import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/observable/from';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as createActions from './create.actions';
import { getCreateState, State } from '../../app.reducers';
import { getCreateEvent, getCreateSaving } from './create.reducer';
import { go } from '@ngrx/router-store';
import { MdSnackBar } from '@angular/material';
import * as firebaseService from '../firebase/firebase.service';

const eventsRef = 'events';

@Injectable()
export class CreateEffects {

  @Effect()
  save$: Observable<Action> = this.actions$
    .ofType(createActions.SAVE)
    .map(toPayload)
    .switchMap(this.getCreateEvent.bind(this))
    .combineLatest(this.getCreateSaving(), (createEvent, saving) => ({createEvent, saving}))
    .filter(({saving}) => !saving)
    .do(console.log.bind(console, 'createEvent'))
    .switchMap(({createEvent}) =>
      firebaseService.push(eventsRef, createEvent)
        .mapTo(new createActions.SaveSuccessAction())
        .catch((err, errStream) => Observable.of(new createActions.SaveFailureAction(err)))
    );

  @Effect()
  saveSuccess$: Observable<Action> = this.actions$
    .ofType(createActions.SAVE_SUCCESS)
    .map(toPayload)
    .do(() => this.snackBar.open('Created new event', 'Undo', {duration: 2000}))
    .mapTo(go(['']));

  constructor(private actions$: Actions,
              private store: Store<State>,
              private snackBar: MdSnackBar) {
  }

  public getCreateEvent() {
    return this.store.select(getCreateState)
      .map(getCreateEvent)
      .first();
  }

  public getCreateSaving() {
    return this.store.select(getCreateState)
      .map(getCreateSaving)
      .first();
  }

}
