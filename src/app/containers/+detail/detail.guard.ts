import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as eventActions from '../../services/events/events.actions';
import * as imageActions from '../../services/images/images.actions';
import { getEventsState, State } from '../../app.reducers';
import { getEntities, getEventsLoaded } from '../../services/events/events.reducer';
import { EventsService } from '../../services/events/events.service';
import { go } from '@ngrx/router-store';
import { Event } from '../../services/events/events.model';

@Injectable()
export class DetailGuard implements CanActivate, CanDeactivate<any> {

  constructor(private store: Store<State>,
              private eventsService: EventsService) {
  }

  waitForCollectionToLoad(): Observable<boolean> {
    return this.store.select(getEventsState)
      .map(getEventsLoaded)
      .filter((loaded) => loaded)
      .take(1);
  }

  hasEvent(id: string): Observable<boolean> {
    return this.hasEventInStore(id)
      .switchMap((inStore) => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasEventInApi(id);
      });
  }

  hasEventInStore(id: string): Observable<boolean> {
    return this.store.select(getEventsState)
      .map(getEntities)
      .map((entities) => entities[id])
      // Load the events image
      .do((event) => this.store.dispatch(new imageActions.LoadAction(event && event.imageId)))
      .map((event) => !!event)
      .take(1);
  }

  hasEventInApi(id: string): Observable<boolean> {
    return this.eventsService.retrieveEvent(id)
      .take(1)
      // Load the events image
      .do((event) => this.store.dispatch(new imageActions.LoadAction(event && event.imageId)))
      .map((event) => new eventActions.LoadAction(event))
      .do((action: eventActions.LoadAction) => this.store.dispatch(action))
      .map((event) => !!event)
      .catch(() => {
        this.store.dispatch(new eventActions.RemoveAction(id));
        this.store.dispatch(go(['/404']));
        return of(false);
      });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    const id = route.params['id'];

    return this.waitForCollectionToLoad()
      .switchMap(() => this.hasEvent(id))
      .do(() => this.store.dispatch(new eventActions.SelectAction(id)));
  }

  canDeactivate(component: any): boolean {
    this.store.dispatch(new eventActions.SelectAction(null));
    return true;
  }

}
