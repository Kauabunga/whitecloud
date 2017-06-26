import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as createActions from '../../services/create/create.actions';
import { State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { Event } from '../../services/events/events.model';

@Component({
  selector: 'create-details',
  styleUrls: ['./create-details.component.css'],
  templateUrl: './create-details.component.html',
})
export class CreateDetailsComponent implements OnInit {

  createGroup: FormGroup;

  onDestroy$: Subject<null> = new ReplaySubject();

  constructor(public formBuilder: FormBuilder,
              public store: Store<State>) {
  }

  public ngOnInit() {

    this.createGroup = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.createGroup.get('title')
      .valueChanges
      .takeUntil(this.onDestroy$)
      .subscribe((title) => this.store.dispatch(new createActions.UpdateAction({title} as Event)));

    this.createGroup.get('description')
      .valueChanges
      .takeUntil(this.onDestroy$)
      .subscribe((description) => this.store.dispatch(new createActions.UpdateAction({description} as Event)));

  }

  handleSubmit($event) {
    $event.preventDefault();
    if (this.createGroup.valid) {
      this.store.dispatch(new createActions.SaveAction());
    }
  }
}
