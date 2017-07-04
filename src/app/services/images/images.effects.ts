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
import * as firebaseService from '../firebase/firebase.service';
import { Image } from './images.model';

@Injectable()
export class ImagesEffects {

  @Effect()
  upload$: Observable<Action> = this.actions$
    .ofType(imagesActions.UPLOAD)
    .map(toPayload)
    .mapTo(null)
    .filter((action) => !!action);

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(imagesActions.LOAD)
    .map(toPayload)
    .do(console.log.bind(console, 'load image'))
    .mergeMap((id: string) =>
      firebaseService.get(`images/${id}`)
        .map((image: Image) => new imagesActions.LoadSuccessAction({id, image}))
    )
    .catch((err, errStream) => Observable.of(new imagesActions.LoadFailureAction(err)))
    .filter((action) => !!action);

  constructor(private actions$: Actions) {
  }

}
