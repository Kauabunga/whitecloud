import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as imagesActions from './images.actions';
import * as firebaseService from '../firebase/firebase.service';
import * as firebase from 'firebase';
import { Image } from './images.model';
import { ReplaySubject } from 'rxjs';
import { from } from 'rxjs/observable/from';

const database = firebase.database();
const imagesRef = database.ref('images');

@Injectable()
export class ImagesEffects {

  // TODO abstract firebase interaction to service
  @Effect()
  init$: Observable<Action> = this.actions$
    .ofType(imagesActions.INIT)
    .startWith(null)
    .first()
    .switchMap(() => {
      const replay: ReplaySubject<Action[]> = new ReplaySubject();
      imagesRef.on(
        'child_added',
        (snapshot) => this.handleAdded(snapshot, replay),
        (err) => replay.error(err));
      return replay;
    })
    .mergeMap((actions: Action[]) => from(actions))
    .do(console.log.bind(console, 'LOAD Image'));

  // TODO upload via action
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

  constructor(private actions$: Actions,
              public zone: NgZone) {
  }

  public handleAdded(snapshot, replay) {
    const val = snapshot.val();
    this.zone.run(() =>
      replay.next([new imagesActions.LoadSuccessAction({id: snapshot.key, image: val})])
    );
  }

}
