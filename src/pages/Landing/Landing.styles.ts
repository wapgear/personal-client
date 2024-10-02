import styled from '@emotion/styled';
import { forMobiles } from '../../utils/breakpoints';
import { css } from '@emotion/react';

export const AvatarContainer = styled.div`
  img {
    border-radius: 24px;
    box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.08);

    ${forMobiles(css`
      width: 100%;
    `)};
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: #248a3d;
  }

  h1 {
    font-feature-settings:
      'clig' off,
      'liga' off;
    font-family: 'Gilroy', sans-serif;
    font-size: 36px;
    font-style: normal;
    font-weight: 500;
    line-height: 48px; /* 133.333% */
    letter-spacing: 0.25px;

    ${forMobiles(css`
      font-size: 28px;
      line-height: 42px;
    `)};

    margin-bottom: 32px;
    margin-top: 0;
  }

  p {
    margin: 0;
  }

  p + p {
    margin-top: 24px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 52px;

  ${forMobiles(css`
    margin-top: 40px;
    justify-content: center;
  `)};
`;

export const Social = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 40px;

  a {
    filter: grayscale(100%);

    &:hover {
      filter: grayscale(20%);
    }

    &:active {
      filter: grayscale(0%);
    }
  }
`;
