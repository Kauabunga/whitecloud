import {
  Component, OnDestroy,
  OnInit,
} from '@angular/core';
import {getCreateState, State} from '../app.reducers';
import {Store} from '@ngrx/store';
import {getCreateEvent} from '../services/create/create.reducer';
import {Event} from '../services/events/events.model';
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import * as createActions from '../services/create/create.actions';


/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
@Component({
  selector: 'create',
  styleUrls: ['./create.component.css'],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit, OnDestroy {

  createEvent: Event;

  onDestroy$: Subject<null> = new ReplaySubject();

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {

    this.store.dispatch(new createActions.ResetAction());

    this.store.select(getCreateState)
      .map(getCreateEvent)
      .takeUntil(this.onDestroy$)
      .subscribe(createEvent => this.createEvent = createEvent);

  }

  public ngOnDestroy(){
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  handleSubmit(){
    this.store.dispatch(new createActions.SaveAction());
  }

}
