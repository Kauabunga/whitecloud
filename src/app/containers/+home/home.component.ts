import 'rxjs/add/operator/distinctUntilChanged';
import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { getEventsState, getStatsState, State } from '../../app.reducers';
import { getAll, getIds } from '../../services/events/events.reducer';
import { Event } from '../../services/events/events.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { getStats } from '../../services/stats/stats.reducer';

@Component({
  selector: 'home',
  styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html',
  animations: [fadeInAnimation],
})
export class HomeComponent implements OnInit {

  events$: Observable<Event[]>;
  total$: Observable<number>;

  @HostBinding('@fadeInAnimation') animation;

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {
    this.events$ = this.store.select(getEventsState)
      .map(getAll)
      .filter((events) => events.length !== 0)
      .distinctUntilChanged()
      .debounceTime(0);

    this.total$ = this.store.select(getStatsState)
      .map(getStats)
      .map((stats) => stats.total)
      .filter((total) => total !== 0);
  }

  public eventIdentity(event: Event) {
    return event.id;
  }
}
