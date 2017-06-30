import 'rxjs/add/operator/distinctUntilChanged';
import { Component, OnInit, HostListener, Input, EventEmitter, Output } from '@angular/core';
import { getEventsState, State, getCreateState, getRouterState, getMapState } from '../../app.reducers';
import { getAll } from '../../services/events/events.reducer';
import { Event } from '../../services/events/events.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { Map } from '../../services/map/map.model';
import { getCreateEvent } from '../../services/create/create.reducer';
import * as mapReducer from '../../services/map/map.reducer';
import { getMap } from '../../services/map/map.reducer';
import * as mapActions from '../../services/map/map.actions';
import * as geolocationActions from '../../services/geolocation/geolocation.actions';
import { go } from '@ngrx/router-store';

@Component({
  selector: 'map',
  styleUrls: ['map.component.css'],
  templateUrl: 'map.component.html',
  animations: [fadeInAnimation],
})
export class MapComponent implements OnInit {

  @Input()
  opened: boolean = true;

  events$: Observable<Event[]>;
  map$: Observable<Map>;

  height: number = 0;
  width: number = 0;

  // Google map instance
  mapInstance;

  @Output()
  googleMap: EventEmitter<any> = new EventEmitter();

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {
    this.onResize();
    this.map$ = this.getMap();
    this.events$ = this.getEvents();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.triggerMapsResize();
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

  public handleMyLocation() {
    this.store.dispatch(new geolocationActions.GetGeolocationAction());
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

  public handleMapInit(map) {
    this.mapInstance = map;
    this.googleMap.emit(map);
  }

  public handleMarker(event: Event) {
    this.store.dispatch(go(['detail', event.id]));
  }

  public handleResetMap() {
    this.store.dispatch(new mapActions.ResetAction());
  }


}
