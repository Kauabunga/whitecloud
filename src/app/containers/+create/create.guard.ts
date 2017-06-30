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
import { State } from '../../app.reducers';
import * as createActions from '../../services/create/create.actions';

@Injectable()
export class CreateGuard implements CanActivate, CanDeactivate<any> {

  constructor(private store: Store<State>) {
  }

  canDeactivate(component: any): boolean {
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.store.dispatch(new createActions.ResetAction());

    return Observable.of(true);
  }
}
