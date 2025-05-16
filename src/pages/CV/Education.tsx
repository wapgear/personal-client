import { Box, Divider, Typography } from '@mui/material';
import { List, ListItem } from './shared.tsx';

export const Education = () => {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Typography variant="h5" fontWeight="700" letterSpacing="-0.05em">
        CERTIFICATIONS
      </Typography>
      <Divider variant="fullWidth" sx={{ backgroundColor: '#000', }} />
      <List gap={1}>
        <ListItem position="AWS Cloud Solutions" date="08/2024" />
      </List>
    </Box>
  );
};
