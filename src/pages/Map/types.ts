export interface Region {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
}

export interface Map {
  points: Point[];
  X_MIN: number;
  Y_MAX: number;
  X_RANGE: number;
  Y_RANGE: number;
  region: Region;
  grid: 'vertical' | 'diagonal';
  width: number;
  height: number;
  ystep: number;
}

export interface MapSettings {
  height?: number;
  width?: number;
  countries?: string[];
  region?: Region;
  grid?: 'vertical' | 'diagonal';
}

export interface Settings extends MapSettings {
  map: Map;
  avoidOuterPins?: false | true;
}

export interface SvgOptions {
  color?: string;
  radius?: number;
}

export interface Pin {
  lat: number;
  lng: number;
  data?: any;
  svgOptions?: SvgOptions;
}

export interface SvgSettings {
  shape?: 'circle' | 'hexagon';
  color?: string;
  backgroundColor?: string;
  radius?: number;
}

export type Point = {
  x: number;
  y: number;
  lat: number;
  lng: number;
  data?: any;
  svgOptions?: SvgOptions;
};
