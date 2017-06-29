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
import * as firebaseService from '../firebase/firebase.service';
import * as appVersionActions from './app-version.actions';
import { AppVersion } from './app-version.model';
import { getMetadata } from '../../environment';
import { MdSnackBar } from '@angular/material';
import { getVersionState, State } from '../../app.reducers';

@Injectable()
export class AppVersionEffects {

  @Effect()
  listenForVersionChange$: Observable<Action> = this.actions$
    .ofType(null)
    .startWith(null)
    .mergeMap(() =>
      firebaseService.get<AppVersion>('version')
        .map((version) => version && version.version)
        .combineLatest(
          this.store.select(getVersionState)
            .map((version) => version.version)
            .first(),
          (serverVersion, clientVersion) => {
            this.updateToast(serverVersion, clientVersion);
            return serverVersion;
          }
        )
        .map((version) =>
          new appVersionActions.UpdateAction(version)
        )
    )
    .filter((action) => !!action);

  constructor(private actions$: Actions,
              private store: Store<State>,
              private snackBar: MdSnackBar) {
  }

  public updateToast(serverVersion: string, clientVersion: string) {
    if (serverVersion !== clientVersion &&
      serverVersion !== getMetadata().buildVersion) {

      this.snackBar.open('New update available', 'Update', {duration: 10000})
        .onAction().subscribe(() =>
        window.location.reload(true)
      );
    }
  }
}
