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
import {ReplaySubject} from 'rxjs/ReplaySubject';
import * as mapActions from './map.actions';
import {SearchSuccessAction} from './map.actions';


let autocompleteService;

const nzBounds = {
  south: -47.31964113109319,
  west: 164.210693359375,
  north: -34.01099680852081,
  east: -179.287841796875
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
export class MapEffects {


  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(mapActions.SEARCH)
    .map(toPayload)
    .debounceTime(200)
    .switchMap(query =>
      this.searchString(query)
        .map((results: any) => new SearchSuccessAction({query, results}))
    );

  searchString(query: string) {
    return Observable.from(new Promise((resolve, reject) =>
      this.getPlacesService().getQueryPredictions(
        {
          input: query,
          bounds: nzBounds
        },
        (results) => resolve(results)
      )
    ))
  }

  getPlacesService() {
    return autocompleteService =
      autocompleteService || new (window as any).google.maps.places.AutocompleteService();
  }

  constructor(private actions$: Actions, private zone: NgZone) {
  }
}
