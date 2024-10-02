import { Outlet } from 'react-router-dom';
import { Box, CircularProgress, Drawer, Typography } from '@mui/material';
import { TonConnectButton, TonConnectUIProvider, useIsConnectionRestored, useTonWallet } from '@tonconnect/ui-react';
import { DashboardLayoutV3Sidebar } from '../../pages/dashboard/Sidebar/DashboardLayoutV3.sidebar';
import { useMemo } from 'react';
import { useBreakpointUtils } from '../../utils/breakpoints';
import { useDashboardStore } from '../../store';
import { Toggle } from '../../pages/dashboard/Sidebar/Dashboard.toggle';
import { useTonMagic } from '../../hooks/useTonMagic';

export const ProtectedTonDashboard = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://izmailov.dev/ton-manifest.json">
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <DashboardLayoutV3Content />
      </Box>
    </TonConnectUIProvider>
  );
};

const DashboardLayoutV3Content = () => {
  const wallet = useTonWallet();
  const connectionRestored = useIsConnectionRestored();
  if (!connectionRestored) {
    return <ConnectionRestored />;
  }

  if (!wallet) {
    return <ConnectWallet />;
  }

  return <DashboardProtectedContent />;
};

const DashboardProtectedContent = () => {
  useTonMagic();
  const { isMobile } = useBreakpointUtils();
  const { isDrawerOpen, setIsDrawerOpen } = useDashboardStore();

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        variant={isMobile ? 'temporary' : 'permanent'}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          width: '300px',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            borderRadius: 0,
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px',
          },
        }}
      >
        <DashboardLayoutV3Sidebar />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, px: [2, 4], height: '100dvh' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
            px: 0,
          }}
        >
          {isMobile && <Box>{!isDrawerOpen && <Toggle />}</Box>}
          <Box>
            <Typography variant="h6">Dashboard</Typography>
          </Box>
        </Box>
        <Outlet />
      </Box>
    </>
  );
};

// They should be funny
const loadingPhrases = [
  'Hold on a second magic is happening',
  'Just a moment, we are almost there',
  'Fasten your seatbelt, nothing will happen in a moment',
  'Bouncing the signal off the satellite',
  'Freeing up the hamsters',
  'Shovelling coal into the server',
];

const ConnectionRestored = () => {
  const randomPhrase = useMemo(() => loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)], []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4">{randomPhrase}</Typography>
      <Box>
        <CircularProgress
          sx={{
            width: 48,
            height: 48,
          }}
        />
      </Box>
    </Box>
  );
};

const ConnectWallet = () => {
  const wallet = useTonWallet();

  if (wallet) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h4">Before you can continue, please connect your wallet</Typography>

      <TonConnectButton />
    </Box>
  );
};
