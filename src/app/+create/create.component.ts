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
import {getPlaces} from '../services/map/map.reducer';


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

    this.createGroup.get('location')
      .valueChanges
      .filter(location => !!location)
      .takeUntil(this.onDestroy$)
      .subscribe(location => this.store.dispatch(new mapActions.SearchAction(location)))


    this.results$ = this.createGroup.get('location')
      .valueChanges
      .filter(location => !!location)
      .combineLatest(
        this.store.select(getMapState)
          .map(getPlaces),
        (location, places) => places[location.trim()]
      )
      .do(console.warn)
      .filter(results => !!results)
      .map((results)=> (results as any).map(result => result.description))

  }

  public ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  handleSubmit() {
    if(this.createGroup.valid){
      this.store.dispatch(new createActions.SaveAction());
    }
  }

}
