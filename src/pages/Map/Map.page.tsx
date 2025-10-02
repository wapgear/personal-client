import { FC, useEffect, useRef, useState } from 'react';
import { Doter } from './doter';
import { Container } from './styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import mapData from './mapData.json';

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

const RADIUS = 1;

// precompiled map data
let precompiledMapData: {
  hexagons: Array<{ x: number; y: number; isHighlighted: boolean }>;
  width: number;
  height: number;
} | null = null;

// precompile map data once using the preloaded JSON
const getPrecompiledMapData = (containerHeight: number) => {
  if (precompiledMapData) return precompiledMapData;

  // Scale the base map data to match container height
  const baseHeight = 125; // The height used when generating the map data
  const scaleFactor = containerHeight / baseHeight;

  const mapJson = JSON.parse(JSON.stringify(mapData));
  const map = Doter({ map: mapJson });

  // Get transformed coordinates for each coordinate in coords array
  const transformedCoords = coords.map(([lat, lng]) => {
    const pin = map.getPin({ lat, lng });
    return { x: pin.x, y: pin.y };
  });

  const rawPoints = map.getPoints();
  const WIDTH = map.image.width * scaleFactor;
  const HEIGHT = map.image.height * scaleFactor;

  // Create set of highlighted positions using the exact transformed coordinates
  const highlightedPositions = new Set<string>();
  transformedCoords.forEach(({ x, y }) => {
    highlightedPositions.add(`${x}:${y}`);
  });

  // process all hexagons and mark highlighted ones
  const seen = new Set<string>();
  const hexagons: Array<{ x: number; y: number; isHighlighted: boolean }> = [];

  rawPoints.forEach((pt: { x: number; y: number }) => {
    const key = `${pt.x}:${pt.y}`;
    if (seen.has(key)) return;
    seen.add(key);

    const scaledX = pt.x * scaleFactor;
    const scaledY = pt.y * scaleFactor;
    const isHighlighted = highlightedPositions.has(key);

    hexagons.push({
      x: scaledX,
      y: scaledY,
      isHighlighted,
    });
  });

  precompiledMapData = { hexagons, width: WIDTH, height: HEIGHT };
  return precompiledMapData;
};

export const WorldMap: FC = () => {
  const [loading, setLoading] = useState(true);
  const [showRotationSuggestion, setShowRotationSuggestion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile and in portrait mode
  const checkOrientation = () => {
    const isMobile = window.innerWidth <= 768;
    const isPortrait = window.innerHeight > window.innerWidth;
    setShowRotationSuggestion(isMobile && isPortrait);
  };

  useEffect(() => {
    // Initial check
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const draw = () => {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const mapData = getPrecompiledMapData(containerHeight);

      // scale to fit container width while maintaining aspect ratio
      const scale = containerWidth / mapData.width;
      const scaledHeight = mapData.height * scale;

      const dpr = window.devicePixelRatio || 1;

      // set canvas size
      canvas.width = containerWidth * dpr;
      canvas.height = scaledHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${scaledHeight}px`;

      const ctx = canvas.getContext('2d')!;
      ctx.save();
      ctx.scale(dpr * scale, dpr * scale);

      // draw hexagons
      mapData.hexagons.forEach(({ x, y, isHighlighted }) => {
        const r = RADIUS;
        const color = isHighlighted ? '#ffff00' : '#7e7e7e';
        const sq3r = Math.sqrt(3) * r;

        ctx.beginPath();
        ctx.moveTo(x + sq3r, y - r);
        ctx.lineTo(x + sq3r, y + r);
        ctx.lineTo(x, y + 2 * r);
        ctx.lineTo(x - sq3r, y + r);
        ctx.lineTo(x - sq3r, y - r);
        ctx.lineTo(x, y - 2 * r);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });

      ctx.restore();
    };

    // initial draw
    draw();
    setLoading(false);

    // handle resize
    const handleResize = () => {
      // Reset precompiled data on resize to recalculate with new container height
      precompiledMapData = null;
      draw();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container ref={containerRef}>
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

      {showRotationSuggestion && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              textAlign: 'center',
              px: 4,
            }}
          >
            <ScreenRotationIcon
              sx={{
                fontSize: 64,
                color: 'white',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  '50%': {
                    opacity: 0.7,
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Better Experience Awaits!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 280,
                lineHeight: 1.5,
              }}
            >
              Rotate your device to landscape mode for the best map viewing experience
            </Typography>
          </Box>
        </Box>
      )}

      <canvas ref={canvasRef} style={{ visibility: loading ? 'hidden' : 'visible' }} />
    </Container>
  );
};
