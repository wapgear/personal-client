import { CssVarsThemeOptions } from '@mui/material/styles';
import type { LinkProps } from '@mui/material/Link';
import { experimental_extendTheme } from '@mui/material';
import { LinkBehavior } from './LinkBehavior.tsx';

const colorSchemes: CssVarsThemeOptions['colorSchemes'] = {
  light: {
    palette: {
      primary: {
        main: '#248A3D',
      },
      secondary: {
        main: '#121212',
      },
      linkButtonBackground: '#1c1c1c',
      text: {
        primary: '#121212',
        secondary: '#FDFDFD',
      },
      textStatic: {
        primary: '#FDFDFD',
        secondary: '#121212',
      },
      background: {
        default: '#FDFDFD',
      },
    },
  },
  dark: {
    palette: {
      primary: {
        main: '#248A3D',
      },
      secondary: {
        main: '#FDFDFD',
      },
      linkButtonBackground: '#1c1c1c',
      text: {
        primary: '#FDFDFD',
        secondary: '#9d9d9d',
        dark: '#121212',
      },
      background: {
        default: '#121212',
      },
    },
  },
};

export const theme = experimental_extendTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
      styleOverrides: {
        root: {
          borderRadius: 50,
          '&:hover': {
            filter: 'brightness(0.9)',
          },
          '&:active': {
            filter: 'brightness(0.8)',
          },
        },
        colorPrimary: {
          backgroundColor: 'primary.main',
          color: '#FDFDFD',
        },
        sizeSmall: {
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
        },
        sizeMedium: {
          padding: '0.5rem 1rem',
          fontSize: '1rem',
        },
        sizeLarge: {
          padding: '1rem 2rem',
          fontSize: '1.5rem',
        },
      },
    },
  },
  colorSchemes,
  typography: {
    fontFamily: 'Gilroy, Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
  },
});
