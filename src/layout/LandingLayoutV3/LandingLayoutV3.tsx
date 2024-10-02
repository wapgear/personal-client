import { Outlet } from 'react-router-dom';

import { Container, HeaderContainer } from './LandingLayoutV3.styles';
import { Box, Link } from '@mui/material';
import { SwitchMode } from './SwitchMode.tsx';

export const LandingLayoutV3 = () => {
  return (
    <Container>
      <Header />
      <Box
        sx={{
          padding: '48px 24px',
        }}
      >
        <Outlet />
      </Box>
      <SwitchMode />
    </Container>
  );
};

const Header = () => {
  return (
    <HeaderContainer>
      <Link href="/">ANTON IZMAILOV</Link>
      <Link href="/map">💥🧙‍♂️ DEVELOPER</Link>
    </HeaderContainer>
  );
};
