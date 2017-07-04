import { Component, HostBinding, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as createActions from '../../../services/create/create.actions';
import { getCreateState, State } from '../../../app.reducers';
import { Store } from '@ngrx/store';
import { Event } from '../../../services/events/events.model';
import { Observable } from 'rxjs/Observable';
import { getCreateEvent } from '../../../services/create/create.reducer';
import { fadeInAnimation } from '../../../animations/fade-in.animation';
import * as firebase from 'firebase';
import * as uuidv1 from 'uuid/v1';

const imagesRef = firebase.storage()
  .ref().child('images');

@Component({
  selector: 'create-details',
  styleUrls: ['create-details.component.css'],
  templateUrl: 'create-details.component.html',
  animations: [fadeInAnimation],
})
export class CreateDetailsComponent implements OnInit, OnDestroy {

  createGroup: FormGroup;

  event$: Observable<Event>;

  onDestroy$: Subject<null> = new ReplaySubject();

  isDev: boolean = __DEV__;

  submitted: boolean = false;
  dragging: boolean = false;

  imagePreview;

  @HostBinding('@fadeInAnimation') animation;

  constructor(public formBuilder: FormBuilder,
              public zone: NgZone,
              public store: Store<State>) {
  }

  public ngOnInit() {

    this.store.dispatch(new createActions.SelectingLocationAction(false));

    this.createGroup = this.formBuilder.group({
      pest: [null, Validators.required],
      owner: [null],
      description: [null],
      imageId: [null],
    });

    this.event$ = this.store.select(getCreateState)
      .map(getCreateEvent)
      .distinctUntilChanged();

    this.store.select(getCreateState)
      .map(getCreateEvent)
      .take(1)
      .filter((event) => !!event)
      .subscribe((event) => this.createGroup.patchValue(event));

    Observable.combineLatest(
      this.createGroup.get('pest').valueChanges.startWith(null),
      this.createGroup.get('owner').valueChanges.startWith(null),
      this.createGroup.get('description').valueChanges.startWith(null),
      this.createGroup.get('imageId').valueChanges.startWith(null),
      (pest, owner, description, imageId) => ({
        pest, owner, description, imageId
      })
    ).skip(1) // Skip first with all nulls
      .takeUntil(this.onDestroy$)
      .do(console.log.bind(console, 'CHANGE create details'))
      .subscribe((value) =>
        this.store.dispatch(new createActions.UpdateAction(value as Event))
      );

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = true;
  }

  handleDrop($event) {
    $event.preventDefault();
    console.log('handleDrop', $event);
  }

  handleImageChange($event) {
    console.log('handleImageChange', $event.srcElement.files[0]);
    const file: File = $event.srcElement.files[0];
    const name = file.name
      // Strip file type
      .substr(0, file.name.lastIndexOf('.'))
      // Replace illegal key characters
      .replace(/\.|#|\$|\[|]/gi, '-');
    const imageId = `catch_${uuidv1()}_${name}`;

    // Path form
    this.createGroup.get('imageId').setValue(imageId);
    this.createGroup.get('imageId').updateValueAndValidity();

    // Load preview image
    const reader = new FileReader();
    reader.onload = (readerEvent) => this.imagePreview = (readerEvent.target as any).result;
    reader.readAsDataURL(file);

    // Upload to firebase
    imagesRef.child(imageId).put(file).then((snapshot) => {
      console.log('Uploaded a blob or file!', imageId);
    });

  }

  handleSubmit($event) {
    if (this.createGroup.valid) {
      this.store.dispatch(new createActions.SaveAction());
    }
    else {
      this.submitted = true;
    }
  }
}
