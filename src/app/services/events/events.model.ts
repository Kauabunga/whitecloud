import { Bounds, Coords } from '../map/map.model';
export interface Event {

  createdAt?: number;

  id: string;

  location: EventLocation;

  title: string;
  pest: string;
  owner: string;

  description: string | null;
  imageUrl: string | null;

}

export interface EventLocation {
  description: string;
  place_id: string;
  coords: Coords;
  bounds: Bounds;
}
