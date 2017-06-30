import { Component, OnInit, OnDestroy } from '@angular/core';
import { getEventsState, State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { getNextId, getPreviousId, getSelected } from '../../services/events/events.reducer';
import { Observable } from 'rxjs/Observable';
import { Event } from '../../services/events/events.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'detail',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {

  event$: Observable<Event>;

  imageUrl: string;

  nextId$: Observable<string>;
  prevId$: Observable<string>;

  onDestroy$: ReplaySubject<null> = new ReplaySubject();

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {

    this.event$ = this.store.select(getEventsState)
      .map(getSelected)
      .distinctUntilChanged()
      .filter((event) => !!event);

    this.event$
      .map((event) => event.imageUrl)
      .distinctUntilChanged()
      .do(console.log)
      .mergeMap((url) =>
        Observable.of(url).delay(50).startWith(null),
      )
      .takeUntil(this.onDestroy$)
      .subscribe((imageUrl) => this.imageUrl = imageUrl);

    this.nextId$ = this.store.select(getEventsState)
      .map(getNextId)
      .distinctUntilChanged();

    this.prevId$ = this.store.select(getEventsState)
      .map(getPreviousId)
      .distinctUntilChanged();

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

}
