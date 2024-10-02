import { FC, useMemo } from 'react';
import { IComment } from '../types.ts';
import { useCommentsToData } from '../hooks/useCommentsToData.ts';
import { Paper } from './shared.tsx';
import { Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export const RatingBlock: FC<{ comments: IComment[] }> = ({ comments }) => {
  const { totalRating, positive, negative } = useCommentsToData(comments);
  const gaugeValue = useMemo(() => {
    const rating = totalRating / comments.length;
    if (rating < 0) return 0;
    return rating * 100;
  }, [comments.length, totalRating]);

  return (
    <Paper>
      <Typography variant="h5">Rating</Typography>
      <Gauge
        value={gaugeValue}
        startAngle={-90}
        endAngle={90}
        sx={{
          height: '250px',
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 24,
            transform: 'translate(0px, 0px)',
          },
        }}
        text={() => `↑ ${positive} | ${negative} ↓`}
      />
    </Paper>
  );
};
