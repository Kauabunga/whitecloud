import { Component, OnInit } from '@angular/core';
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
export class CreateDetailsComponent implements OnInit {

  createGroup: FormGroup;

  event$: Observable<Event>;

  onDestroy$: Subject<null> = new ReplaySubject();

  isDev: boolean = __DEV__;

  submitted: boolean = false;
  dragging: boolean = false;

  imagePreview;

  constructor(public formBuilder: FormBuilder,
              public store: Store<State>) {
  }

  public ngOnInit() {

    this.store.dispatch(new createActions.SelectingLocationAction(false));

    this.event$ = this.store.select(getCreateState)
      .map(getCreateEvent)
      .distinctUntilChanged();

    this.createGroup = this.formBuilder.group({
      pest: ['', Validators.required],
      owner: [''],
      description: [''],
      imageId: [''],
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
    console.log('handleImageChange', $event);
    console.log('handleImageChange', $event.srcElement.files[0]);
    const file: File = $event.srcElement.files[0];
    const id = uuidv1();

    // Load preview image
    let reader = new FileReader();
    reader.onload = (readerEvent) => this.imagePreview = (readerEvent.target as any).result;
    reader.readAsDataURL(file);

    let imageId = `catch_${id}_${file.name}`;
    // Upload to firebase
    imagesRef.child(imageId)
      .put(file).then((snapshot) => {
      console.log('Uploaded a blob or file!', imageId);
      this.createGroup.patchValue({ imageId });
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
