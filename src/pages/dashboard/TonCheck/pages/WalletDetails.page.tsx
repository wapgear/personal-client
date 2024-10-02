import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { Comments } from '../components/Comments.tsx';
import { YourComment } from '../components/YourComment.tsx';
import { Paper } from '../components/shared.tsx';
import { FC, ReactNode } from 'react';
import { RatingBlock } from '../components/RatingBlock.tsx';
import { useGetOrFetchComment } from '../hooks/useGetOrFetchComment.hook.ts';

const GlobalError: FC<{ children: ReactNode }> = ({ children }) => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </Box>
);

const isWalletValid = (wallet?: string) => {
  return wallet?.length === 48 || wallet?.endsWith('.ton');
};

export const WalletDetailsPage = () => {
  const { wallet } = useParams<{ wallet: string }>();

  if (!isWalletValid(wallet)) {
    return (
      <GlobalError>
        <Typography variant="h5">Invalid wallet address</Typography>
      </GlobalError>
    );
  }

  return <WalletDetails />;
};

const WalletDetails = () => {
  const { wallet } = useParams<{ wallet: string }>();
  const { isLoading, comments, error } = useGetOrFetchComment(wallet || '');
  if (isLoading || error) {
    return (
      <GlobalError>{error ? <Typography variant="h5">{error.message}</Typography> : <CircularProgress />}</GlobalError>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 8, xs: 12 }}>
        <Paper sx={{ height: '100%' }}>
          <Typography variant="h4" sx={{ overflowWrap: 'break-word' }}>
            {wallet}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Here's the information about this wallet. Should you trust it? Let's find out.
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ md: 4, xs: 12 }}>
        <RatingBlock comments={comments} />
      </Grid>
      <Grid size={12}>
        <Summary />
      </Grid>
      <Grid size={12}>
        <Comments comments={comments} />
      </Grid>
      <Grid size={12}>
        <YourComment />
      </Grid>
    </Grid>
  );
};

const Summary = () => (
  <Paper>
    <Typography variant="h5">People often mention</Typography>
    <Box sx={{ mt: 2 }}>
      <Box display="flex" flexWrap="wrap" gap={1}>
        <Chip label="Real user" color="success" />
        <Chip label="No scam" color="success" />
        <Chip label="Good communication" color="success" />
        <Chip label="Author huesos" color="error" />
      </Box>
    </Box>
  </Paper>
);
