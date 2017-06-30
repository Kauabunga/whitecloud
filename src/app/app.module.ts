import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DBModule } from '@ngrx/db';
import { RouterStoreModule } from '@ngrx/router-store';
import { reducer } from './app.reducers';
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import './offline';
import { AppComponent } from './app.component';
import { InternalStateType } from './app.service';
import { NoContentComponent } from './containers/no-content';
import '../styles/styles.scss';
import {
  MdButtonModule,
  MdCardModule,
  MdIconModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdListModule,
  MdSidenavModule,
  MdTooltipModule
} from '@angular/material';
import { EventsEffects } from './services/events/events.effects';
import { CreateEffects } from './services/create/create.effects';
import { MapEffects } from './services/map/map.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsService } from './services/events/events.service';
import { CommonModule } from '@angular/common';
import { AppVersionEffects } from './services/app-version/app-version.effects';
import { GeolocationEffects } from './services/geolocation/geolocation.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MapComponent } from './components/map/map.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PlacesEffects } from './services/places/places.effects';

// Application wide providers
const APP_PROVIDERS = [
  EventsService,
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

let IMPORTS = [
  BrowserModule,
  CommonModule,
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
  EffectsModule.run(AppVersionEffects),
  EffectsModule.run(GeolocationEffects),
  EffectsModule.run(PlacesEffects),

  AgmCoreModule.forRoot({
    apiKey: 'AIzaSyB_mwjIVMU_1GjjyiI4dsRU83JvDZyqAUY',
    libraries: ['places']
  }),

  RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules}),
];

if (ENV === 'production'){
  IMPORTS.push(StoreDevtoolsModule.instrumentOnlyWithExtension());
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    MapComponent,
    ToolbarComponent,
    NoContentComponent,
  ],
  imports: IMPORTS,
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS
  ],
})
export class AppModule {
}
