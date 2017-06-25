import 'rxjs/add/operator/combineLatest';
import {
  Component, OnDestroy,
  OnInit,
} from '@angular/core';
import {getCreateState, getMapState, State} from '../app.reducers';
import {Store} from '@ngrx/store';
import {getCreateEvent} from '../services/create/create.reducer';
import {Event} from '../services/events/events.model';
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import * as createActions from '../services/create/create.actions';
import * as mapActions from '../services/map/map.actions';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {google} from '@agm/core/services/google-maps-types';
import {getPlaces, getSearches} from '../services/map/map.reducer';


/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
@Component({
  selector: 'create',
  styleUrls: ['./create.component.css'],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit, OnDestroy {

  results$: Observable<any>

  createEvent: Event;

  createGroup: FormGroup;

  onDestroy$: Subject<null> = new ReplaySubject();

  constructor(public formBuilder: FormBuilder,
              public store: Store<State>) {
  }

  public ngOnInit() {

    this.createGroup = this.formBuilder.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: ['']
    });

    this.store.dispatch(new createActions.ResetAction());

    this.store.select(getCreateState)
      .map(getCreateEvent)
      .takeUntil(this.onDestroy$)
      .subscribe(createEvent => this.createEvent = createEvent);

    this.getLocationValue()
      .distinctUntilChanged()
      .subscribe(location => {
        if (location.place_id) {
          this.store.dispatch(new mapActions.LookupAction(location.place_id))
        }
        else {
          this.store.dispatch(new mapActions.SearchAction(location))
        }
      });

    this.getLocationValue()
      .takeUntil(this.onDestroy$)
      .distinctUntilChanged()
      .combineLatest(
        this.store.select(getMapState)
          .map(getPlaces)
          .do(console.error),
        (location, places) => places[location.place_id]
      )
      .do(console.warn)
      .filter(location => !!location)
      .distinctUntilChanged()
      .subscribe((place) => {

        let bounds = place.geometry.viewport;
        let location = place.geometry.location;

        this.store.dispatch(new createActions.UpdateAction({
          lat: location.lat(),
          lng: location.lng(),
        } as Event))
        this.store.dispatch(new mapActions.SetCenterAction({
          coords: location.toJSON(),
          bounds: bounds.toJSON()
        }));
      });

    this.results$ = this.getResults();

  }

  getResults() {
    return this.getLocationValue()
      .combineLatest(
        this.store.select(getMapState)
          .map(getSearches),
        (location, searches) => searches[this.displayLocation(location).trim()]
      )
      .filter(results => !!results)
  }

  getLocationValue() {
    return this.createGroup.get('location')
      .valueChanges
      .filter(location => !!location)
  }

  public ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  displayLocation(result) {
    return result && result.description || result.toString();
  }

  handleSubmit() {
    if (this.createGroup.valid) {
      this.store.dispatch(new createActions.SaveAction());
    }
  }

}
