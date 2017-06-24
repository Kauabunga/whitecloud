import 'rxjs/add/operator/distinctUntilChanged';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {AppState} from '../app.service';
import {Title} from './title';
import {XLargeDirective} from './x-large';
import {getEventsState, State} from '../app.reducers';
import {getAll} from '../services/events/events.reducer';
import {Event} from '../services/events/events.model';
import {Store} from "@ngrx/store";
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import * as eventActions from '../services/events/events.actions';

@Component({
  selector: 'home',
  providers: [Title],
  styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  onDestroy: ReplaySubject<null> = new ReplaySubject();

  events: Event[];

  height: number = 0;

  constructor(public title: Title,
              public store: Store<State>) {
  }

  public ngOnInit() {
    this.height = window.innerHeight;

    this.store.select(getEventsState)
      .takeUntil(this.onDestroy)
      .map(getAll)
      .distinctUntilChanged()
      .debounceTime(0)
      .filter(events => events.length !== 0)
      .do(console.log.bind(console, 'asdf'))
      .subscribe(events => this.events = events);
  }

  public ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  public markerClick(event: Event){
    this.store.dispatch(new eventActions.SelectAction(event.id))
  }

}
