import styled from '@emotion/styled';

export const Container = styled('div')`
  position: relative;
  width: calc(100vw);
  margin-left: -24px;
  height: calc(100vh - 216px);
  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    display: block;
  }
`;
