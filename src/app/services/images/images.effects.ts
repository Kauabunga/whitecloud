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
import * as imagesActions from './images.actions';

@Injectable()
export class ImagesEffects {

  @Effect()
  upload$: Observable<Action> = this.actions$
    .ofType(imagesActions.UPLOAD)
    .map(toPayload)
    .mapTo(null);

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(imagesActions.LOAD)
    .map(toPayload)
    .mapTo(null);

  constructor(private actions$: Actions) {
  }

}
