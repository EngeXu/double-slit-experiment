export interface SimulationParams {
  wavelength: number; // in nanometers (nm)
  slitSeparation: number; // distance between slits (arbitrary units, scaled)
  slitWidth: number; // width of each slit
  screenDistance: number; // distance from barrier to screen
  particleCount: number;
  isPlaying: boolean;
}

export enum ViewMode {
  Perspective = 'PERSPECTIVE',
  TopDown = 'TOP_DOWN',
}