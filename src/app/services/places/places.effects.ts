import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as mapActions from './places.actions';
import { Coords } from '../map/map.model';
import { getMapId } from '../map/map.reducer';

let autocompleteService;
let placesService;
let geocoderService;

const nzBounds = {
  south: -47.31964113109319,
  west: 164.210693359375,
  north: -34.01099680852081,
  east: -179.287841796875
};

@Injectable()
export class PlacesEffects {

  @Effect()
  lookup$: Observable<Action> = this.actions$
    .ofType(mapActions.LOOKUP)
    .map(toPayload)
    .debounceTime(200)
    .switchMap((query) =>
      this.getPlace(query)
        .map((results: any) => new mapActions.LookupSuccessAction({query, results}))
    );

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(mapActions.SEARCH)
    .map(toPayload)
    .debounceTime(200)
    .switchMap((query) =>
      typeof query === 'string'
        ? this.searchString(query)
        .map((results: any) => new mapActions.SearchSuccessAction({query, results}))
        : this.searchCoordinates(query)
        .map((results: any[]) =>
          this.filterCoordsSearchResults(results)
        )
        .map((results: any[]) =>

          // TODO join this @ container level
          // TODO flatten all place_id into single redux layer
          // TODO take this into searchLocation redux layer
          // TODO model these objects
          [
            {
              description: 'Current marker',
              formatted_address: results[0] && results[0].formatted_address || 'Current marker',
              place_id: 'current_marker',
              geometry: {
                location: query
              }
            }
          ].concat(results)
        )
        .map((results: any[]) =>
          new mapActions.SearchSuccessAction({query: getMapId(query), results})
        )
    );

  constructor(private actions$: Actions, private zone: NgZone) {
  }

  filterCoordsSearchResults(results) {
    return results
      // ensure we only display unique lat/lng locations
      .filter((v, i, a) =>
        a.indexOf(
          a.find((result) => JSON.stringify(result.geometry.location) === JSON.stringify(v.geometry.location))
        ) === i
      )
      // ignore new zealand
      .filter((value) => value.formatted_address !== 'New Zealand')
      // strip the 'New Zealand' from the strings
      .map((value) =>
        Object.assign({}, value, {
          formatted_address: this.tidyAddress(value.formatted_address)
        })
      )
      // ensure formatted address are unique
      .filter((v, i, a) =>
        a.indexOf(a.find((result) =>
        result.formatted_address.toLowerCase().replace(',', '').trim() ===
        v.formatted_address.toLowerCase().replace(',', '').trim())) === i
      )
      // Ignore any address that are just numbers
      .filter((value) => value.formatted_address.replace(/\d*/, '').trim().length !== 0)
      .slice(0, 4);
  }

  tidyAddress(address: string) {
    const tidyAddress = (address || '')
      .replace(/\s\d\d\d\d/, '')
      .replace(', New Zealand', '')
      .trim()
      .replace(/,$/, '')
      .trim();

    const pos = tidyAddress.lastIndexOf(' ');
    return pos > 0
      ? tidyAddress.substring(0, pos) + '&nbsp;' + tidyAddress.substring(pos + 1)
      : tidyAddress;
  }

  getPlace(placeId: string) {
    return Observable.from(new Promise((resolve, reject) =>
      this.getPlacesService().getDetails(
        {placeId},
        (results) => resolve(results)
      )
    ));
  }

  searchString(query: string) {
    return Observable.from(new Promise((resolve, reject) =>
      // this.getAutocompleteService().getQueryPredictions(
      this.getAutocompleteService().getPlacePredictions(
        {
          input: query,
          bounds: nzBounds,
          componentRestrictions: {country: 'nz'}
        },
        (results) => resolve(results)
      )
    ));
  }

  searchCoordinates(location: Coords) {
    return Observable.from(new Promise((resolve, reject) =>
      this.getGeocoderService().geocode(
        {
          location
        },
        (results) => resolve(results)
      )
    ));
  }

  getPlacesService() {
    return placesService =
      placesService || new (window as any).google.maps.places.PlacesService(document.createElement('div'));
  }

  getAutocompleteService() {
    return autocompleteService =
      autocompleteService || new (window as any).google.maps.places.AutocompleteService();
  }

  getGeocoderService() {
    return geocoderService =
      geocoderService || new (window as any).google.maps.Geocoder();
  }

}
