import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { forMobiles, forTabletsAndDesktop } from '../../utils/breakpoints';

export const Eclipse = styled('div')`
  border-radius: 50%;
  background-color: var(--mui-palette-text-primary);
  width: 16px;
  height: 16px;
`;

export const Value = styled('div')`
  color: var(--mui-palette-text-primary);
  text-align: center;
  font-feature-settings:
    'clig' off,
    'liga' off;
  font-family: 'Gilroy', sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 180% */
  letter-spacing: 0.25px;
`;

export const SwitchModeContainer = styled('div')<{
  isNight: boolean;
}>`
  cursor: pointer;
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  width: 24px;
  height: 44px;
  padding: 4px;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  flex-shrink: 0;
  user-select: none;

  border-radius: 34px;
  background: var(--mui-palette-background-default);
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.12);

  ${Eclipse}, ${Value} {
    transition: transform 0.2s ease-in-out;

    ${forMobiles(css`
      transform: translateX(0);
    `)};

    ${forTabletsAndDesktop(css`
      transform: translateY(0);
    `)};
  }

  ${({ isNight }) =>
    isNight &&
    css`
      ${Value} {
        ${forMobiles(css`
          transform: translateX(-22px);
        `)};

        ${forTabletsAndDesktop(css`
          transform: translateY(-18px);
        `)};
      }

      ${Eclipse} {
        ${forMobiles(css`
          transform: translateX(18px);
        `)};

        ${forTabletsAndDesktop(css`
          transform: translateY(18px);
        `)};
        background-color: var(--mui-palette-primary-main);
      }
    `};

  ${forMobiles(css`
    width: 50px;
    height: 24px;

    flex-direction: row;

    gap: 4px;
    padding: 3px 8px 3px 3px;

    bottom: 10px;
    right: 12px;
  `)}
`;

export const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 24px;

  ${forMobiles(css`
    padding: 24px;
  `)}

  color: var(--mui-palette-text-primary);

  a {
    text-decoration: none;
    color: var(--mui-palette-text-primary);
  }
`;

export const Container = styled('div')`
  min-height: 100dvh;
  min-width: 100vw;
`;
