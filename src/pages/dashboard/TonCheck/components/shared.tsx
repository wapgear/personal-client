import { Paper as MUIPaper, styled } from '@mui/material';

export const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
}));
