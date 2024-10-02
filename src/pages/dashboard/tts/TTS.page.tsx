import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export const TTSPage = () => {
  return (
    <Box>
      <h1>Text-to-Speech</h1>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Build new audio</Typography>
          </Paper>
        </Grid>
        <Grid size={{ sm: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">🍝 List of models</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
