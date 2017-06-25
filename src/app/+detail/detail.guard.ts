import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Router, CanActivate, ActivatedRouteSnapshot, CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

import {State} from "../app.reducers";
import {SelectAction} from '../services/events/events.actions';


/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class DetailGuard implements CanActivate, CanDeactivate<any> {

  constructor(private store: Store<State>,
              private router: Router) {
  }


  canDeactivate(component: any): boolean {

    this.store.dispatch(new SelectAction(null));
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.store.dispatch(new SelectAction(route.params['id']));
    return Observable.of(true);
  }
}
