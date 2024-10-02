import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

const Container = styled('div')`
  height: 100dvh;
`;

export const ExclusiveLayout = () => (
  <Container>
    <Outlet />
  </Container>
);
