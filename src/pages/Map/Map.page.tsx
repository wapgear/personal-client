import { FC, ReactElement, useEffect, useState } from 'react';
import { Doter } from './doter';
import { Container } from './styles';
import { getMapJSON } from 'dotted-map';

const mapJsonString = getMapJSON({ height: 100, grid: 'diagonal' });

const coords = [
  [41.74917603890991, 44.79865968299764],
  [41.629250384016935, 41.638399375719494],
  [41.6035229438843, 45.92281761315321],
  [42.47583118010892, 44.48107604262426],
  [41.41205384407791, 41.4343633573085],
  [41.034418452363376, 40.53434135100376],
  [41.02600179381862, 39.727296819315214],
  [39.978234990514544, 32.89610364472018],
  [38.99110658549189, 40.65174404556648],
  [41.06277298412274, 29.013214703013222],
  [41.06277298412274, 29.01321470305],
];

export const WorldMap: FC = () => {
  const [svgMap, setSvgMap] = useState<ReactElement | null>(null);
  useEffect(() => {
    // @ts-ignore
    const map = new Doter({ map: JSON.parse(mapJsonString) });

    coords.forEach(([lat, lng]) => {
      map.addPin({
        lat,
        lng,
        svgOptions: { color: '#d6ff79', radius: 0.25 },
      });
    });

    setSvgMap(
      map.getSVG({
        radius: 0.25,
        color: '#7e7e7e',
        shape: 'hexagon',
        backgroundColor: 'transparent',
      }),
    );
  }, []);

  return <Container>{svgMap}</Container>;
};
