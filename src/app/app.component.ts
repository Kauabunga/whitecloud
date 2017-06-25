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
import {getCreateState, getEventsState, getMapState, getRouterState, State} from './app.reducers';
import {Store} from "@ngrx/store";
import {getAll} from './services/events/events.reducer';
import {Event} from './services/events/events.model';
import {Observable} from 'rxjs/Observable';
import * as eventActions from './services/events/events.actions';
import * as mapActions from './services/map/map.actions';
import * as mapReducer from './services/map/map.reducer';
import {go} from '@ngrx/router-store';
import {getCreateEvent} from './services/create/create.reducer';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {getMap} from './services/map/map.reducer';
import {Map} from './services/map/map.model';

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

  map$: Observable<Map>;
  events$: Observable<Event[]>;
  height: number = 0;

  title$: Observable<string>;

  opened: boolean = true;

  constructor(public store: Store<State>, public router: Router) {
  }

  public ngOnInit() {

    this.height = window.innerHeight;

    this.map$ = this.getMap();

    this.title$ = this.getTitle();

    this.events$ = this.getEvents();
  }

  getTitle() {
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

  getMap() {
    return this.store.select(getMapState)
      .map(getMap)
      .distinctUntilChanged();
  }

  getEvents() {
    return Observable.combineLatest(
      this.store.select(getRouterState),
      this.store.select(getCreateState)
        .map(getCreateEvent),
      this.store.select(getEventsState)
        .map(getAll),
      (path, createEvent, events) =>
        path.indexOf('/create') === 0
          ? [createEvent]
          : events.filter(event => !!event)
    )
      .debounceTime(0)
      .distinctUntilChanged();
  }

  public handleHome() {
    this.handleResetMap();
  }

  public handleMapClick({coords}) {
    this.store.dispatch(new mapActions.ClickAction(coords))
  }

  public handleBoundsChange(event) {
    // console.log(event);
  }

  public handleCenterChange(event) {
    // console.log(event);
  }

  public handleZoomChange(event) {
    // console.log(event);
  }

  public handleResetMap() {
    this.store.dispatch(new mapActions.SetCenterAction({
      coords: {
        lat: mapReducer.initialState.map.lat,
        lng: mapReducer.initialState.map.lng
      },
      bounds: mapReducer.initialState.map.bounds,
    }))
  }

  public handleMarker(event: Event) {
    this.store.dispatch(go(['detail', event.id]))
  }
}
