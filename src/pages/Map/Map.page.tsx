import { FC, useEffect, useRef, useState } from 'react';
import { getMapJSON } from 'dotted-map';
import { Doter } from './doter';
import { Container } from './styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

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

const RADIUS = 0.1;
const MAP_HEIGHT = 200;

// throttle helper to limit how often a function can run
function throttle(func: () => void, limit: number): () => void {
  let inThrottle = false;
  return () => {
    if (!inThrottle) {
      func();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export const WorldMap: FC = () => {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<number>(1);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scaleRef = useRef<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const pointerDownRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const drawRef = useRef<() => void>(() => {});
  const ZOOM_FACTOR = 1.5;
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 10;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // prepare map and pins
    const mapJson = JSON.parse(getMapJSON({ height: MAP_HEIGHT, grid: 'diagonal' }));
    const map = Doter({ map: mapJson });
    coords.forEach(([lat, lng]) => map.addPin({ lat, lng, svgOptions: { color: '#d6ff79', radius: RADIUS } }));

    const rawPoints = map.getPoints();
    const WIDTH = map.image.width;
    const HEIGHT = map.image.height;

    // draw function
    const draw = () => {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const baseScale = Math.min(containerWidth / WIDTH, containerHeight / HEIGHT);
      const scale = baseScale * zoomRef.current;
      scaleRef.current = scale;
      // clamp offsets based on current zoom and container size (centered)
      const boundX = containerWidth / scale - WIDTH;
      const halfBoundX = boundX / 2;
      const minOffsetX = halfBoundX;
      const maxOffsetX = -halfBoundX;
      offsetRef.current.x = Math.min(maxOffsetX, Math.max(minOffsetX, offsetRef.current.x));
      const boundY = containerHeight / scale - HEIGHT;
      const halfBoundY = boundY / 2;
      const minOffsetY = halfBoundY;
      const maxOffsetY = -halfBoundY;
      offsetRef.current.y = Math.min(maxOffsetY, Math.max(minOffsetY, offsetRef.current.y));
      const canvasWidth = WIDTH * scale;
      const canvasHeight = HEIGHT * scale;
      const dpr = window.devicePixelRatio || 1;

      console.log({
        containerWidth,
        containerHeight,
        baseScale,
        scale,
        offsetRef: offsetRef.current,
        canvasWidth,
        canvasHeight,
        boundX,
        boundY,
        containerWidthAndScale: containerWidth / scale,
        containerHeightAndScale: containerHeight / scale,
      });

      // configure canvas for high DPI
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      const ctx = canvas.getContext('2d')!;
      ctx.save();
      ctx.scale(dpr * scale, dpr * scale);
      ctx.translate(offsetRef.current.x, offsetRef.current.y);

      // draw hex cells
      const seen = new Set<string>();
      rawPoints.forEach((pt: any) => {
        const key = `${pt.x}:${pt.y}`;
        if (seen.has(key)) return;
        seen.add(key);
        const r = pt.svgOptions?.radius || RADIUS;
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
          ctx.arc(pt.x, pt.y, pt.svgOptions.radius || RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = pt.svgOptions.color;
          ctx.fill();
        });

      ctx.restore();

      // store draw function for external use
      drawRef.current = draw;
    };

    // initial draw
    draw();
    setLoading(false);

    // throttled resize handler
    const handleResize = throttle(draw, 100);
    window.addEventListener('resize', handleResize);

    const handleZoom = (e: MouseEvent) => {
      if (e.detail !== 2) return;
      e.preventDefault();
      if (e.button === 0) {
        zoomRef.current = Math.min(MAX_ZOOM, zoomRef.current * ZOOM_FACTOR);
        draw();
      } else if (e.button === 2) {
        zoomRef.current = Math.max(MIN_ZOOM, zoomRef.current / ZOOM_FACTOR);
        draw();
      }
    };
    const handleContextMenu = (e: Event) => e.preventDefault();

    container.addEventListener('mousedown', handleZoom);
    container.addEventListener('contextmenu', handleContextMenu);

    // pan (drag) handlers
    const handlePanMove = (e: MouseEvent) => {
      if (!pointerDownRef.current) return;
      e.preventDefault();
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      // start dragging after threshold
      if (!isDraggingRef.current && Math.hypot(dx, dy) < 5) return;
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      offsetRef.current.x += dx / scaleRef.current;
      offsetRef.current.y += dy / scaleRef.current;
      // clamp pan offsets based on current zoom and container size (centered)
      const boundX2 = container.offsetWidth / scaleRef.current - WIDTH;
      const halfBoundX2 = boundX2 / 2;
      const minOffsetX2 = halfBoundX2;
      const maxOffsetX2 = -halfBoundX2;
      offsetRef.current.x = Math.min(maxOffsetX2, Math.max(minOffsetX2, offsetRef.current.x));
      const boundY2 = container.offsetHeight / scaleRef.current - HEIGHT;
      const halfBoundY2 = boundY2 / 2;
      const minOffsetY2 = halfBoundY2;
      const maxOffsetY2 = -halfBoundY2;
      offsetRef.current.y = Math.min(maxOffsetY2, Math.max(minOffsetY2, offsetRef.current.y));
      draw();
    };
    const handlePointerUp = (e: MouseEvent) => {
      if (!pointerDownRef.current) return;
      pointerDownRef.current = false;
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handlePanMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
    const handlePointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      pointerDownRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      window.addEventListener('mousemove', handlePanMove);
      window.addEventListener('mouseup', handlePointerUp);
    };
    container.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      // cleanup pan listeners
      window.removeEventListener('mousemove', handlePanMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('mousedown', handleZoom);
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // zoom button handlers
  const handleZoomIn = () => {
    zoomRef.current = Math.min(MAX_ZOOM, zoomRef.current * ZOOM_FACTOR);
    drawRef.current();
  };
  const handleZoomOut = () => {
    zoomRef.current = Math.max(MIN_ZOOM, zoomRef.current / ZOOM_FACTOR);
    drawRef.current();
  };

  return (
    <Container ref={containerRef}>
      {/* zoom controls */}
      <div
        style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 20 }}
      >
        <IconButton size="small" onClick={handleZoomIn}>
          <ZoomInIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleZoomOut}>
          <ZoomOutIcon fontSize="small" />
        </IconButton>
      </div>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CircularProgress />
            <Typography variant="body1" color="textSecondary">
              Loading map...
            </Typography>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ visibility: loading ? 'hidden' : 'visible' }} />
    </Container>
  );
};
