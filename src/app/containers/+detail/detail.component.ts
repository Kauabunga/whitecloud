import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { getEventsState, getImagesState, State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { getNextId, getPreviousId, getSelected } from '../../services/events/events.reducer';
import { Observable } from 'rxjs/Observable';
import { Event } from '../../services/events/events.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { Image } from '../../services/images/images.model';
import { getImages } from '../../services/images/images.reducer';

@Component({
  selector: 'detail',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.css'],
  animations: [fadeInAnimation],
})
export class DetailComponent implements OnInit, OnDestroy {

  currentEvent$: Observable<Event>;
  currentImage$: Observable<Image>;

  paths: string[] = [];
  base64: string;
  padding: number = 0;
  height: number = 0;
  width: number = 0;

  nextId$: Observable<string>;
  prevId$: Observable<string>;

  isDev: boolean = __DEV__;

  onDestroy$: ReplaySubject<null> = new ReplaySubject();

  @HostBinding('@fadeInAnimation') animation;

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {

    this.currentEvent$ = this.getCurrentEvent()
      .filter((event) => !!event);

    this.currentImage$ = this.currentEvent$
      .map((event) => event.imageId)
      .mergeMap((imageId: string) =>
        this.store.select(getImagesState)
          .map(getImages)
          .map((images) => images[imageId])
      );

    this.currentImage$
      .takeUntil(this.onDestroy$)
      .subscribe((image: Image) => {
        this.base64 = image && image.base64;
        this.height = image && image.height;
        this.width = image && image.width;
        this.padding = this.width > 0
        ? this.height / this.width * 360
          : 0;
      });

    this.currentImage$
      .mergeMap((image: Image) =>
        Observable.of(image).delay(50).startWith(null),
      )
      .takeUntil(this.onDestroy$)
      .subscribe((image: Image) => {
        this.paths = image && [image.thumbnail] || [];
      });

    this.nextId$ = this.store.select(getEventsState)
      .map(getNextId)
      .distinctUntilChanged();

    this.prevId$ = this.store.select(getEventsState)
      .map(getPreviousId)
      .distinctUntilChanged();

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  getCurrentEvent() {
    return this.store.select(getEventsState)
      .map(getSelected)
      .distinctUntilChanged();
  }

  trackPaths(index, item) {
    return item;
  }

}
