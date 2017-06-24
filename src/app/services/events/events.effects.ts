import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import * as firebase from 'firebase';
import * as eventActions from './events.actions';
import {Event} from './events.model';
import {ReplaySubject} from 'rxjs/ReplaySubject';


const database = firebase.database();

const eventsRef = database.ref('events');


var newEventKey = eventsRef.push().key;
var updates = {};
updates['/events/' + newEventKey] = {
  lng: 40,
  lat: 180
};

firebase.database().ref().update(updates);


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
  load$: Observable<Action> = this.actions$
    .ofType(eventActions.INIT)
    .debounceTime(300)
    .map(toPayload)
    .switchMap(query => {


      let replay = new ReplaySubject();

      eventsRef.on('value', function(snapshot) {
        replay.next(snapshot.val() as Event);
        console.log(snapshot.val(), 'penis')
      });

      return replay;
    })
    .map((event: Event) => new eventActions.LoadAction(event));

  constructor(private actions$: Actions) { }
}
