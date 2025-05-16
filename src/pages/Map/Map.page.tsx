import { FC, useEffect, useRef } from 'react';
import { getMapJSON } from 'dotted-map';
import { Doter } from './doter';
import { Container } from './styles';

// list of coordinates to pin
const coords: Array<[number, number]> = [
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // prepare map and pins
    const mapJson = JSON.parse(getMapJSON({ height: 100, grid: 'diagonal' }));
    const map = Doter({ map: mapJson });
    coords.forEach(([lat, lng]) => map.addPin({ lat, lng, svgOptions: { color: '#d6ff79', radius: 0.15 } }));

    const rawPoints = map.getPoints();
    const WIDTH = map.image.width;
    const HEIGHT = map.image.height;

    // sizing
    const containerWidth = container.offsetWidth;
    const scale = containerWidth / WIDTH;
    const canvasHeight = HEIGHT * scale;
    const dpr = window.devicePixelRatio || 1;

    // configure canvas for high DPI
    canvas.width = containerWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.save();
    ctx.scale(dpr * scale, dpr * scale);

    // draw hex cells
    const seen = new Set<string>();
    rawPoints.forEach((pt: any) => {
      const key = `${pt.x}:${pt.y}`;
      if (seen.has(key)) return;
      seen.add(key);
      const r = pt.svgOptions?.radius || 0.15;
      const c = pt.svgOptions?.color || '#7e7e7e';
      const sq3r = Math.sqrt(3) * r;
      ctx.beginPath();
      ctx.moveTo(pt.x + sq3r, pt.y - r);
      ctx.lineTo(pt.x + sq3r, pt.y + r);
      ctx.lineTo(pt.x, pt.y + 2 * r);
      ctx.lineTo(pt.x - sq3r, pt.y + r);
      ctx.lineTo(pt.x - sq3r, pt.y - r);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.fill();
    });

    // draw pins
    rawPoints
      .filter((pt: any) => pt.data)
      .forEach((pt: any) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.svgOptions.radius || 0.15, 0, Math.PI * 2);
        ctx.fillStyle = pt.svgOptions.color;
        ctx.fill();
      });

    ctx.restore();
  }, []);

  return (
    <Container ref={containerRef}>
      <canvas ref={canvasRef} />
    </Container>
  );
};
