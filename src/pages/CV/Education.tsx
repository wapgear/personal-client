import { Box, Divider, Typography } from '@mui/material';
import { List, ListItem } from './shared.tsx';

export const Education = () => {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Typography variant="h5" letterSpacing="-0.05em" fontWeight="700">
        EXTRA's
      </Typography>
      <Divider variant="fullWidth" sx={{ backgroundColor: '#000', mt: '-4px' }} />
      <List gap={1}>
        <ListItem position="AWS Cloud Solutions" date="08/2024" />
        <ListItem position="Bullshit generator award" date="11/1996" />
      </List>
    </Box>
  );
};
