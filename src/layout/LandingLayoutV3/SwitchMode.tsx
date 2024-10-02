import { useColorScheme } from '@mui/material';
import { useEffect } from 'react';
import { Eclipse, SwitchModeContainer, Value } from './LandingLayoutV3.styles.ts';

export const SwitchMode = () => {
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    if (mode) {
      localStorage.setItem('selected-theme', mode);
    }
  }, [mode]);

  return (
    <SwitchModeContainer onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} isNight={mode === 'dark'}>
      <Eclipse />
      <Value>{mode === 'dark' ? 'PM' : 'AM'}</Value>
    </SwitchModeContainer>
  );
};
