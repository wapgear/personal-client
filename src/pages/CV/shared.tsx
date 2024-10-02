import { FC, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

export const List: FC<{ children: ReactNode; gap?: number }> = ({ children, gap = 4 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        py: 2,
      }}
    >
      {children}
    </Box>
  );
};

interface ListItemProps {
  position: string;
  company?: string;
  location?: string;
  date?: string;
  description?: string;
  children?: ReactNode;
  isContractor?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
  position,
  company,
  location,
  date,
  children,
  description,
  isContractor = false,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box sx={{ flex: 1, pl: 1.5 }}>
          <Typography variant="body1" fontSize="18px">
            {position}
            {company ? <>, {company}</> : ''}
          </Typography>
          <Typography variant="body1" fontSize="14px" mt="-4px">
            {description} {isContractor && <ContractorBadge />}
          </Typography>
        </Box>
        {location && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body1">{location}</Typography>
          </Box>
        )}
        {date && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="body1">{date}</Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          '& > *': {
            position: 'relative',
            pl: 1.5,
            maxWidth: '90%',
            '&:before': {
              content: '"-"',
              display: 'block',
              width: '1px',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            },
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const ContractorBadge = () => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-0.075em',
        fontSize: '10px',
        color: 'error.main',
      }}
      component="span"
    >
      CONTRACTOR
    </Box>
  );
};
