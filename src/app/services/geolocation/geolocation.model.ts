import { Coords } from '../map/map.model';

export interface Geolocation {
  timestamp: number;
  coords: Coords;
}
