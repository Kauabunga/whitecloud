export interface Stats {
  updatedAt: number;

  total: number;

  pests: {
    rat: number;
    mouse: number;
    stoat: number;
    possum: number;
  };
}
