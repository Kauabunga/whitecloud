export interface Map {
  lat: number;
  lng: number;

  bounds: Bounds;
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  east: number;
  south: number;
  west: number;
}
