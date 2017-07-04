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
import { getGeolocationState, State } from '../../app.reducers';
import { getGeolocation } from './geolocation.reducer';
import { Geolocation } from './geolocation.model';

@Injectable()
export class GeolocationEffects {

  @Effect()
  getUserGeolocation$: Observable<Action> = this.actions$
    .ofType(geolocationActions.GET_GEOLOCATION)
    .mergeMap(() =>
      this.store.select(getGeolocationState)
        .map(getGeolocation)
        .take(1)
    )
    .do(console.warn)
    .mergeMap((geolocation: Geolocation) =>
      ((geolocation && geolocation.timestamp || Infinity) - (60 * 1000 * 60)) > Date.now()
        ? this.getGeolocation()
        : Observable.of(Object.assign({}, geolocation, {timestamp: Date.now()}))
    )
    .map((geolocation: Geolocation) =>
      new geolocationActions.GetGeolocationSuccessAction(geolocation)
    )
    .catch((err: PositionError, errStream) =>
      Observable.of(new geolocationActions.GetGeolocationFailureAction(err))
    );

  constructor(private actions$: Actions,
              private store: Store<State>) {
  }

  public getGeolocation(): Observable<Geolocation> {
    return Observable.from(
      new Promise((success, failure) =>
        navigator.geolocation.getCurrentPosition(success, failure)
      )
    ).map((position: Position) => ({
      coords: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      timestamp: position.timestamp,
    }));
  }

}
