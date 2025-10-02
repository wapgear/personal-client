import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: 'radial-gradient(1200px 600px at 50% -10%, rgba(132, 140, 20, 0.35), #02180d 60%)',
        backgroundColor: '#0a1f13',
        color: '#33ff33',
        filter: 'contrast(1.1) saturate(1.2)',
        fontFamily: "'Lucida Console', 'Consolas', 'SFMono-Regular', 'Menlo', 'Monaco', monospace",
      }}
    >
      <Box
        sx={{
          maxWidth: 860,
          px: 3,
          py: 6,
          m: '0 auto',
          width: '100%',
          lineHeight: 1.6,
          textShadow: '0 0 1px rgba(0,0,0,0.5)',
        }}
      >
        <pre
          aria-label="404 website error"
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: 16,
            textShadow: '0 0 4px rgba(51,255,51,0.35), 0 0 12px rgba(51,255,51,0.2)',
            letterSpacing: '0.3px',
            animation: 'textFlicker 6s infinite alternate',
          }}
        >
          {`A 404 website error has occurred.

The page you are looking for was not found (HTTP 404).

If this is the first time you've seen this error screen,
refresh the page. If this screen appears again, follow
these steps:

Check to make sure the URL is typed correctly.
If a link brought you here, try navigating from the home page.

Technical information:

ERROR_CODE: HTTP_404 (0x00000194)

Collecting diagnostic data ...
Initializing error report ...
Dumping request log: 100%`}
        </pre>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mt: 4,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ opacity: 0.85 }}>Press this button to return to safety</Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/', { replace: true })}
            sx={{
              borderColor: 'rgba(51,255,51,0.6)',
              color: '#33ff33',
              '&:hover': {
                borderColor: '#33ff33',
                backgroundColor: 'rgba(51,255,51,0.06)',
              },
              textTransform: 'none',
              fontFamily: "'Lucida Console', 'Consolas', 'SFMono-Regular', 'Menlo', 'Monaco', monospace",
            }}
          >
            Go Home
          </Button>
          <span
            aria-hidden
            style={{
              marginLeft: 8,
              display: 'inline-block',
              width: 8,
              height: 18,
              backgroundColor: '#33ff33',
              animation: 'blink 1.1s steps(1,end) infinite',
            }}
          />
        </Box>

        <style>{`@keyframes blink { 50% { opacity: 0; } }
@keyframes textFlicker {
  0% { opacity: 0.92; }
  2% { opacity: 0.9; }
  4% { opacity: 0.92; }
  6% { opacity: 0.88; }
  8% { opacity: 0.93; }
  10% { opacity: 0.9; }
  12% { opacity: 0.95; }
  14% { opacity: 0.9; }
  16% { opacity: 0.94; }
  18% { opacity: 0.9; }
  20% { opacity: 0.96; }
  22% { opacity: 0.9; }
  24% { opacity: 0.93; }
  26% { opacity: 0.9; }
  28% { opacity: 0.95; }
  30% { opacity: 0.9; }
  32% { opacity: 0.94; }
  34% { opacity: 0.9; }
  36% { opacity: 0.96; }
  38% { opacity: 0.9; }
  40% { opacity: 0.94; }
  42% { opacity: 0.9; }
  44% { opacity: 0.95; }
  46% { opacity: 0.9; }
  48% { opacity: 0.96; }
  50% { opacity: 0.9; }
  52% { opacity: 0.93; }
  54% { opacity: 0.9; }
  56% { opacity: 0.95; }
  58% { opacity: 0.9; }
  60% { opacity: 0.94; }
  62% { opacity: 0.9; }
  64% { opacity: 0.96; }
  66% { opacity: 0.9; }
  68% { opacity: 0.95; }
  70% { opacity: 0.9; }
  72% { opacity: 0.94; }
  74% { opacity: 0.9; }
  76% { opacity: 0.96; }
  78% { opacity: 0.9; }
  80% { opacity: 0.94; }
  82% { opacity: 0.9; }
  84% { opacity: 0.95; }
  86% { opacity: 0.9; }
  88% { opacity: 0.94; }
  90% { opacity: 0.9; }
  92% { opacity: 0.96; }
  94% { opacity: 0.9; }
  96% { opacity: 0.95; }
  98% { opacity: 0.9; }
  100% { opacity: 0.96; }
}`}</style>
      </Box>
    </Box>
  );
};
