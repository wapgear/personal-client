import { ExclusiveDashboard } from '../../../layout/DashboardLayoutV3/ExclusiveDashboard.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const queryClient = new QueryClient();

export const TonCheckWrapper = () => {
  return (
    <>
      <script type="module">
        {`
        import {Buffer} from 'buffer';

        window.Buffer = Buffer;
        `}
      </script>
      <TonConnectUIProvider manifestUrl="https://izmailov.dev/ton-check-manifest.json">
        <QueryClientProvider client={queryClient}>
          <ExclusiveDashboard />
        </QueryClientProvider>
      </TonConnectUIProvider>
    </>
  );
};
