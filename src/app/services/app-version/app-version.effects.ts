import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as firebaseService from '../firebase/firebase.service';
import * as appVersionActions from './app-version.actions';
import { AppVersion } from './app-version.model';
import { getMetadata } from '../../environment';

@Injectable()
export class AppVersionEffects {

  @Effect()
  listenForVersionChange$: Observable<Action> = this.actions$
    .ofType(null)
    .startWith(null)
    .mergeMap(() =>
      firebaseService.get<AppVersion>('version')
        .map(version => version && version.version)
        .do(version => {
          if (version !== getMetadata().buildVersion) {
            alert(`New version: ${version}`);
          }
        })
        .map((version) =>
          new appVersionActions.UpdateAction(version)
        )
    )
    .filter((action) => !!action);

  constructor(private actions$: Actions) {
  }

}
