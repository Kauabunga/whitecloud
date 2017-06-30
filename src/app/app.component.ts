import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/combineLatest';
import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { State } from './app.reducers';
import { Store } from '@ngrx/store';
import * as mapActions from './services/map/map.actions';
import * as mapReducer from './services/map/map.reducer';

/**
 * App Component
 * Top Level Component
 */
@Component({
  moduleId: 'app',
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  menuState: 'over' | 'side' = 'side';

  opened: boolean = true;

  // Map instance
  googleMap;

  constructor(public store: Store<State>) {
  }

  public ngOnInit() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.menuState = this.getMenuState();
  }

  getMenuState(): 'side' | 'over' {
    return window.innerWidth > 768
      ? 'side'
      : 'over';
  }

  public handleHome() {
    this.handleResetMap();
  }

  public handleMenu() {
    this.opened = !this.opened;
  }

  public handleSidenavClose() {
    this.triggerMapsResize();
    this.opened = false;
  }

  public handleSidenavOpen() {
    this.triggerMapsResize();
    this.opened = true;
  }

  public handleMapInstance(googleMap) {
    this.googleMap = googleMap;
  }

  public triggerMapsResize() {
    if (this.googleMap) {
      (window as any).google.maps.event.trigger(this.googleMap, 'resize');
    }
  }

  public handleResetMap() {
    this.store.dispatch(new mapActions.ResetAction());
  }

}
