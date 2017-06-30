import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as geolocationActions from './geolocation.actions';
import { State } from '../../app.reducers';

@Injectable()
export class GeolocationEffects {

  @Effect()
  getUserGeolocation$: Observable<Action> = this.actions$
    .ofType(geolocationActions.GET_GEOLOCATION)
    .mergeMap(() =>
      Observable.from(
        new Promise((success, failure) =>
          navigator.geolocation.getCurrentPosition(success, failure)
        )
      )
    )
    .map((position: Position) =>
      new geolocationActions.GetGeolocationSuccessAction(position)
    )
    .catch((err: PositionError, errStream) =>
      Observable.of(new geolocationActions.GetGeolocationFailureAction(err))
    )
    .do(console.warn.bind(console, 'getUserGeolocation$ action'));

  constructor(private actions$: Actions,
              private store: Store<State>) {
  }

}
