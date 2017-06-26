import { Component, OnInit, OnDestroy } from '@angular/core';
import { getEventsState, State } from '../app.reducers';
import { Store } from '@ngrx/store';
import { getNextId, getPreviousId, getSelected } from '../services/events/events.reducer';
import { Observable } from 'rxjs/Observable';
import { Event } from '../services/events/events.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as eventsActions from '../services/events/events.actions';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {

  event$: Observable<Event>;

  onDestroy$: ReplaySubject<null> = new ReplaySubject();

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {

    this.event$ = this.store.select(getEventsState)
      .map(getSelected)
      .distinctUntilChanged()
      .filter((event) => !!event);

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  handleNext(){
    return this.store.select(getEventsState)
      .map(getNextId)
      .first()
      .subscribe(id => this.store.dispatch(new eventsActions.SelectAction(id)))
  }

  handlePrevious(){
    return this.store.select(getEventsState)
      .map(getPreviousId)
      .first()
      .subscribe(id => this.store.dispatch(new eventsActions.SelectAction(id)))
  }

}
