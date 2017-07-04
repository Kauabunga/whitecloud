import { Bounds, Coords } from '../map/map.model';
export interface Event {

  id: string;
  createdAt?: number;

  location: EventLocation;
  pest: string;

  owner: string;
  description: string | null;
  imageId: string;
}

export interface EventLocation {
  description: string;
  place_id: string;
  coords: Coords;
  bounds: Bounds;
}
