import { Box, Link, Typography } from '@mui/material';

export const Title = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography variant="h5" fontSize="32px" textTransform="uppercase" fontWeight={700} letterSpacing="-0.05em">
          Anton Izmailov
        </Typography>
      </Link>
      <Typography variant="h5" fontSize="16px">
        Software Engineer
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          '& a': { color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
        }}
      >
        <Typography>Madrid, Spain</Typography>-
        <Typography>
          <a target="_blank" href="https://t.me/izmailovdev">
            @izmailovdev
          </a>
        </Typography>
        -
        <Typography>
          <a target="_blank" href="mailto:work@izmailov.dev">
            work@izmailov.dev
          </a>
        </Typography>
      </Box>
    </Box>
  );
};
