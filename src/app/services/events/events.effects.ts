import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import {Injectable, NgZone} from '@angular/core';
import {Effect, Actions, toPayload} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';
import {empty} from 'rxjs/observable/empty';
import {of} from 'rxjs/observable/of';
import * as firebase from 'firebase';
import * as eventActions from './events.actions';
import {Event} from './events.model';
import {ReplaySubject} from 'rxjs/ReplaySubject';


const database = firebase.database();

const eventsRef = database.ref('events');


var randomCat = require('random-cat');
var imageUrl = randomCat.get({
  width: 24,
  height: 24,
  category: 'animals'
});


var newEventKey = eventsRef.push().key;
var updates = {};
updates['/events/' + newEventKey] = {
  lat: getRandom(-36, -44),
  lng: getRandom(170, 182),
};

firebase.database().ref().update(updates);


function getRandom(min, max) {
  return Math.random() * (max - min) + min;
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
  load$: Observable<Action> = this.actions$
    .ofType(eventActions.INIT)
    .map(toPayload)
    .startWith(null)
    .first()
    .switchMap(() => {
      let replay = new ReplaySubject();

      eventsRef.on('value', snapshot => {
        const val = snapshot.val() || {};
        const events = Object.keys(val)
          .map(key => Object.assign(val[key], {id: key}));
        this.zone.run(() => replay.next(events as Event[]));
      });

      return replay;
    })
    .mergeMap((events: Event[]) => from(events))
    .map((event: Event) => new eventActions.LoadAction(event));

  constructor(private actions$: Actions, private zone: NgZone) {
  }
}
