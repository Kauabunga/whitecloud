import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { getCreateState, getMapState, State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import * as createActions from '../../services/create/create.actions';
import * as mapActions from '../../services/map/map.actions';
import { EventLocation } from '../../services/events/events.model';
import { getMapId, getPlaces, getSearches } from '../../services/map/map.reducer';
import { getCreateEvent, getSearchCoords } from '../../services/create/create.reducer';
import { go } from '@ngrx/router-store';

@Component({
  selector: 'create-location',
  styleUrls: ['./create-location.component.css'],
  templateUrl: './create-location.component.html',
})
export class CreateLocationComponent implements OnInit, OnDestroy {

  placeSuggestions$: Observable<any>;

  results$: Observable<any>;

  createGroup: FormGroup;

  onDestroy$: Subject<null> = new ReplaySubject();

  auto: ElementRef;

  constructor(public formBuilder: FormBuilder,
              public store: Store<State>) {
  }

  public ngOnInit() {

    this.store.dispatch(new createActions.SelectingLocationAction(true));

    this.createGroup = this.formBuilder.group({
      location: ['', Validators.required],
    });

    this.getSearchCoords()
      .takeUntil(this.onDestroy$)
      .filter((coords) => coords && coords.lat && !!coords.lng)
      .subscribe((coords) => {
        this.store.dispatch(new mapActions.SearchAction({
          lat: coords.lat,
          lng: coords.lng
        }));
      });

    this.placeSuggestions$ = this.getEventCoords()
      .combineLatest(
        this.store.select(getMapState).map(getSearches),
        (coords, searches) => searches[getMapId(coords)]
      )
      .filter((places) => !!places)
      .distinctUntilChanged()
      .do((places) => this.createGroup.patchValue({
        location: places[0],
      }))
      .startWith([] as any);

    this.getLocationValue()
      .distinctUntilChanged()
      .takeUntil(this.onDestroy$)
      .subscribe((location) =>
        location.place_id
          ? this.store.dispatch(new mapActions.LookupAction(location.place_id))
          : this.store.dispatch(new mapActions.SearchAction(location))
      );

    this.getPlace()
      .takeUntil(this.onDestroy$)
      .subscribe(this.handleNewPlace.bind(this));

    this.results$ = this.getResults();

  }

  public ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  getSearchCoords() {
    return this.store.select(getCreateState)
      .map(getSearchCoords)
      .filter((coords) => !!coords)
      .distinctUntilChanged((a, b) => a.lat === b.lat && a.lng === b.lng);
  }

  getEventCoords() {
    return this.store.select(getCreateState)
      .map(getCreateEvent)
      .filter((createEvent) => createEvent && createEvent.location && !!createEvent.location.coords)
      .map((createEvent) => createEvent.location.coords)
      .distinctUntilChanged((a, b) => a.lat === b.lat && a.lng === b.lng);
  }

  handleNewPlace(place) {
    let bounds = place.geometry.viewport;
    let location = place.geometry.location;

    this.store.dispatch(new createActions.UpdateLocationAction({
      coords: location.toJSON(),
      bounds: bounds.toJSON(),
      place_id: place.place_id,
      description: place.description || place.formatted_address || null
    } as EventLocation));

    this.store.dispatch(new mapActions.SetCenterAction({
      coords: location.toJSON(),
      bounds: bounds.toJSON()
    }));

  }

  getPlace() {
    return this.getLocationValue()
      .takeUntil(this.onDestroy$)
      .distinctUntilChanged()
      .combineLatest(
        this.store.select(getMapState)
          .map(getPlaces),
        (location, places) => places[location.place_id]
      )
      .filter((location) => !!location)
      .distinctUntilChanged();
  }

  getResults() {
    return this.getLocationValue()
      .combineLatest(
        this.store.select(getMapState)
          .map(getSearches),
        (location, searches) => searches[this.displayLocation(location).trim()]
      )
      .filter((results) => !!results);
  }

  getLocationValue() {
    return this.createGroup.get('location')
      .valueChanges
      .filter((location) => !!location);
  }

  displayLocation(result) {
    return result && result.description ||
      result && result.formatted_address ||
      result;
  }

  handleSubmit($event) {
    $event.preventDefault();
    if (this.createGroup.valid) {
      this.store.dispatch(go(['create', 'details']));
    }
  }

}
