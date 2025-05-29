import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StrictMode, useMemo } from 'react';
import { LandingLayoutV3 } from './layout/LandingLayoutV3/LandingLayoutV3';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';

const router = createBrowserRouter([
  {
    path: '/cv',
    lazy: async () => {
      const { CVPage } = await import('./pages/CV/CV.page');
      return { Component: CVPage };
    },
  },
  {
    path: '/',
    element: <LandingLayoutV3 />,
    children: [
      {
        path: '/',
        lazy: async () => {
          const { LandingPage } = await import('./pages/Landing/Landing.page');
          return { Component: LandingPage };
        },
      },
      {
        path: '/map',
        lazy: async () => {
          const { WorldMap } = await import('./pages/Map/Map.page');
          return { Component: WorldMap };
        },
      },
    ],
  },
]);

function App() {
  const defaultMode = useMemo(() => {
    const ls = localStorage.getItem('selected-theme');
    if (ls && ['light', 'dark'].includes(ls)) {
      return ls as 'light' | 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  return (
    <StrictMode>
      <ThemeProvider theme={theme} defaultMode={defaultMode}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  );
}

export default App;
