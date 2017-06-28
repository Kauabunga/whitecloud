import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DBModule } from '@ngrx/db';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './app.reducers';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import './offline';
// App is our top level component
import { AppComponent } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { NoContentComponent } from './no-content';
import '../styles/styles.scss';
import '../styles/headings.css';
import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdListModule, MdSidenavModule, MdTooltipModule
} from '@angular/material';
import { EventsEffects } from './services/events/events.effects';
import { CreateEffects } from './services/create/create.effects';
import { MapEffects } from './services/map/map.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsService } from './services/events/events.service';
import { CommonModule } from '@angular/common';

// Application wide providers
const APP_PROVIDERS = [
  EventsService,
  // AppState,
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NoContentComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    // FormsModule,
    // HttpModule,
    BrowserAnimationsModule,

    MdCardModule,
    MdListModule,
    MdButtonModule,
    MdIconModule,
    MdToolbarModule,
    MdSidenavModule,
    MdSnackBarModule,
    MdTooltipModule,

    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),

    EffectsModule.run(EventsEffects),
    EffectsModule.run(CreateEffects),
    EffectsModule.run(MapEffects),

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB_mwjIVMU_1GjjyiI4dsRU83JvDZyqAUY',
      libraries: ['places']
    }),

    RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules}),

  ],
  //   .concat(
  //   ENV === 'production'
  //     ? null
  //     : StoreDevtoolsModule.instrumentOnlyWithExtension()
  // ),
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS
  ],
})
export class AppModule {
}
