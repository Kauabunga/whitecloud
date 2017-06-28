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
import * as mapActions from './map.actions';
import { Coords } from './map.model';
import { getMapId } from './map.reducer';

let autocompleteService;
let placesService;
let geocoderService;

const nzBounds = {
  south: -47.31964113109319,
  west: 164.210693359375,
  north: -34.01099680852081,
  east: -179.287841796875
};

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 * The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * Documentation on `toPayload` can be found here:
 * https://github.com/ngrx/effects/blob/master/docs/api.md#topayload
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */
@Injectable()
export class MapEffects {

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
          [
            {
              formatted_address: 'Current marker',
              place_id: null,
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
    console.log(results);
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
          formatted_address: value.formatted_address
            .replace(/\s\d\d\d\d/, '')
            .replace(', New Zealand', '')
            .trim()
            .replace(/,$/, '')
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
