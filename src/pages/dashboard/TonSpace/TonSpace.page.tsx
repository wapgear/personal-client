import Grid from '@mui/material/Grid2';
import { NormalizedJetton, useDashboardStore } from '../../../store';
import { FC, useMemo } from 'react';
import { Avatar, Box, Paper, Typography } from '@mui/material';

export const TonSpacePage = () => {
  const { normalizedJettons } = useDashboardStore();

  const list = useMemo(
    () => normalizedJettons().sort((a, b) => b.totalPriceInUsd - a.totalPriceInUsd),
    [normalizedJettons],
  );
  const totalBalance = useMemo(() => list.reduce((acc, item) => acc + item.totalPriceInUsd, 0), [list]);

  return (
    <Grid container spacing={2}>
      <Dedust />
      <Grid size={12}>
        <Typography variant="h6">Balance: {totalBalance.toFixed(2)}$</Typography>
      </Grid>
      {list.map((item) => (
        <Grid size={12}>
          <JettonItem {...item} />
        </Grid>
      ))}
    </Grid>
  );
};

const Dedust: FC = () => {
  return (
    <>
      <Grid size={12}>
        <Typography variant="h6">DeDust</Typography>
      </Grid>
    </>
  );
};

const JettonItem: FC<NormalizedJetton> = ({ balance, diff, name, symbol, image, totalPriceInUsd, priceInUsd }) => {
  return (
    <Paper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar src={image} />
          <Box>
            <Typography variant="body1">{symbol}</Typography>
            <Typography variant="body2" fontSize="12px">
              {name} - {priceInUsd}$
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Typography variant="body1">{balance}</Typography>
          <Typography variant="body1" fontSize="10px">
            {totalPriceInUsd.toFixed(2)}$ <Diff diff={diff} />
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const Diff: FC<{ diff: string }> = ({ diff }) => {
  const color = useMemo(() => {
    if (diff.includes('+')) {
      return 'success.dark';
    }
    if (diff.includes('−')) {
      return 'error.dark';
    }
    return 'inherit';
  }, [diff]);

  return (
    <Box component="span" color={color}>
      {diff}
    </Box>
  );
};
