/**
 * Angular 2 decorators and services
 */
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/combineLatest';
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {AppState} from './app.service';
import {getCreateState, getEventsState, getRouterState, State} from './app.reducers';
import {Store} from "@ngrx/store";
import {getAll} from './services/events/events.reducer';
import {Event} from './services/events/events.model';
import {Observable} from 'rxjs/Observable';
import * as eventActions from './services/events/events.actions';
import * as mapActions from './services/map/map.actions';
import {go} from '@ngrx/router-store';
import {getCreateEvent} from './services/create/create.reducer';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  events$: Observable<Event[]>;
  height: number = 0;

  title$: Observable<string>;

  latitude: number = -41;
  longitude: number = 172;

  constructor(public store: Store<State>, public router: Router) {
  }

  public ngOnInit() {

    this.height = window.innerHeight;

    this.title$ = this.getTitle();

    this.events$ = this.getEvents();
  }

  getTitle(){
    return this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.getDeepestTitle(this.router.routerState.snapshot.root));
  }

  getDeepestTitle(routeSnapshot: ActivatedRouteSnapshot) {
    let title = routeSnapshot.data ? routeSnapshot.data['title'] : '';
    if (routeSnapshot.firstChild) {
      title = this.getDeepestTitle(routeSnapshot.firstChild) || title;
    }
    return title || 'Title';
  }

  getEvents(){
    return Observable.combineLatest(
      this.store.select(getRouterState),
      this.store.select(getCreateState)
        .map(getCreateEvent),
      this.store.select(getEventsState)
        .map(getAll),
      (path, createEvent, events) =>
        path === '/create'
          ? [createEvent]
          : events
    )
      .debounceTime(0)
      .distinctUntilChanged();
  }

  public handleMapClick({coords}) {
    this.store.dispatch(new mapActions.ClickAction(coords))
  }

  public handleBoundsChange(event) {
    console.log(event);
  }

  public handleCenterChange(event) {
    console.log(event);
  }

  public handleZoomChange(event) {
    console.log(event);
  }

  public handleMarker(event: Event) {
    this.store.dispatch(go(['detail', event.id]))
  }
}
