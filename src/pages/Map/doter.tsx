import proj4 from 'proj4';
import type { Pin, Point, Settings, SvgSettings } from './types';
import { ReactElement } from 'react';

export function Doter({ map }: Settings) {
  const { points, X_MIN, Y_MAX, X_RANGE, Y_RANGE, region, grid, width, height, ystep } = map;

  return {
    addPin({ lat, lng, data, svgOptions }: Pin): Point {
      const pin = this.getPin({ lat, lng });
      const point = { ...pin, data, svgOptions };

      // @ts-ignore
      points[[point.x, point.y].join(';')] = point;

      // @ts-ignore
      return point;
    },
    getPin({ lat, lng }: Pin) {
      // @ts-ignore
      const [googleX, googleY] = proj4(proj4.defs('GOOGLE'), [lng, lat]);
      let rawX = (width * (googleX - X_MIN)) / X_RANGE;
      const rawY = (height * (Y_MAX - googleY)) / Y_RANGE;
      const y = Math.round(rawY / ystep);
      if (y % 2 === 0 && grid === 'diagonal') {
        rawX -= 0.5;
      }
      let localx = Math.round(rawX);
      const localy = Math.round(y) * ystep;
      if (y % 2 === 0 && grid === 'diagonal') {
        localx += 0.5;
      }

      const [localLng, localLat] = proj4(
        // @ts-ignore
        proj4.defs('GOOGLE'),
        proj4.defs('WGS84'),
        [(localx * X_RANGE) / width + X_MIN, Y_MAX - (localy * Y_RANGE) / height],
      );

      return { x: localx, y: localy, lat: localLat, lng: localLng };
    },
    getPoints() {
      return Object.values(points);
    },
    getPoint([key, data]: [string, any], shape: string, color: string, radius: number) {
      const { x, y, svgOptions = {} } = data;
      const pointRadius = svgOptions.radius || radius;
      if (shape === 'circle') {
        return `<circle cx="${x}" cy="${y}" r="${pointRadius}" fill="${svgOptions.color || color}" />`;
      } else if (shape === 'hexagon') {
        const sqrt3radius = Math.sqrt(3) * pointRadius;

        const polyPoints = [
          [x + sqrt3radius, y - pointRadius],
          [x + sqrt3radius, y + pointRadius],
          [x, y + 2 * pointRadius],
          [x - sqrt3radius, y + pointRadius],
          [x - sqrt3radius, y - pointRadius],
          [x, y - 2 * pointRadius],
        ];

        return (
          <polygon
            fill={svgOptions.color || color}
            points={polyPoints.map((point) => point.join(',')).join(' ')}
            id={`hex-${key}`}
          />
        );
      }
    },

    getSVG({
      shape = 'circle',
      color = 'current',
      backgroundColor = 'transparent',
      radius = 0.5,
    }: SvgSettings): ReactElement {
      return (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            backgroundColor,
          }}
        >
          {Object.entries(points).map((data) => this.getPoint(data, shape, color, radius))}
        </svg>
      );
    },
    image: {
      region,
      width,
      height,
    },
  };
}
