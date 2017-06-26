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
import { State } from '../app.reducers';
import { go } from '@ngrx/router-store';
import * as createActions from '../services/create/create.actions';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class CreateGuard implements CanActivate, CanDeactivate<any> {

  constructor(private store: Store<State>) {
  }

  canDeactivate(component: any): boolean {
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    this.store.dispatch(new createActions.ResetAction());

    console.log('RESETINGGGGG');

    return Observable.of(true);
  }
}
