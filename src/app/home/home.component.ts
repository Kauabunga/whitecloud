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
import {google} from '@agm/core/services/google-maps-types';

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
      .filter(events => events.length !== 0);
  }

}
