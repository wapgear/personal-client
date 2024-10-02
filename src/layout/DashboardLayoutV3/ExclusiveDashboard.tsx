import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const ExclusiveDashboard = () => {
  return (
    <Box component="main" sx={{ flexGrow: 1, px: [2, 4], py: [2, 4], height: '100dvh' }}>
      <Outlet />
    </Box>
  );
};
