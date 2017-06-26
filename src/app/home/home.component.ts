import 'rxjs/add/operator/distinctUntilChanged';
import { Component, OnInit } from '@angular/core';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { getEventsState, State } from '../app.reducers';
import { getAll } from '../services/events/events.reducer';
import { Event } from '../services/events/events.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'home',
  providers: [Title],
  styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  events$: Observable<Event[]>;

  constructor(public title: Title,
              public store: Store<State>) {
  }

  public ngOnInit() {

    this.events$ = this.store.select(getEventsState)
      .map(getAll)
      .distinctUntilChanged()
      .debounceTime(0)
      .filter((events) => events.length !== 0);
  }

}
