import { Box, Button } from '@mui/material';
import { Title } from './Title.tsx';
import { About } from './About.tsx';
import { SwitchMode } from '../../layout/LandingLayoutV3/SwitchMode.tsx';
import { Employment } from './Employment.tsx';
import { Education } from './Education.tsx';
import { Buzzwords } from './Buzzwords.tsx';

export const CVPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: 2,
        p: 2,
        maxWidth: '1280px',
        margin: '0 auto',
        '& *': {
          fontFamily: "'Georgia', serif !important",
        },
      }}
    >
      <Title />
      <About />
      <Employment />
      <Education />
      <Buzzwords />
      <Box
        sx={{
          '@media print': {
            display: 'none',
          },
        }}
      >
        <SwitchMode />
        <Actions />
      </Box>
    </Box>
  );
};

const Actions = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Button color="primary" onClick={() => window.print()}>
        DOWNLOAD PDF
      </Button>
    </Box>
  );
};
