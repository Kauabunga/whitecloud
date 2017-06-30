import 'rxjs/add/operator/distinctUntilChanged';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'toolbar',
  styleUrls: ['toolbar.component.css'],
  templateUrl: 'toolbar.component.html',
})
export class ToolbarComponent implements OnInit {

  menu: EventEmitter<null> = new EventEmitter();
  home: EventEmitter<null> = new EventEmitter();

  title$: Observable<string>;

  constructor(public store: Store<State>,
              public router: Router) {
  }

  public ngOnInit() {
    this.title$ = this.getTitle();
  }

  getTitle() {
    return this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.getDeepestTitle(this.router.routerState.snapshot.root));
  }

  getDeepestTitle(routeSnapshot: ActivatedRouteSnapshot) {
    let title = routeSnapshot.data ? routeSnapshot.data['title'] : '';
    if (routeSnapshot.firstChild) {
      title = this.getDeepestTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

}
