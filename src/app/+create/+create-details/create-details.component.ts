import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as createActions from '../../services/create/create.actions';
import { State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { Event } from '../../services/events/events.model';
import { Observable } from 'rxjs/Observable';
import { fadeInAnimation } from '../../animations/fade-in.animation';

@Component({
  selector: 'create-details',
  styleUrls: ['./create-details.component.css'],
  templateUrl: './create-details.component.html',
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' },
})
export class CreateDetailsComponent implements OnInit {

  createGroup: FormGroup;

  onDestroy$: Subject<null> = new ReplaySubject();

  constructor(public formBuilder: FormBuilder,
              public store: Store<State>) {
  }

  public ngOnInit() {

    this.store.dispatch(new createActions.SelectingLocationAction(false));

    this.createGroup = this.formBuilder.group({
      pest: ['', Validators.required],
      owner: [''],
      description: [''],
    });

    Observable.combineLatest(
      this.createGroup.get('pest').valueChanges,
      this.createGroup.get('owner').valueChanges,
      this.createGroup.get('description').valueChanges,
      () => null
    ).takeUntil(this.onDestroy$)
      .subscribe(() =>
        this.store.dispatch(new createActions.UpdateAction(this.createGroup.value as Event))
      );

  }

  handleSubmit($event) {
    $event.preventDefault();
    if (this.createGroup.valid) {
      this.store.dispatch(new createActions.SaveAction());
    }
  }
}
