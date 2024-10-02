import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StrictMode, useMemo } from 'react';
import { LandingLayoutV3 } from './layout/LandingLayoutV3/LandingLayoutV3';
import { ProtectedTonDashboard } from './layout/DashboardLayoutV3/ProtectedTonDashboard';
import { CssBaseline, Experimental_CssVarsProvider } from '@mui/material';
import { theme } from './theme';
import { TonCheckWrapper } from './pages/dashboard/TonCheck';
import { InjectFonts } from './InjectFonts.tsx';

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
    element: <InjectFonts />,
    children: [
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
      {
        path: '/',
        element: <ProtectedTonDashboard />,
        children: [
          {
            path: '/tts',
            lazy: async () => {
              const { TTSPage } = await import('./pages/dashboard/tts/TTS.page');
              return { Component: TTSPage };
            },
          },
          {
            path: '/ton-space',
            lazy: async () => {
              const { TonSpacePage } = await import('./pages/dashboard/TonSpace/TonSpace.page');
              return { Component: TonSpacePage };
            },
          },
        ],
      },
      {
        path: '/',
        element: <TonCheckWrapper />,
        children: [
          {
            path: '/ton-check',
            lazy: async () => {
              const { LandingPage } = await import('./pages/dashboard/TonCheck/pages/Landing.page.tsx');
              return { Component: LandingPage };
            },
          },
          {
            path: '/ton-check/:wallet',
            lazy: async () => {
              const { WalletDetailsPage } = await import('./pages/dashboard/TonCheck/pages/WalletDetails.page.tsx');
              return { Component: WalletDetailsPage };
            },
          },
        ],
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
      <Experimental_CssVarsProvider theme={theme} defaultMode={defaultMode}>
        <CssBaseline />
        <RouterProvider router={router} />
      </Experimental_CssVarsProvider>
    </StrictMode>
  );
}

export default App;
