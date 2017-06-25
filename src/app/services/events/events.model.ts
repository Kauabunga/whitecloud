

export interface Event {

  id: string;

  lat: number;
  lng: number;

  location: EventLocation;

  description: string | null;
  imageUrl: string | null;

}

export interface EventLocation {
  description: string;
  place_id: string;
}
