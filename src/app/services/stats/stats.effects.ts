import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as statsActions from './stats.actions';
import * as firebaseService from '../firebase/firebase.service';
import { Stats } from './stats.model';

@Injectable()
export class StatsEffects {

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(statsActions.LOAD)
    .startWith(new statsActions.LoadAction())
    .map(toPayload)
    .do(console.log.bind(console, 'load stats'))
    .mergeMap((id: string) =>
      firebaseService.get(`stats`)
        .map((stats: Stats) => new statsActions.LoadSuccessAction(stats))
    )
    .filter((action) => !!action);

  constructor(private actions$: Actions) {
  }

}
