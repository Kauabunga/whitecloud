import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/combineLatest';
import { Component, OnInit, ViewEncapsulation, OnDestroy, HostListener } from '@angular/core';
import { getCreateState, getEventsState, getMapState, getRouterState, State } from './app.reducers';
import { Store } from '@ngrx/store';
import { getAll, getIds } from './services/events/events.reducer';
import { Event } from './services/events/events.model';
import { Observable } from 'rxjs/Observable';
import * as mapActions from './services/map/map.actions';
import * as mapReducer from './services/map/map.reducer';
import { getMap } from './services/map/map.reducer';
import { go } from '@ngrx/router-store';
import { getCreateEvent } from './services/create/create.reducer';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Map } from './services/map/map.model';
import { ReplaySubject } from 'rxjs';

/**
 * App Component
 * Top Level Component
 */
@Component({
  moduleId: 'app',
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  map$: Observable<Map>;
  events$: Observable<Event[]>;
  height: number = 0;
  width: number = 0;

  menuState: 'over' | 'side' = 'side';

  title$: Observable<string>;

  // Google map instance
  mapInstance;

  opened: boolean = true;

  onDestroy: ReplaySubject<null> = new ReplaySubject();

  constructor(public store: Store<State>, public router: Router) {
  }

  public ngOnInit() {
    this.onResize();
    this.map$ = this.getMap();
    this.title$ = this.getTitle();
    this.events$ = this.getEvents();
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
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
    return title;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.menuState = this.getMenuState();
    this.triggerMapsResize();
  }

  getMenuState(): 'side' | 'over' {
    return this.width > 768
      ? 'side'
      : 'over';
  }

  triggerMapsResize() {
    if (this.mapInstance) {
      (window as any).google.maps.event.trigger(this.mapInstance, 'resize');
    }
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
          : events.filter((event) => !!event)
    )
      .debounceTime(0)
      .distinctUntilChanged();
  }

  public handleHome(event) {
    this.handleResetMap();
  }

  public handleMapClick({coords}) {
    this.store.dispatch(new mapActions.ClickAction(coords));
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

  public handleSidenavClose() {
    this.triggerMapsResize();
    this.opened = false;
  }

  public handleSidenavOpen() {
    this.triggerMapsResize();
    this.opened = true;
  }

  public handleMenu() {
    this.opened = !this.opened;
  }

  public handleMapInit(map) {
    this.mapInstance = map;
  }

  public handleResetMap() {
    this.store.dispatch(new mapActions.SetCenterAction({
      coords: {
        lat: mapReducer.initialState.map.lat,
        lng: mapReducer.initialState.map.lng
      },
      bounds: mapReducer.initialState.map.bounds,
    }));
  }

  public handleMarker(event: Event) {
    this.store.dispatch(go(['detail', event.id]));
  }
}
