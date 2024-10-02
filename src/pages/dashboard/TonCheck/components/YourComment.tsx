import { useState } from 'react';
import { IChip } from '../types.ts';
import { Box, Button, Checkbox, Chip, FormControlLabel, TextField, Typography } from '@mui/material';
import { Paper } from './shared.tsx';

export const YourComment = () => {
  const [selectedChips, setSelectedChips] = useState<IChip[]>([]);

  return (
    <Paper>
      <Typography variant="h5">Leave your opinion</Typography>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box display="flex" gap={1} flexWrap="wrap">
          {chipsList.map((chip) => {
            const isSelected = selectedChips.find((c) => c.label === chip.label);

            return (
              <Chip
                key={chip.label}
                label={chip.label}
                color={chip.color}
                variant={isSelected ? 'filled' : 'outlined'}
                onClick={() =>
                  setSelectedChips((current) => {
                    if (current.find((c) => c.label === chip.label)) {
                      return current.filter((c) => c.label !== chip.label);
                    }
                    return [...current, chip];
                  })
                }
              />
            );
          })}
        </Box>
        <TextField label="Your comment" multiline maxRows={5} minRows={2} />
        <Box>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Show my identity (nzYq...QWfcz)" />
        </Box>
        <Box>
          <Button variant="outlined" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const chipsList: IChip[] = [
  {
    label: 'Real user',
    color: 'success',
  },
  {
    label: 'No scam',
    color: 'success',
  },
  {
    label: 'Good communication',
    color: 'success',
  },
  {
    label: 'SPAM',
    color: 'error',
  },
  {
    label: 'Scam',
    color: 'error',
  },
  {
    label: 'Owner huesos',
    color: 'error',
  },
];
