import { FC, useMemo } from 'react';
import { IComment } from '../types.ts';
import { Box, Typography } from '@mui/material';
import { Paper } from './shared.tsx';

export const Comments: FC<{ comments: IComment[] }> = ({ comments }) => {
  return (
    <Paper>
      <Typography variant="h5">User opinions</Typography>

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {comments.length === 0 ? (
          <Typography variant="body1">No comments yet</Typography>
        ) : (
          comments.map((comment) => <Comment key={comment.wallet_id + comment.owner} {...comment} />)
        )}
      </Box>
    </Paper>
  );
};

const Comment: FC<IComment> = ({ owner, status, text, created_at }) => {
  const color = useMemo(() => {
    if (status === 'positive') return 'success';
    if (status === 'negative') return 'error';
    return 'secondary';
  }, [status]);

  return (
    <Box
      sx={{
        pt: 1,
        pb: 2,
        px: 2,
        borderRadius: '12px',
        border: '1px solid #3f3f3f',
      }}
    >
      <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">{owner}</Typography>
            <Typography variant="h6">|</Typography>
            <Typography variant="h6" color={`${color}.main`}>
              {status}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="caption">{new Date(created_at).toDateString()}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="body1">{text}</Typography>
      </Box>
    </Box>
  );
};
