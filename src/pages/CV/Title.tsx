import { Box, Typography } from '@mui/material';

export const Title = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" fontSize="24px" textTransform="uppercase" fontWeight={700}>
        Anton Izmailov
      </Typography>
      <Typography variant="h5" fontSize="16px" mt="-8px">
        Software Engineer
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          '& a': {
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        }}
      >
        <Typography>Tbilisi, Georgia</Typography>-
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
