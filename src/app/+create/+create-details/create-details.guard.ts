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
import { getCreateState, State } from '../../app.reducers';
import { go } from '@ngrx/router-store';
import * as createActions from '../../services/create/create.actions';
import { getCreateEvent } from '../../services/create/create.reducer';

@Injectable()
export class CreateDetailsGuard implements CanActivate, CanDeactivate<any> {

  constructor(private store: Store<State>) {
  }

  canDeactivate(component: any): boolean {
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    return this.store.select(getCreateState)
      .map(getCreateEvent)
      .take(1)
      .map((event) => {
        console.log(event);
        if (event && event.location && event.location.coords) {
          return true;
        }
        else {
          this.store.dispatch(go(['/', 'create', 'location']));
          return false;
        }
      });
  }
}
