import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/observable/from';
import {Injectable, NgZone} from '@angular/core';
import {Effect, Actions, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';
import {empty} from 'rxjs/observable/empty';
import {of} from 'rxjs/observable/of';
import * as firebase from 'firebase';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import * as createActions from './create.actions';
import {getCreateState, State} from '../../app.reducers';
import {getCreateEvent} from './create.reducer';
import {go} from '@ngrx/router-store';
import {MdSnackBar} from "@angular/material";


const database = firebase.database();

const eventsRef = database.ref('events');


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
export class CreateEffects {

  @Effect()
  save$: Observable<Action> = this.actions$
    .ofType(createActions.SAVE)
    .map(toPayload)
    .switchMap(() =>
      this.store.select(getCreateState)
        .map(getCreateEvent)
        .first()
    )
    .switchMap((createEvent) =>
      Observable.from(eventsRef.push(createEvent))
        .mapTo(new createActions.SaveSuccessAction())
    );


  @Effect()
  saveSuccess$: Observable<Action> = this.actions$
    .ofType(createActions.SAVE_SUCCESS)
    .map(toPayload)
    .do(() => this.snackBar.open('Created new event', 'Undo', {duration: 2000}))
    .mapTo(go(['']));


  constructor(private actions$: Actions,
              private store: Store<State>,
              public snackBar: MdSnackBar,
              private zone: NgZone) {
  }
}
