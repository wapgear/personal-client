import { useDashboardStore } from '../../../store.ts';
import { Close, Menu } from '@mui/icons-material';

export const Toggle = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useDashboardStore();

  return isDrawerOpen ? (
    <Close onClick={() => setIsDrawerOpen(false)} />
  ) : (
    <Menu onClick={() => setIsDrawerOpen(true)} />
  );
};
