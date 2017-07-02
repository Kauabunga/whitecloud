import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { getEventsState, State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { getNextId, getPreviousId, getSelected } from '../../services/events/events.reducer';
import { Observable } from 'rxjs/Observable';
import { Event } from '../../services/events/events.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { fadeInAnimation } from '../../animations/fade-in.animation';

@Component({
  selector: 'detail',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.css'],
  animations: [fadeInAnimation],
})
export class DetailComponent implements OnInit, OnDestroy {

  currentEvent$: Observable<Event>;

  imageUrl: string;

  nextId$: Observable<string>;
  prevId$: Observable<string>;

  isDev: boolean = __DEV__;

  onDestroy$: ReplaySubject<null> = new ReplaySubject();

  @HostBinding('@fadeInAnimation') animation;

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {

    this.currentEvent$ = this.store.select(getEventsState)
      .map(getSelected)
      .distinctUntilChanged()
      .filter((event) => !!event);

    // Ensure we hide the previous image so it does not hand around
    this.currentEvent$
      .map((event) => event.imageUrl)
      .distinctUntilChanged()
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
